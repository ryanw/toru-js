import { Renderer } from './renderer';
import { Shader, ShaderOptions } from '../shader';
import { Vertex } from './vertex';
import { Actor, Instance } from '../actor';
import { Matrix4 } from '../geom';
import { Mesh } from '../mesh';
import { Scene } from '../scene';
import { Texture } from '../texture';
import { UniformValues } from '../shader';
import { WebGLMesh } from './webgl_mesh';
import { WebGLRendererTexture } from './webgl_texture';
import { WebGLRenderTarget } from './webgl_render_target';
import { StaticMesh } from '../components/static_mesh';
import { Light } from '../components/light';
import { RenderTexture, Attachment } from '../render_texture';
import defaultVertSource from '../shaders/wireframe.vert.glsl';
import defaultFragSource from '../shaders/wireframe.frag.glsl';

const DEBUG_ENABLED = !PRODUCTION || window.location.search.indexOf('debug') !== -1;

export class WebGLRenderer extends Renderer {
	canvas: HTMLCanvasElement;
	debugEl: HTMLElement;
	defaultShader: Shader;
	scale = 1.0 * window.devicePixelRatio;
	lineWidth = 2 * window.devicePixelRatio;
	antiAlias = true;
	vsync = true;
	lastFrameAt = 0;
	frameAverage = 0;
	frame = 0;
	isGrabbed = false;
	seed = Math.random();
	private context: WebGLRenderingContext;
	private textures: Map<Texture, WebGLRendererTexture> = new Map();
	private meshes: Map<Mesh<Vertex>, WebGLMesh<Vertex>> = new Map();
	private renderTargets: Map<RenderTexture, WebGLRenderTarget> = new Map();

	constructor(el: HTMLElement) {
		super();
		if (el instanceof HTMLCanvasElement) {
			this.canvas = el;
		} else {
			this.canvas = document.createElement('canvas');
			if (el instanceof HTMLElement) {
				this.attach(el);
			}
		}

		Object.assign(this.canvas.style, {
			position: 'fixed',
			zIndex: -1,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		});
	}

	/**
	 * The canvas's parent element
	 */
	get parentElement(): HTMLCanvasElement['parentElement'] {
		return this.canvas.parentElement;
	}

	/**
	 * The WebGL drawing context
	 */
	get gl(): WebGLRenderingContext {
		if (this.context) {
			return this.context;
		}

		const options = {
			antialias: this.antiAlias,
		};

		this.context = this.canvas.getContext('webgl', options) as WebGLRenderingContext;
		if (!this.context) {
			this.parentElement.innerHTML = 'Failed to create a WebGL context';
			throw 'Failed to create WebGL context';
		}

		return this.context;
	}

	get width(): number {
		return this.canvas.clientWidth;
	}

	get height(): number {
		return this.canvas.clientHeight;
	}

	/**
	 * Creates the WebGL buffers, compiles the shaders, etc.
	 */
	private initWebGL() {
		const gl = this.gl;

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		this.defaultShader = this.createShader(defaultVertSource, defaultFragSource);
	}

	grab(lock: boolean = false) {
		if (lock) {
			this.canvas.requestPointerLock();
		}
		this.isGrabbed = true;
		this.addEventListeners();
	}

	release() {
		this.isGrabbed = false;
		document.exitPointerLock();
		this.removeEventListeners();
	}

	addEventListeners() {
		document.addEventListener('pointerlockchange', this.onPointerLockChange);
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mouseup', this.onMouseUp);
		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('wheel', this.onWheel);
	}

	removeEventListeners() {
		this.heldKeys.clear();
		document.removeEventListener('pointerlockchange', this.onPointerLockChange);
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('mousedown', this.onMouseDown);
		window.removeEventListener('wheel', this.onWheel);
	}

	onPointerLockChange = () => {
		if (!this.isGrabbed) {
			this.removeEventListeners();
		}
	};

	onKeyDown = (e: KeyboardEvent) => {
		this.heldKeys.add(e.key.toLowerCase());
	};

	onKeyUp = (e: KeyboardEvent) => {
		this.heldKeys.delete(e.key.toLowerCase());
	};

	onMouseDown = (e: MouseEvent) => {
		this.mouseButtons.add(e.button);
	};

	onMouseUp = (e: MouseEvent) => {
		this.mouseButtons.delete(e.button);
	};

	onMouseMove = (e: MouseEvent) => {
		this.mousePosition[0] = e.clientX;
		this.mousePosition[1] = e.clientY;
		this.mouseMovement[0] += e.movementX;
		this.mouseMovement[1] += e.movementY;
	};

	onWheel = (e: WheelEvent) => {
		const dx = e.deltaX;
		const dy = e.deltaY;
		this.wheelMovement[0] += dx;
		this.wheelMovement[1] += dy;
	};

	clear() {
		const gl = this.gl;
		gl.clearDepth(1.0);
		gl.clearColor(...this.backgroundColor);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	drawActorWithShader(shader: Shader, actor: Actor, projection?: Matrix4, options: { parentModel?: Matrix4 } = {}) {
		if (!actor.visible) return;
		const { model, material, children } = actor;
		const { parentModel } = options;

		const actorModel = parentModel ? parentModel.multiply(model) : model;

		if (material) {
			actor.uniforms['uMaterial.color'] = material.color.length === 3 ? [...material.color, 1.0] : material.color;
			actor.uniforms['uFillColor'] = actor.uniforms['uMaterial.color'];
			actor.uniforms['uMaterial.hasTexture'] = !!material.texture;
			actor.uniforms['uMaterial.hasNormalMap'] = !!material.normalMap;
			actor.uniforms['uMaterial.hasSpecularMap'] = !!material.specularMap;
			actor.uniforms['uMaterial.castsShadows'] = material.castsShadows;
			actor.uniforms['uMaterial.receivesShadows'] = material.receivesShadows;
			actor.uniforms['uMaterial.emissive'] = material.emissive;
			if (material.texture) {
				actor.uniforms['uMaterial.texture'] = this.bindTexture(material.texture);
			}
			if (material.normalMap) {
				actor.uniforms['uMaterial.normalMap'] = this.bindTexture(material.normalMap);
			}
			if (material.specularMap) {
				actor.uniforms['uMaterial.specularMap'] = this.bindTexture(material.specularMap);
			}
		}

		if (projection) {
			shader.setUniform('uViewProj', projection);
		}
		shader.setUniform('uModel', actorModel);

		for (const uniformName in actor.uniforms) {
			shader.setUniform(uniformName, actor.uniforms[uniformName]);
		}


		// Find mesh to draw
		const mesh = actor.getComponentsOfType(StaticMesh)[0]?.mesh;
		if (mesh) {
			let glMesh = this.meshes.get(mesh);
			if (!glMesh) {
				this.uploadMesh(mesh);
				glMesh = this.meshes.get(mesh);
			}

			shader.bind(glMesh);
			if (actor.hasInstances) {
				shader.bindInstances(this.gl, glMesh);
				glMesh.drawInstances();
			} else {
				glMesh.draw();
			}
		}

		// Draw children
		for (const child of children) {
			this.drawActorWithShader(shader, child, projection, { ...options, parentModel: actorModel });
		}
	}

	drawActor(actor: Actor, projection?: Matrix4, options: { parentModel?: Matrix4, uniforms?: UniformValues } = {}) {
		if (!actor.visible) return;
		const { model, material, children } = actor;
		const { parentModel } = options;
		const actorModel = parentModel ? parentModel.multiply(model) : model;

		if (material) {
			actor.uniforms['uMaterial.color'] = material.color.length === 3 ? [...material.color, 1.0] : material.color;
			actor.uniforms['uMaterial.hasTexture'] = !!material.texture;
			actor.uniforms['uMaterial.hasNormalMap'] = !!material.normalMap;
			actor.uniforms['uMaterial.hasSpecularMap'] = !!material.specularMap;
			actor.uniforms['uMaterial.castsShadows'] = material.castsShadows;
			actor.uniforms['uMaterial.receivesShadows'] = material.receivesShadows;
			actor.uniforms['uMaterial.emissive'] = material.emissive;
			if (material.texture) {
				actor.uniforms['uMaterial.texture'] = this.bindTexture(material.texture);
			}
			if (material.normalMap) {
				actor.uniforms['uMaterial.normalMap'] = this.bindTexture(material.normalMap);
			}
			if (material.specularMap) {
				actor.uniforms['uMaterial.specularMap'] = this.bindTexture(material.specularMap);
			}
		}

		// TODO support multiple meshes on one actor?
		const mesh = actor.getComponentsOfType(StaticMesh)[0]?.mesh;

		if (actor.shader && !actor.shader.compiled) {
			actor.shader.make(this.gl);
		}

		// FIXME reuse this
		const view = this.camera.view.inverse();

		if (mesh instanceof Mesh) {
			const gl = this.gl;
			const shader = actor.shader || this.defaultShader;
			const uniforms = shader.uniforms;
			shader.use();

			let glMesh = this.meshes.get(mesh);
			if (!glMesh) {
				this.uploadMesh(mesh);
				glMesh = this.meshes.get(mesh);
			}

			// FIXME deprecate all this
			if (projection) {
				gl.uniformMatrix4fv(uniforms.uViewProj.location, false, projection.toArray());
			}
			gl.uniformMatrix4fv(uniforms.uView.location, false, view.toArray());
			gl.uniform4fv(uniforms.uFogColor.location, this.backgroundColor);
			gl.uniform1f(uniforms.uLineWidth.location, this.lineWidth);
			gl.uniform1f(uniforms.uTime.location, performance.now());
			gl.uniform2fv(uniforms.uResolution.location, [this.camera.width, this.camera.height]);
			gl.uniform1f(uniforms.uSeed.location, this.seed);
			gl.uniformMatrix4fv(uniforms.uModel.location, false, actorModel.toArray());
			if (material?.color) {
				gl.uniform4fv(uniforms.uFillColor.location, actor.uniforms['uMaterial.color'] as number[]);
			}

			if (options?.uniforms) {
				for (const uniformName in options.uniforms) {
					if (shader.uniforms[uniformName]) {
						shader.setUniform(uniformName, options.uniforms[uniformName]);
					}
				}
			}
			for (const uniformName in actor.uniforms) {
				shader.setUniform(uniformName, actor.uniforms[uniformName]);
			}


			shader.bind(glMesh);
			if (actor.hasInstances) {
				shader.bindInstances(gl, glMesh);
				glMesh.drawInstances();
			} else {
				glMesh.draw();
			}
		}

		for (const child of children) {
			this.drawActor(child, projection, { ...options, parentModel: actorModel });
		}
	}

	uploadMesh(mesh: Mesh) {
		const gl = this.gl;

		// Link a Mesh with its WebGLMesh
		let glMesh = this.meshes.get(mesh);
		if (!glMesh) {
			glMesh = new WebGLMesh(gl);
			this.meshes.set(mesh, glMesh);
		}
		glMesh.upload(mesh);
	}

	uploadMeshInstances<I extends Instance = Instance>(mesh: Mesh, instances: I[]) {
		const gl = this.gl;

		// Link a Mesh with its WebGLMesh
		let glMesh = this.meshes.get(mesh);
		if (!glMesh) {
			glMesh = new WebGLMesh(gl);
			this.meshes.set(mesh, glMesh);
			glMesh.upload(mesh);
		}
		glMesh.uploadInstances(instances);
	}

	removeMesh(mesh: Mesh<Vertex>) {
		const glMesh = this.meshes.get(mesh);
		if (!glMesh) return;
		throw 'not yet implemented';
	}

	uploadTexture(texture: Texture, unit: number = null): number {
		const gl = this.gl;

		// Link a Texture with its WebGLRendererTexture
		let glTexture = this.textures.get(texture);
		if (!glTexture) {
			glTexture = WebGLRendererTexture.fromTexture(gl, texture);
			this.textures.set(texture, glTexture);
		}
		if (!unit && !glTexture.unit) {
			unit = this.textures.size;
		}
		glTexture.upload(texture, unit != null ? unit : glTexture.unit);

		return unit;
	}

	bindTexture(texture: Texture): number {
		let glTexture = this.textures.get(texture);
		if (!glTexture) {
			this.uploadTexture(texture);
			glTexture = this.textures.get(texture);
		}
		return glTexture.bind();
	}

	unbindTexture(texture: Texture) {
		let glTexture = this.textures.get(texture);
		if (!glTexture) {
			return;
		}
		glTexture.unbind();
	}

	createShader(vertSource: string, fragSource: string, options?: ShaderOptions): Shader {
		return new Shader(this.gl, vertSource, fragSource, options);
	}

	/**
	 * Wait for next animation frame and redraw everything
	 */
	async drawScene(scene: Scene, target?: RenderTexture): Promise<number> {
		return new Promise((resolve) => {
			const draw = () => {
				const now = performance.now();
				const dt = (now - this.lastFrameAt) / 1000.0;
				this.drawSync(scene, target);

				this.frame++;
				if (DEBUG_ENABLED && this.frame % 60 === 0) {
					const frameRate = (performance.now() - this.frameAverage) / 60;
					this.frameAverage = performance.now();
					const fps = (1 / (frameRate / 1000)) | 0;
					this.debugEl.innerHTML = `${fps} fps`;
				}

				resolve(dt);
			};

			if (target) {
				this.drawSync(scene, target);
				resolve(0);
			} else if (this.vsync) {
				window.requestAnimationFrame(draw);
			} else {
				setTimeout(draw, 0);
			}
		});
	}

	drawSync(scene: Scene, texture?: RenderTexture) {
		// Drawing to a texture
		let target;
		if (texture) {
			target = this.renderTargets.get(texture);
			if (!target) {
				this.uploadTexture(texture);
				const glTexture = this.textures.get(texture);
				target = new WebGLRenderTarget(this.gl, texture.size, glTexture);
				if (texture.attachment === Attachment.DEPTH) {
					target.attachment = this.gl.DEPTH_ATTACHMENT;
				}

				this.renderTargets.set(texture, target);
			}
			
			// Resize to match size of texture
			this.updateSize(texture.size, texture.size);
			target.bind();
		}

		this.backgroundColor = [...scene.backgroundColor];
		const now = performance.now();
		this.lastFrameAt = now;

		this.gl.viewport(0, 0, this.camera.width, this.camera.height);
		this.clear();

		// Uniforms
		const proj = this.camera.projection.clone();
		const view = this.camera.view.inverse();
		const viewProj = proj.multiply(view);

		// Batch shaders together
		const shaderMap = new Map<Shader, Actor[]>();
		for (const actor of scene.actors) {
			const shader = actor.shader;
			if (!shader) continue;
			if (!shaderMap.get(shader)) {
				shaderMap.set(shader, [])
			}
			shaderMap.get(shader).push(actor);
		}

		for (const shader of shaderMap.keys()) {
			if (!shader.compiled) {
				shader.make(this.gl);
			}
			shader.use();


			// Various global uniforms
			shader.setUniform('uView', view);
			shader.setUniform('uFogColor', this.backgroundColor);
			shader.setUniform('uLineWidth', this.lineWidth);
			shader.setUniform('uTime', performance.now());
			shader.setUniform('uResolution', [this.camera.width, this.camera.height]);
			shader.setUniform('uSeed', this.seed);

			// Scene defined uniforms
			for (const uniformName in scene.uniforms) {
				shader.setUniform(uniformName, scene.uniforms[uniformName]);
			}

			// Lights
			const lightCount = scene.lights.length;
			shader.setUniform('uLightCount', lightCount);
			for (let i = 0; i < lightCount; i++) {
				const position = scene.lights[i].position;
				const light = scene.lights[i].getComponentsOfType(Light)[0] as Light;
				shader.setUniform(`uLights[${i}].position`, position);
				shader.setUniform(`uLights[${i}].diffuse`, light.diffuse);
				shader.setUniform(`uLights[${i}].ambient`, light.ambient);
			}

			// Draw actors with this shader
			for (const actor of shaderMap.get(shader)) {
				this.drawActorWithShader(shader, actor, viewProj);
			}
		}

		// Cleanup after drawing to texture
		if (texture) {
			target.unbind();
			// FIXME depth attachment check is so we don't resize the light (which is assigned to this.camera)
			if (texture.attachment != Attachment.DEPTH) {
				this.updateSize();
			}
		}
	}

	/**
	 * Update the framebuffer of the canvas to match its container's size
	 */
	updateSize(width?: number, height?: number) {
		if (!this.parentElement) {
			return;
		}
		const parentWidth = this.parentElement.clientWidth * this.scale | 0;
		const parentHeight = this.parentElement.clientHeight * this.scale | 0;
		width = width != null ? width : parentWidth;
		height = height != null ? height : parentHeight;
		this.camera.resize(width, height);

		this.canvas.style.imageRendering = 'crisp-edges'; // Firefox
		this.canvas.style.imageRendering = 'pixelated'; // Webkit
		this.canvas.style.width = this.parentElement.clientWidth + 'px';
		this.canvas.style.height = this.parentElement.clientHeight + 'px';
		this.canvas.setAttribute('width', parentWidth.toString());
		this.canvas.setAttribute('height', parentHeight.toString());
	}

	/**
	 * Insert the canvas into a HTMLElement
	 */
	attach(el: HTMLElement = null) {
		el?.appendChild(this.canvas);
		window.addEventListener('resize', this.updateSize.bind(this, null, null));
		this.updateSize();
		this.initWebGL();
		this.addEventListeners();

		if (DEBUG_ENABLED) {
			this.debugEl = document.createElement('div');
			this.canvas.parentElement?.appendChild(this.debugEl);
			Object.assign(this.debugEl.style, {
				position: 'fixed',
				borderRadius: '12px',
				zIndex: 10,
				right: '10px',
				top: '10px',
				color: 'red',
				fontSize: '32px',
				background: 'rgba(0, 0, 0, 0.5)',
				padding: '10px',
			});
		}
	}
}
