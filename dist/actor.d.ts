import { Matrix4, Point3, Vector3 } from './geom';
import { Mesh, Vertex } from './mesh';
import { Material, Color } from './material';
import { Shader, UniformValues } from './shader';
import { Component } from './component';
export interface Instance {
    [key: string]: number | number[] | Matrix4;
}
export declare type ActorInstance<I extends Instance = Instance> = {
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
export declare class Actor<I extends Instance = Instance> {
    visible: boolean;
    components: Component[];
    model: Matrix4;
    material: Material;
    shader?: Shader;
    uniforms: UniformValues;
    children: Actor[];
    instances: Map<number, ActorInstance>;
    private nextInstanceId;
    constructor(meshOrOptions?: Mesh<Vertex> | Actor[] | ActorOptions, options?: ActorOptions);
    instance(data: I): number;
    get hasInstances(): boolean;
    get translationMatrix(): Matrix4;
    get rotationMatrix(): Matrix4;
    get position(): Point3;
    set position(pos: Point3);
    get rotationVector(): Vector3;
    getComponentsOfType<C extends Component>(klass: Constructable<C>): C[];
    hasComponentOfType<C extends Component>(klass: Constructable<C>): boolean;
}
