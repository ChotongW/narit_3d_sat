<template>
  <div>
    <p>web socket test</p>
  </div>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import io from "socket.io-client";

export default {
  setup() {
    const message = ref("");

    onMounted(() => {
      const socket = io("ws://localhost:5000/sat_pos"); // Update with your backend WebSocket URL
      socket.on("message", (data) => {
        message.value = data;
      });
    });

    return { message };
  },
};
</script>
