<script setup>
import { onMounted, ref } from "vue";
import { World } from "../world/world.js";

defineProps({
  msg: String,
});

const count = ref(0);
const globScene = ref(null);
const isShow = ref(false);
let container;

onMounted(() => {
  container = globScene.value;
  console.log(container);
});

const displayScene = () => {
  isShow.value = !isShow.value;
  const world = new World(container);
  world.render();
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="displayScene">Display scene</button>
  </div>
  <div>
    <div ref="globScene"></div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
