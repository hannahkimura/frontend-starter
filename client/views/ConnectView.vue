<script setup lang="ts">
import ConnectForm from "@/components/Connect/ConnectForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { updateSession } = useUserStore();
const { isLoggedIn } = storeToRefs(useUserStore());

void updateSession();
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Connect With Other Athletes! <ConnectForm /></h1>
      <h1 v-else>Please login!</h1>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
