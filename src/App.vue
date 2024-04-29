<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import SimpleScene from "./components/SimpleScene.vue";
import EarthScene from "./components/EarthScene.vue";
import Satellite from "./components/Satellite.vue";
import socket from "./components/SimpleWebsocket.vue";
</script>

<template>
  <!-- <SimpleScene /> -->
  <!-- <EarthScene /> -->
  <Satellite />
  <!-- <socket /> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
