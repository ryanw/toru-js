import { Scene } from '../scene';
import { Renderer } from '../renderer';
import { OrbitCamera } from '../camera';
import { Actor } from '../actor';
import { Quad } from '../meshes/quad';
import { CubeSphere, Sphere } from '../meshes/sphere';
import { Cube } from '../meshes/cube';
import { Matrix4, LonLat, Point2, Point3, normalize, raySphereIntersection, pointToLonLat } from '../geom';
import { Texture } from '../texture';
import { Material } from '../material';
import { MaterialShader, SphereMaterialShader } from '../shaders/material';
import { SkyShader } from '../shaders/sky';
import { Light } from '../components/light';
import { StaticMesh } from '../components/static_mesh';

const LIGHT_COUNT = 4;
const MAX_ZOOM = 16;

export class Planets extends Scene {
	backgroundColor: [1.0, 0.0, 0.0, 1.0];
	earth: Actor;
	moon: Actor;
	bulbs: Actor[] = [];
	camera: OrbitCamera;
	zoom = 0.0;

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

		const el = document.createElement('div');
		document.body.appendChild(el);
		Object.assign(el.style, {
			position: 'fixed',
			borderRadius: '12px',
			zIndex: 10,
			left: '10px',
			bottom: '10px',
			color: 'white',
			fontSize: '16px',
			background: 'rgba(0, 0, 0, 0.5)',
			padding: '10px',
			textAlign: 'left',
		});
		this.renderer.addEventListener('click', (e: MouseEvent) => {
			// Viewport -> Camera; relative to center of screen (-1.0..1.0)
			const x = e.clientX / (e.currentTarget as HTMLElement).clientWidth * 2.0 - 1.0;
			const y = e.clientY / (e.currentTarget as HTMLElement).clientHeight * 2.0 - 1.0;
			const ll = this.pixelToLonLat([x, y]);
			if (ll) {
				const lon = (ll[0] * (180/Math.PI)).toFixed(2);
				const lat = (ll[1] * (180/Math.PI)).toFixed(2);
				el.innerHTML = `<a href="https://maps.google.com/?q=${lat},${lon}" target="_blank">Lon: ${lon}<br>Lat: ${lat}</a>`;
			} else {
				el.innerHTML = '';
			}
		});
	}

	pixelToLonLat(point: Point2): LonLat {
		const [x, y] = point;

		// Camera -> World
		const { view, projection } = this.camera;
		const vp = projection.multiply(view.inverse()).inverse();

		const origin = vp.transformPoint3([x, -y, 0.0]);
		const dest = vp.transformPoint3([x, -y, 1.0]);
		const dir = normalize([
			dest[0] - origin[0],
			dest[1] - origin[1],
			dest[2] - origin[2],
		]);


		const planetCenter: Point3 = [0.0, 0.0, -5.0];
		const hit = raySphereIntersection(planetCenter, 1.0, origin, dir);
		if (hit) {
			const surface: Point3 = [
				hit[0] - planetCenter[0],
				hit[1] - planetCenter[1],
				hit[2] - planetCenter[2],
			];

			// DEBUG
			const marker = new Actor(new Sphere(8, 8), {
				model: Matrix4.translation(hit[0], hit[1], hit[2]).multiply(Matrix4.scaling(0.03)),
				shader: new MaterialShader(),
				material: new Material({
					emissive: true,
					color: [Math.random() + 0.1, Math.random() + 0.1, Math.random() + 0.1, 1.0],
				}),
			});
			this.addActor(marker);

			// Cartesian surface coord to lonlat
			return pointToLonLat(surface);
		}
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
				ambient: [0.03, 0.03, 0.03],
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
		const earth = new Actor(new CubeSphere(5), {
			model: Matrix4.translation(0.0, 0.0, -5.0),
			shader: new SphereMaterialShader(),
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
		const moon = new Actor(new CubeSphere(3), {
			model: Matrix4.translation(3.5, 2.0, -5.0).multiply(Matrix4.scaling(0.5)),
			shader: new SphereMaterialShader(),
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
			const dist = this.zoom / MAX_ZOOM;
			const maxSpeed = 0.01;
			const minSpeed = 0.001;
			const mouseSpeed = maxSpeed - Math.log2(1 + dist) * (maxSpeed - minSpeed);
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
		if (renderer.wheelMovement[1] != 0 || this.zoom === 0) {
			if (this.zoom === 0) this.zoom = 1;
			const zoomSpeed = 0.5;
			this.zoom -= renderer.wheelMovement[1] * zoomSpeed;;
			if (this.zoom < 1) this.zoom = 1;
			if (this.zoom > MAX_ZOOM) this.zoom = MAX_ZOOM;
			const dist = this.zoom / MAX_ZOOM;

			const maxDist = 8;
			const minDist = 1.001;
			camera.distance = maxDist - Math.log2(1 + dist) * (maxDist - minDist);
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

			if (i > 0) {
				const light = bulb.getComponentsOfType(Light)[0];
				light.diffuse[0] = Math.abs(Math.sin(t * (i + 1)));
				light.diffuse[1] = Math.abs(Math.sin(t * (i + 2)));
				light.diffuse[2] = Math.abs(Math.sin(t * (i + 3)));
			}
		}
	}

	private updateEarth() {
		if (this.earth) {
			//this.earth.model = this.earth.model.multiply(Matrix4.rotation(0.0, Math.PI * 0.001, 0.0));
		}
	}

	private updateMoon() {
		if (this.moon) {
			const t = performance.now() / 1000.0;
			const o = t * 0.2;
			this.moon.model = Matrix4.identity()
				.multiply(Matrix4.translation(0.0, 0.0, -5.0)) // Earth center
				.multiply(Matrix4.rotation(0.0, Math.PI * o, 0.0)) // Orbit
				.multiply(Matrix4.translation(2.0, 1.0, -2.0)) // Position in space
				.multiply(Matrix4.scaling(0.5)) // Size
			;
		}
	}
}
