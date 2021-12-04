import { Mesh, Geometry } from '../mesh';
import { Point3, Point2, Vector3, normalize, cross, addVector3, multiplyVector3 } from '../geom';
import { Color } from '../material';

export type SphereVertex = {
	position: Point3;
	uv: Point2;
	normal: Vector3;
	color: Color;
};

export class Sphere extends Mesh<SphereVertex> {
	constructor(lonSegments: number, latSegments: number) {
		const data: SphereVertex[] = new Array(lonSegments * latSegments * 6);

		let i = 0;
		for (let y = latSegments * -0.5; y < latSegments * 0.5; y++) {
			const lat0 = Math.PI * (y / latSegments);
			const lat1 = Math.PI * ((y + 1) / latSegments);

			for (let x = lonSegments * -0.5; x < lonSegments * 0.5; x++) {
				const lon0 = 2 * Math.PI * (x / lonSegments);
				const lon1 = 2 * Math.PI * ((x + 1) / lonSegments);

				const quad: [number, number][] = [
					[lon1, lat1],
					[lon0, lat1],
					[lon0, lat0],
					[lon1, lat0],
					[lon1, lat1],
					[lon0, lat0],
				];

				for (const p of quad) {
					const position = sphericalToCartesian(p[0], p[1]);
					const normal = normalize(position);
					const vertex: SphereVertex = {
						position,
						normal,
						uv: sphericalToUV(p[0], p[1]),
						color: [1.0, 0.0, 0.0, 1.0],
					};

					data[i++] = vertex;
				}
			}
		}
		super(data);
	}
}

export class CubeSphere extends Mesh<SphereVertex> {
	constructor(res: number) {
		super([
			new CubeSphereFace(res, [0, 1, 0]),
			new CubeSphereFace(res, [0, -1, 0]),

			new CubeSphereFace(res, [1, 0, 0]),
			new CubeSphereFace(res, [-1, 0, 0]),

			new CubeSphereFace(res, [0, 0, 1]),
			new CubeSphereFace(res, [0, 0, -1]),
		]);
	}
}

export class CubeSphereFace extends Geometry<SphereVertex> {
	constructor(res: number, up: Point3) {
		const data: SphereVertex[] = new Array(res * res);
		const axisA: Point3 = [up[1], up[2], up[0]];
		const axisB = cross(up, axisA);

		const vertices = new Array(res * res);
		const triangles = new Array((res - 1) * (res - 1));

		let tri = 0;
		const sub = 1 / (res - 1);
		for (let y = 0; y < res; y++) {
			for (let x = 0; x < res; x++) {
				const p: Point2 = [x * sub, y * sub];
				const hp = [(p[0] - 0.5) * 2.0, (p[1] - 0.5) * 2.0];
				let position = up;
				position = addVector3(position, multiplyVector3([hp[0], hp[0], hp[0]], axisA));
				position = addVector3(position, multiplyVector3([hp[1], hp[1], hp[1]], axisB));
				position = normalize(position);
				const vertex: SphereVertex = {
					position,
					normal: position,
					uv: [0, 0],
					color: [1.0, 0.0, 0.0, 1.0],
				};
				const i = x + y * res;
				vertices[i] = vertex;

				if (x < res - 1 && y < res - 1) {
					triangles[tri++] = i;
					triangles[tri++] = i + res + 1;
					triangles[tri++] = i + res;
					triangles[tri++] = i;
					triangles[tri++] = i + 1;
					triangles[tri++] = i + res + 1;
				}
			}
		}

		for (let i = 0; i < triangles.length; i++) {
			data[i] = vertices[triangles[i]];
		}
		super(data);
	}
}

function sphericalToCartesian(lon: number, lat: number): Point3 {
	return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
}

function sphericalToUV(lon: number, lat: number): Point2 {
	const x = lon / Math.PI / 2 + 0.5;
	const y = -lat / Math.PI + 0.5;
	return [x, y];
}
