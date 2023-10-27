<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="column">
    <h1>Login here!</h1>
    <LoginForm />
    <p>Still need to create an account? <RouterLink :to="{ name: 'Register' }">Register here</RouterLink></p>
  </main>
</template>

<style scoped>
@import "@/assets/font.css";

.column,
h1 {
  font-family: "VTF Redzone Classic Oblique";
}
</style>
