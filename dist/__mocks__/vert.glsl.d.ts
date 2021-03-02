declare const glsl = "\n// Mock Vertex Shader\nuniform mat4 uViewProj;\nuniform mat4 uModel;\n\nattribute vec3 position;\nattribute vec4 color;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n\tmat4 mvp = uModel * uViewProj;\n\tgl_Position = vec4(position, 1.0) * mvp;\n\tvColor = color;\n}\n\n";
export default glsl;
