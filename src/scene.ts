import { Actor, ActorInstance } from './actor';
import { Texture } from './texture';
import { Renderer } from './renderer';
import { Color } from './material';
import { StaticMesh } from './components/static_mesh';
import { Light as LightComponent } from './components/light';
import { UniformValues } from './shader';
import { RenderTexture, Attachment } from './render_texture';
import { Light } from './light';
import { normalize } from './geom';

export class Scene {
	actors: Actor[] = [];
	textures: Map<number, Texture> = new Map();
	renderer: Renderer;
	backgroundColor: Color = [0.0, 0.0, 0.0, 1.0];
	shadowMap: RenderTexture;
	light: Light;
	lights: Actor[] = [];
	castShadows: false;
	uniforms?: UniformValues = {
		uShadowMap: null,
		uLight: null,
		uLightDir: null,
	};

	constructor(renderer: Renderer) {
		this.renderer = renderer;
	}

	addActor(actor: Actor): number {
		const { children } = actor;

		const uploadActor = (actor: Actor) => {
			// Keep track of lights
			if (actor.hasComponentOfType(LightComponent)) {
				this.lights.push(actor);
			}

			// Upload the mesh
			for (const component of actor.getComponentsOfType(StaticMesh)) {
				this.renderer.uploadMesh(component.mesh);
			}

			// Upload textures
			if (actor.material?.texture) {
				this.addTexture(actor.material.texture);
			}
			if (actor.material?.normalMap) {
				this.addTexture(actor.material.normalMap);
			}
			if (actor.material?.specularMap) {
				this.addTexture(actor.material.specularMap);
			}
			if (actor.material?.displacementMap) {
				this.addTexture(actor.material.displacementMap);
			}

			this.uploadActorInstances(actor);
		};

		uploadActor(actor);

		for (const child of children) {
			uploadActor(child);
		}

		this.actors.push(actor);
		return this.actors.length - 1;
	}

	uploadActorInstances(actor: Actor) {
		const { hasInstances } = actor;
		if (!hasInstances) {
			return;
		}

		const data = Array.from(actor.instances.values()).map((i: ActorInstance) => i.data);

		for (const component of actor.getComponentsOfType(StaticMesh)) {
			this.renderer.uploadMeshInstances(component.mesh, data);
		}
	}

	addTexture(texture: Texture): number {
		const id = this.renderer.uploadTexture(texture);
		this.textures.set(id, texture);
		return id;
	}

	getIdOfTexture(texture: Texture): number | null {
		for (let [id, value] of this.textures.entries()) {
			if (value === texture) return id;
		}

		return null;
	}

	updateTexture(textureOrId: Texture | number) {
		if (typeof textureOrId === 'number') {
			const texture = this.textures.get(textureOrId);
			if (!texture) {
				throw `Unable to find texture ${textureOrId}`;
			}
			this.renderer.uploadTexture(texture, textureOrId);
		} else {
			const id = this.getIdOfTexture(textureOrId);
			if (id == null) {
				throw `Attempted to upload an unknown texture`;
			}
			this.renderer.uploadTexture(textureOrId, id);
		}
	}

	bindTexture(textureOrId: Texture | number): number {
		const texture = typeof textureOrId === 'number' ? this.textures.get(textureOrId) : textureOrId;
		if (!texture) {
			throw `Unable to find texture`;
		}
		return this.renderer.bindTexture(texture);
	}

	unbindTexture(textureOrId: Texture | number) {
		const texture = typeof textureOrId === 'number' ? this.textures.get(textureOrId) : textureOrId;
		if (!texture) {
			throw `Unable to find texture`;
		}
		this.renderer.unbindTexture(texture);
	}

	async draw(): Promise<number> {
		if (this.castShadows) {
			this.updateShadowMap();
		}
		this.updateLightView();
		return await this.renderer.drawScene(this);
	}

	protected createShadowMap() {
		const gl = (this.renderer as any).gl as WebGLRenderingContext;

		const ext = gl.getExtension('WEBGL_depth_texture');
		if (!ext) {
			throw `WEBGL_depth_texture extension is not supported`;
		}

		this.shadowMap = new RenderTexture(1024, Attachment.DEPTH);
	}

	protected updateShadowMap() {
		if (!this.light) return;
		if (!this.shadowMap) this.createShadowMap();

		const hiddenActors = [];
		for (const actor of this.actors) {
			if (actor.visible && actor.material && !actor.material.castsShadows) {
				actor.visible = false;
				hiddenActors.push(actor);
			}
		}
		this.disableShadows();
		const oldCamera = this.renderer.camera;
		this.renderer.camera = this.light;
		this.renderer.drawScene(this, this.shadowMap);
		this.renderer.camera = oldCamera;
		this.enableShadows();
		for (const actor of hiddenActors) {
			actor.visible = true;
		}
	}

	protected updateLightView() {
		if (!this.light) return;
		const proj = this.light.projection.clone();
		const view = this.light.view.inverse();
		const viewProj = proj.multiply(view);
		const forward = this.light.view.multiplyVector4([0.0, 0.0, 1.0, 0.0]);
		const lightDir = normalize([forward[0], forward[1], forward[2]]);

		this.uniforms.uLightDir = lightDir;
		this.uniforms.uLight = viewProj;
	}

	private enableShadows() {
		this.uniforms.uShadowMap = this.bindTexture(this.shadowMap);
	}

	private disableShadows() {
		this.unbindTexture(this.shadowMap);
		this.uniforms.uShadowMap = null;
	}
}
