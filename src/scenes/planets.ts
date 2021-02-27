import { Scene } from '../scene';
import { Renderer } from '../renderer';
import { OrbitCamera } from '../camera';
import { Actor } from '../actor';
import { Quad } from '../meshes/quad';
import { Sphere } from '../meshes/sphere';
import { Cube } from '../meshes/cube';
import { Matrix4, normalize } from '../geom';
import { Texture } from '../texture';
import { Material, Color } from '../material';
import { MaterialShader } from '../shaders/material';
import { SkyShader } from '../shaders/sky';
import { Light } from '../components/light';
import { StaticMesh } from '../components/static_mesh';

const LIGHT_COUNT = 5;

export class Planets extends Scene {
	backgroundColor: [1.0, 0.0, 0.0, 1.0];
	earth: Actor;
	moon: Actor;
	bulbs: Actor[] = [];
	camera: OrbitCamera;
	zoom = 1.0;

	constructor(renderer: Renderer) {
		super(renderer);
		this.build();
	}

	draw() {
		this.update();
		return super.draw();
	}

	private build() {
		this.buildCamera();
		this.buildStars();
		this.buildLight();
		this.buildEarth();
		this.buildMoon();
		this.update();
	}

	private update() {
		this.updateCamera();
		this.updateLight();
		this.updateSun();
		this.updateEarth();
		this.updateMoon();
	}

	private buildCamera() {
		const camera = new OrbitCamera();
		camera.near = 1/1000;
		camera.far = 100;
		this.addActor(camera);
		this.renderer.camera = camera;
		this.renderer.updateSize();
		this.camera = camera;
	}

	private buildLight() {
		const lightMesh = new StaticMesh(new Cube());

		const shader = new MaterialShader();
		for (let i = 0; i < LIGHT_COUNT; i++) {
			const light = new Light({
				diffuse: [1.0, 1.0, 1.0],
				ambient: [0.01, 0.01, 0.01],
			});

			const bulb = new Actor({
				components: [
					lightMesh,
					light,
				],
				shader,
				material: new Material({
					emissive: true,
					color: light.diffuse,
				}),
			});
			this.bulbs.push(bulb);
			this.addActor(bulb);
		}
	}

	private buildStars() {
		const sky = new Actor(new Quad(), {
			shader: new SkyShader(),
		});
		//this.addActor(sky);
	}

	private async buildEarth() {
		const earth = new Actor(new Sphere(32, 32), {
			model: Matrix4.translation(0.0, 0.0, -5.0).multiply(Matrix4.scaling(2.0)),
			shader: new MaterialShader(),
			material: new Material({
				castsShadows: false,
				receivesShadows: false,
				color: [0.3, 0.4, 0.5, 1.0],
				texture: await Texture.fromUrl('/assets/earth.png'),
				normalMap: await Texture.fromUrl('/assets/earth-normal.png'),
				specularMap: await Texture.fromUrl('/assets/earth-specular.png'),
			}),
		});
		this.addActor(earth);
		this.earth = earth;
	}

	private async buildMoon() {
		const moon = new Actor(new Sphere(16, 16), {
			model: Matrix4.translation(3.5, 2.0, -5.0).multiply(Matrix4.scaling(0.5)),
			shader: new MaterialShader(),
			material: new Material({
				castsShadows: false,
				receivesShadows: false,
				color: [0.2, 0.2, 0.2, 1.0],
				texture: await Texture.fromUrl('/assets/moon.png'),
				normalMap: await Texture.fromUrl('/assets/moon-normal.png'),
			}),
		});
		this.addActor(moon);
		this.moon = moon;
	}

	private updateCamera() {
		const renderer = this.renderer;
		const camera = this.camera;
		// Centre of earth
		camera.target = [0.0, 0.0, -5.0];

		if (renderer.mouseButtons.has(0)) {
			const mouseSpeed = 0.005;
			const [mX, mY] = renderer.mouseMovement;

			const x = -mX * mouseSpeed;
			const y = -mY * mouseSpeed;

			camera.rotate(x, y);
			/*
			this.earth.model = this.earth.model
				.multiply(Matrix4.rotation(0.0, -x, 0.0))
				.multiply(Matrix4.rotation(-y, 0.0, 0.0));
			*/
		}


		const speed = 0.5;
		const rad = 2.1;
		if (renderer.wheelMovement[1] != 0) {
			const zoomSpeed = 0.25;
			this.zoom -= renderer.wheelMovement[1] * zoomSpeed;;
			if (this.zoom < 1) this.zoom = 1;
			if (this.zoom > 16) this.zoom = 16;
			let dist = this.zoom / 16;
			camera.distance = 8 - Math.log2(1 + dist) * 5.999;
			console.log(dist);
		}


		if (renderer.heldKeys.has('w')) {
			camera.distance = (camera.distance - rad) * 0.9 + rad;
		}

		if (renderer.heldKeys.has('s')) {
			camera.distance = (camera.distance - rad) * 1.1 + rad;
		}

		if (renderer.heldKeys.has('a')) {
			camera.rotate(-speed * 0.1, 0.0);
		}

		if (renderer.heldKeys.has('d')) {
			camera.rotate(speed * 0.1, 0.0);
		}

		if (renderer.heldKeys.has('q')) {
			camera.rotate(0.0, -speed * 0.1);
		}

		if (renderer.heldKeys.has('e')) {
			camera.rotate(0.0, speed * 0.1);
		}

		renderer.resetMouseMovement();
	}

	private updateLight() {
	}

	private updateSun() {
		for (let i = 0; i < this.bulbs.length; i++) {
			const bulb = this.bulbs[i];
			const t = performance.now() / 3000.0 + 4 + i;
			bulb.model = Matrix4.identity()
				.multiply(Matrix4.translation(0.0, 0.0, -5.5)) // Position of earth
				.multiply(Matrix4.translation(0.0, Math.cos(t * 4.0) * 2.0, -Math.sin(t * 1.0) * 0.5)) // Position of earth
				.multiply(Matrix4.rotation(0.0, -Math.PI * t * 0.4, 0.0))
				.multiply(Matrix4.translation(0.0, 0.0, 5.5)) // Distance from earth core
				.multiply(Matrix4.translation(Math.cos(t*2.0), Math.sin(t), -1.9 - Math.cos(t)))
				.multiply(Matrix4.scaling(0.05));

			const light = bulb.getComponentsOfType(Light)[0];
			light.diffuse[0] = Math.abs(Math.sin(t * (i + 1)));
			light.diffuse[1] = Math.abs(Math.sin(t * (i + 2)));
			light.diffuse[2] = Math.abs(Math.sin(t * (i + 3)));
		}
	}

	private updateEarth() {
		if (this.earth) {
			this.earth.model = this.earth.model
				.multiply(Matrix4.rotation(0.0, Math.PI * 0.001, 0.0));
		}
	}

	private updateMoon() {
		if (this.moon) {
			const t = performance.now() / 1000.0;
			const o = t * 0.5;
			this.moon.model = Matrix4.identity()
				.multiply(Matrix4.translation(0.0, 0.0, -5.0)) // Earth center
				.multiply(Matrix4.rotation(0.0, Math.PI * o, 0.0)) // Orbit
				.multiply(Matrix4.translation(2.0, 1.0, -5.0)) // Position in space
				.multiply(Matrix4.scaling(0.5)) // Size
			;
		}
	}
}
