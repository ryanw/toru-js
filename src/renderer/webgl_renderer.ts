import { Renderer } from './renderer';
import { Shader, ShaderOptions } from '../shader';
import { Vertex } from './vertex';
import { Pawn } from '../pawn';
import { Camera } from '../camera';
import { Color } from '../material';
import { Matrix4 } from '../geom';
import { Mesh } from '../mesh';
import { Scene } from '../scene';
import { Texture } from '../texture';
import { WebGLMesh } from './webgl_mesh';
import { WebGLTexture } from './webgl_texture';
import defaultVertSource from '../shaders/wireframe.vert.glsl';
import defaultFragSource from '../shaders/wireframe.frag.glsl';

export class WebGLRenderer extends Renderer {
	canvas = document.createElement('canvas');
	defaultShader: Shader;
	scale = 1.0 * window.devicePixelRatio;
	lineWidth = 2 * window.devicePixelRatio;
	antiAlias = true;
	camera: Camera = new Camera();
	maxFps = 200;
	lastFrameAt = 0;
	heldKeys = new Set();
	mousePosition = [0.0, 0.0];
	mouseMovement = [0.0, 0.0];
	mouseButtons = new Set();
	backgroundColor: Color = [0.2, 0.05, 0.4, 1.0];
	frame = 0;
	isGrabbed = false;
	seed = Math.random();
	private context: WebGLRenderingContext;
	private textures: Map<Texture, WebGLTexture> = new Map();
	private meshes: Map<Mesh<Vertex>, WebGLMesh<Vertex>> = new Map();

	constructor() {
		super();
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
			console.error('Failed to create WebGL context');
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
	}

	removeEventListeners() {
		this.heldKeys.clear();
		document.removeEventListener('pointerlockchange', this.onPointerLockChange);
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('mousedown', this.onMouseDown);
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

	resetMouseMovement() {
		this.mouseMovement[0] = 0;
		this.mouseMovement[1] = 0;
	}

	clear() {
		const gl = this.gl;
		gl.clearDepth(1.0);
		gl.clearColor(...this.backgroundColor);
		gl.colorMask(true, true, true, false);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	drawPawn(pawn: Pawn, projection?: Matrix4, parentModel?: Matrix4) {
		const { mesh, model, material, children } = pawn;
		const pawnModel = parentModel ? parentModel.multiply(model) : model;

		if (pawn.shader && !pawn.shader.compiled) {
			pawn.shader.make(this.gl);
		}

		if (mesh) {
			const gl = this.gl;
			const shader = pawn.shader || this.defaultShader;
			const uniforms = shader.uniforms;
			shader.use(gl);

			const glMesh = this.meshes.get(mesh);
			if (!glMesh) {
				throw 'Unable to find WebGLMesh';
			}
			shader.bind(gl, glMesh);

			gl.uniformMatrix4fv(uniforms.viewProj.location, false, projection.toArray());
			gl.uniform4fv(uniforms.fogColor.location, this.backgroundColor);
			gl.uniform1f(uniforms.lineWidth.location, this.lineWidth);
			gl.uniform1f(uniforms.time.location, performance.now());
			gl.uniform2fv(uniforms.resolution.location, [this.camera.width, this.camera.height]);
			gl.uniform1f(uniforms.seed.location, this.seed);
			gl.uniformMatrix4fv(uniforms.model.location, false, pawnModel.toArray());
			if (material?.color) {
				gl.uniform4fv(uniforms.fillColor.location, material.color);
			}

			for (const uniformName in pawn.uniforms) {
				const uniform = shader.uniforms[uniformName];
				if (!uniform) {
					throw `Unable to find '${uniformName}' uniform in shader`;
				}
				const value = pawn.uniforms[uniformName];
				switch (uniform.type) {
					case WebGLRenderingContext.FLOAT:
						if (typeof value !== 'number') {
							throw `Uniform '${uniformName}' expected number but got: ${typeof value}`;
						}
						gl.uniform1f(uniform.location, value);
						break;

					case WebGLRenderingContext.INT:
						if (typeof value !== 'number') {
							throw `Uniform '${uniformName}' expected number but got: ${typeof value}`;
						}
						gl.uniform1i(uniform.location, value);
						break;

					case WebGLRenderingContext.FLOAT_VEC2:
						if (
							!Array.isArray(value) ||
							value.length !== 2 ||
							typeof value[0] !== 'number' ||
							typeof value[1] !== 'number'
						) {
							throw `Uniform '${uniformName}' expected an array of 2 numbers but got something else`;
						}
						gl.uniform2fv(uniform.location, value);
						break;

					// TODO other uniform types
					default:
						throw `Unsupported uniform type: ${uniform.type}`;
				}
			}

			glMesh.draw();
		}

		for (const child of children) {
			this.drawPawn(child, projection, pawnModel);
		}
	}

	uploadMesh(mesh: Mesh<Vertex>) {
		const gl = this.gl;

		// Link a Mesh with its WebGLMesh
		let glMesh = this.meshes.get(mesh);
		if (!glMesh) {
			glMesh = new WebGLMesh(gl);
			this.meshes.set(mesh, glMesh);
		}
		glMesh.upload(mesh);
	}

	removeMesh(mesh: Mesh<Vertex>) {
		const glMesh = this.meshes.get(mesh);
		if (!glMesh) return;
		throw 'not yet implemented';
	}

	createShader(vertSource: string, fragSource: string, options?: ShaderOptions): Shader {
		return new Shader(this.gl, vertSource, fragSource, options);
	}

	/**
	 * Wait for next animation frame and redraw everything
	 */
	async drawScene(scene: Scene): Promise<number> {
		return new Promise((resolve) => {
			window.requestAnimationFrame(() => {
				const now = performance.now();
				const dt = (now - this.lastFrameAt) / 1000.0;
				this.lastFrameAt = now;

				this.gl.viewport(0, 0, this.camera.width, this.camera.height);
				this.clear();

				// Uniforms
				const proj = this.camera.projection.clone();
				const view = this.camera.view.inverse();
				const viewProj = proj.multiply(view);

				for (const pawn of scene.pawns) {
					this.drawPawn(pawn, viewProj);
				}

				this.frame++;
				const frametime = performance.now() - now;
				if (this.frame % 60 === 0) {
					//console.log('Draw time: %o ms', ((frametime * 100) | 0) / 100);
				}

				const delay = 1000 / this.maxFps - frametime;
				if (delay > 0.0) {
					setTimeout(() => resolve(dt), delay);
				} else {
					resolve(dt);
				}
			});
		});
	}

	/**
	 * Update the framebuffer of the canvas to match its container's size
	 */
	updateSize() {
		const width = (this.parentElement.clientWidth * this.scale) | 0;
		const height = (this.parentElement.clientHeight * this.scale) | 0;
		this.camera.resize(width, height);

		this.canvas.style.imageRendering = 'crisp-edges'; // Firefox
		this.canvas.style.imageRendering = 'pixelated'; // Webkit
		this.canvas.style.width = this.parentElement.clientWidth + 'px';
		this.canvas.style.height = this.parentElement.clientHeight + 'px';
		this.canvas.setAttribute('width', width.toString());
		this.canvas.setAttribute('height', height.toString());
	}

	/**
	 * Insert the canvas into a HTMLElement
	 */
	attach(el: HTMLElement) {
		el.appendChild(this.canvas);
		window.addEventListener('resize', this.updateSize.bind(this));
		this.updateSize();
		this.initWebGL();
	}
}