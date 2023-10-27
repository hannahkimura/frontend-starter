<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section class="custom-font">
      <h1 v-if="isLoggedIn">
        <div>
          <img src="@/assets/images/athletes.jpg" alt="My Image" />
        </div>
        Your Feed
      </h1>
      <h1 v-else>Please login!</h1>
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
@import "@/assets/font.css";
.custom-font {
  font-family: "VTF Redzone Classic Oblique";
}
h1 {
  text-align: center;
}
</style>
