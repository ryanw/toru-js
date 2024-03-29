import { Matrix4, Point3, Vector3 } from './geom';
import { Mesh, Vertex } from './mesh';
import { Material, Color } from './material';
import { Shader, UniformValues } from './shader';
import { Component } from './component';
import { StaticMesh } from './components/static_mesh';

export interface Instance {
	[key: string]: number | number[] | Matrix4;
}

export type ActorInstance<I extends Instance = Instance> = {
	pawn: Actor;
	data: I;
};

export interface ActorOptions {
	color?: Color;
	material?: Material;
	model?: Matrix4;
	shader?: Shader;
	uniforms?: UniformValues;
	components?: Component[];
}

export class Actor<I extends Instance = Instance> {
	visible: boolean = true;
	components: Component[] = [];
	model: Matrix4 = Matrix4.identity();
	material: Material;
	shader?: Shader;
	uniforms: UniformValues = {};
	children: Actor[] = [];
	instances: Map<number, ActorInstance> = new Map();
	private nextInstanceId = 1;

	constructor(meshOrOptions?: Mesh<Vertex> | Actor[] | ActorOptions, options: ActorOptions = {}) {
		if (meshOrOptions instanceof Array) {
			this.children = meshOrOptions;
		} else if (meshOrOptions instanceof Mesh) {
			this.components.push(new StaticMesh(meshOrOptions));
		} else if (typeof meshOrOptions === 'object') {
			options = meshOrOptions;
		}

		const material = options.material || new Material();
		material.color = options.color || material.color;

		this.material = material;

		if (options.model) {
			this.model = options.model;
		}

		if (options.shader) {
			this.shader = options.shader;
		}

		if (options.uniforms) {
			this.uniforms = {
				...this.uniforms,
				...options.uniforms,
			};
		}

		if (options.components) {
			this.components = [...this.components, ...options.components];
		}
	}

	instance(data: I): number {
		const id = this.nextInstanceId++;

		const instance = {
			id,
			pawn: this,
			data: { ...data },
		};
		this.instances.set(id, instance);

		return id;
	}

	get hasInstances(): boolean {
		return this.instances.size !== 0;
	}

	get translationMatrix(): Matrix4 {
		return this.model.extractTranslation();
	}

	get rotationMatrix(): Matrix4 {
		return this.model.extractRotation();
	}

	get position(): Point3 {
		return this.model.transformPoint3([0.0, 0.0, 0.0]);
	}

	set position(pos: Point3) {
		const mat = this.model.toArray();
		mat[3] = pos[0];
		mat[7] = pos[1];
		mat[11] = pos[2];
		this.model = new Matrix4(mat);
	}

	get rotationVector(): Vector3 {
		const vec = this.model.multiplyVector4([0.0, 0.0, 1.0, 0.0]);
		return [vec[0], vec[1], vec[2]];
	}

	getComponentsOfType<C extends Component>(klass: Constructable<C>): C[] {
		return this.components.filter(c => c instanceof klass) as C[];
	}

	hasComponentOfType<C extends Component>(klass: Constructable<C>): boolean {
		return Boolean(this.components.find(c => c instanceof klass));
	}
}
