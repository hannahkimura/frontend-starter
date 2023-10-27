<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

const currentRoute = useRoute();
const router = useRouter();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
    if (isLoggedIn.value) {
      await router.push("/profile");
    }
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="logo">
        <img src="@/assets/images/logo.svg" alt="Athlink Logo" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Athlink</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>

          <RouterLink :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }"> Profile </RouterLink>

          <RouterLink :to="{ name: 'Connect' }" :class="{ underline: currentRouteName == 'Connect' }"> Connect </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

header {
  background-color: #191d28; /* Dark background color */
  color: #ffffff; /* White text color */
  padding: 1em 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2em;
}

.logo {
  display: flex;
  align-items: center;
}

img {
  height: 2em;
  margin-right: 10px;
}

h1 {
  font-size: 1.5em;
  margin: 0;
  color: #ffffff;
}

ul {
  list-style-type: none;
  display: flex;
  gap: 1em;
}

a {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.1em;
}

.underline {
  text-decoration: underline;
}

.toast {
  background-color: #4caf50; /* Green background color */
  color: #ffffff; /* White text color */
  text-align: center;
  padding: 1em;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
}
</style>
