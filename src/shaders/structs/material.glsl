struct Material {
	bool castsShadows;
	bool receivesShadows;
	bool hasTexture;
	bool hasNormalMap;
	bool hasSpecularMap;
	bool hasDisplacementMap;
	bool emissive;
	vec4 color;
	float displacementMultiplier;
	sampler2D texture;
	sampler2D normalMap;
	sampler2D specularMap;
	sampler2D displacementMap;
};

#pragma glslify: export(Material)
