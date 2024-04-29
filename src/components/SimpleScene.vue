<template>
  <div ref="container"></div>
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
} from "three";

const container = ref();
const scene = new Scene();
const renderer = new WebGLRenderer();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const sphere = new Mesh(
  new SphereGeometry(1, 32, 32),
  new MeshBasicMaterial({ color: 0x00ff00 })
);

onMounted(() => {
  initScene();
  animate();
});

function initScene() {
  container.value.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.z = 5;
  scene.add(camera);

  scene.add(sphere);
}

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100vh;
}
</style>
