struct Material {
	bool castsShadows;
	bool receivesShadows;
	bool hasTexture;
	bool hasNormalMap;
	bool hasSpecularMap;
	bool emissive;
	vec4 color;
	sampler2D texture;
	sampler2D normalMap;
	sampler2D specularMap;
};

#pragma glslify: export(Material)
