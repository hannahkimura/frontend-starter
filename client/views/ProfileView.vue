<!-- <script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());

const { updateSession, getuserProfile } = useUserStore();
let profile = ref<Array<Record<string, string>>>([]);
void updateSession();
let userProfile;
async function getProfile() {
  userProfile = await getuserProfile();
}

onBeforeMount(async () => {
  await getProfile();
  void updateSession();
});

onMounted(async () => {
  await getProfile();
  void updateSession();
});
</script>

<template>
  <main>
    <h1>Your Profile:</h1>
    <div class="backgroundInfo">
      <strong>Gender:</strong> {{ userProfile.gender }} <br /><strong> Sports:</strong>{{ userProfile.sports }} <br />
      <strong>Goal:</strong>{{ userProfile.goal }}
    </div>
    <PostListComponent :own="true" />
  </main>
</template>

<style scoped>
h1,
.backgroundInfo {
  text-align: center;
  font-family: "VTF Redzone Classic Oblique";
}
</style> -->
<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, reactive, ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());
const { updateSession, getuserProfile } = useUserStore();

let userProfile = reactive({
  gender: "",
  sports: "",
  goal: "",
});
const gender = ref("");

async function getProfile() {
  userProfile = await getuserProfile();
  gender.value = userProfile.gender;
  console.log("GOT HERE", userProfile.gender);
}

onBeforeMount(async () => {
  await getProfile();
  void updateSession();
});
</script>

<template>
  <main>
    <h1>Your Profile:</h1>
    <div class="backgroundInfo">
      <strong>Gender:</strong> {{ gender }} <br />
      <strong>Sports:</strong> {{ userProfile.sports }} <br />
      <strong>Goal:</strong> {{ userProfile.goal }}
    </div>
    <PostListComponent :own="true" />
  </main>
</template>

<style scoped>
h1,
.backgroundInfo {
  text-align: center;
  font-family: "VTF Redzone Classic Oblique";
}
</style>
