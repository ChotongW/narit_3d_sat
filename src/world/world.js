import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createEarth } from "./components/earth.js";
import { createLights } from "./components/light.js";

import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/resizer.js";
// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);

    const earth = createEarth();
    const light = createLights();
    // const myGlobe = new ThreeGlobeGeneric().globeImageUrl(
    //   "//unpkg.com/three-globe/example/img/earth-dark.jpg"
    // );

    scene.add(earth, light);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }
}

export { World };
