<!-- //STEPS:
CONNECT STEPS: 
1. Need to find users that match ur preference 
2. Need to access that user’s preferences 
3. Need to make sure your qualifications match that user’s preference 
4. Then can add them to a list of valid users that gets shown to you-->
<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const emit = defineEmits(["refreshMatchingUsers"]);

const genderPref = ref("");
const skillPref = ref([]);
const sportsPref = ref([""]);
const matchingUsers = ref<Array<Record<string, string>>>([]);
const friendRequests = ref<Array<Record<string, string>>>([]);
const { updateSession, getUserMatches } = useUserStore();
//const { genderPref, sportsPref, skillPref, isLoggedIn } = storeToRefs(useUserStore()); //does this work
const props = defineProps(["user"]);
const { currentUsername } = storeToRefs(useUserStore());

async function connect() {
  matchingUsers.value = (await getUserMatches(genderPref.value, sportsPref.value, skillPref.value)).users;
  void updateSession();
  await router.push({ name: "Connect" });
}

const sendRequest = async () => {
  try {
    await fetchy(`/api/friend/requests/${matchingUsers.value[0].username}`, "POST");
    await nextUser();
  } catch {
    return;
  }
  // emit("refreshMatchingUsers");
};

const acceptRequest = async () => {
  try {
    await fetchy(`/api/friend/accept/${friendRequests.value[0].from}`, "PUT");
    friendRequests.value = friendRequests.value.slice(1);
  } catch {
    return;
  }
};

const rejectRequest = async () => {
  try {
    await fetchy(`/api/friend/reject/${friendRequests.value[0].from}`, "PUT");
    friendRequests.value = friendRequests.value.slice(1);
  } catch {
    return;
  }
};

const getRequests = async () => {
  try {
    friendRequests.value = await fetchy("/api/friend/requests", "GET");
    console.log("FRIENDS", friendRequests.value);
  } catch {
    return;
  }
};
const nextUser = async () => {
  matchingUsers.value = matchingUsers.value.slice(1);
};

onBeforeMount(async () => {
  try {
    await getRequests();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div>
    <!-- Display the list of matching users here -->
    <div v-if="matchingUsers.length > 0">
      This user matches all of your preferences!<br />User: {{ matchingUsers[0].username }} <br />
      <!-- Can  I link this to that user's profile?-->

      Gender: {{ matchingUsers[0].gender }} <br />Sports: {{ matchingUsers[0].sports }} <br />

      Would you like to connect? <br />

      <button @click="sendRequest()">Yes</button>
      <button @click="nextUser">No</button>
    </div>

    <button v-else @click="connect">Connect</button>
  </div>

  <div class="friend-requests">
    <h3>Friend Requests</h3>
    <!-- <button @click="getRequests">Incoming Friend Requests</button> -->

    <div v-if="friendRequests.length > 0">
      <!-- {{ friendRequests }} -->
      <div>
        <strong>Username: {{ friendRequests[0].from }}</strong>
        <p>Gender: {{ friendRequests[0].gender }}</p>
        <p>Sports: {{ friendRequests[0].sports }}</p>
        <p>Skill: {{ friendRequests[0].skill }}</p>
        <p>Goals: {{ friendRequests[0].goal }}</p>
        <button @click="acceptRequest">Accept</button>
        <button @click="rejectRequest">Reject</button>
      </div>
    </div>
  </div>
</template>

<style>
.friend-requests {
  position: fixed; /* Position the friend requests container */
  top: 100px; /* Adjust the top position as needed */
  right: 10px; /* Adjust the right position as needed */
  background-color: #fff; /* Background color for the container */
  border: 1px solid #ccc;
  padding: 10px;
  max-width: 300px; /* Set a maximum width for the container */
  z-index: 1; /* Ensure it's on top of other content */
}
</style>
