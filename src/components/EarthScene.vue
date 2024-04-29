<template>
  <div ref="globContainer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Color,
} from "three";

const globContainer = ref();
const scene = new Scene();
scene.background = new Color("skyblue");
const renderer = new WebGLRenderer();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const camera = new OrthographicCamera(
//   window.innerWidth / -2,
//   window.innerWidth / 2,
//   window.innerHeight / 2,
//   window.innerHeight / -2,
//   1,
//   1000
// );

const globe = new Mesh(
  new SphereGeometry(2, 32, 32),
  new MeshBasicMaterial({
    map: new TextureLoader().load("globe_west_2048.png"), // Update with the correct file path
  })
);

onMounted(() => {
  initScene();
  animate();
});

function initScene() {
  globContainer.value.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.position.z = 5;
  scene.add(camera);

  scene.add(globe);
}

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.x += 0.01;
  globe.rotation.y += 0.01;
  renderer.render(scene, camera);
}
</script>

<style scoped>
#globContainer {
  width: 100%;
  height: 100vh;
}
</style>
