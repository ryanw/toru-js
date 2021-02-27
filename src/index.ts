import { WebGLRenderer } from './renderer/webgl_renderer';

async function main() {
	const sceneModule = await import(`./scenes/${SCENE_NAME}`);
	const SceneClass = sceneModule[SCENE_CLASS];
	const renderer = new WebGLRenderer(document.body);
	const scene = new SceneClass(renderer);

	while (true) {
		await scene.draw();
	}
}

window.addEventListener('DOMContentLoaded', main);
