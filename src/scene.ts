import { Actor, ActorInstance } from './actor';
import { Texture } from './texture';
import { Renderer } from './renderer';
import { Color } from './material';
import { StaticMesh } from './components/static_mesh';
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
	uniforms?: UniformValues = {
		uShadowMap: null,
	};

	constructor(renderer: Renderer) {
		this.renderer = renderer;
	}

	addActor(actor: Actor): number {
		const { children } = actor;

		for (const component of actor.getComponentsOfType(StaticMesh)) {
			this.renderer.uploadMesh(component.mesh);
		}

		if (actor.material?.texture) {
			this.addTexture(actor.material.texture);
		}

		for (const child of children) {
			for (const component of child.getComponentsOfType(StaticMesh)) {
				this.renderer.uploadMesh(component.mesh);
			}

			if (child.material?.texture) {
				this.addTexture(child.material.texture);
			}
		}

		this.uploadActorInstances(actor);

		this.actors.push(actor);
		return this.actors.length - 1;
	}

	uploadActorInstances(actor: Actor) {
		const { hasInstances } = actor;
		if (!hasInstances) {
			return;
		}

		const data = Array.from(actor.instances.values()).map((i: ActorInstance) => i.data)

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
		this.updateShadowMap();
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

		const proj = this.light.projection.clone();
		const view = this.light.view.inverse();
		const viewProj = proj.multiply(view);
		const lightDir = normalize(this.light.view.transformPoint3([0.0, 0.0, -1.0]));

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
