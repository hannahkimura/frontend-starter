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
const goal = ref("");
const matchingUsers = ref<Array<Record<string, string>>>([]);
const friendRequests = ref<Array<Record<string, string>>>([]);
const { updateSession, getUserMatches, getuserProfile } = useUserStore();
//const { genderPref, sportsPref, skillPref, isLoggedIn } = storeToRefs(useUserStore()); //does this work
const props = defineProps(["user"]);
const { currentUsername } = storeToRefs(useUserStore());
const fromGender = ref("");
const fromSports = ref([""]);
const fromSkill = ref("");
const fromGoal = ref("");
const fromNum = ref("");

async function connect() {
  matchingUsers.value = (await getUserMatches(genderPref.value, sportsPref.value, skillPref.value, goal.value)).users;
  void updateSession();
  await router.push({ name: "Connect" });
}
onBeforeMount(async () => {
  await connect();
});

const sendRequest = async () => {
  try {
    await fetchy(`/api/friend/requests/${matchingUsers.value[0].username}`, "POST");
    await nextUser();
  } catch {
    return;
  }
  // emit("refreshMatchingUsers");
};

const getUniqueProfile = async (from: string) => {
  console.log("USERFROM", from);
  const results = await fetchy(`/api/users/profileUnique/${from}`, "GET");
  console.log("RESULTS", results);
  fromGender.value = results.gender;
  fromSports.value = results.sports;
  fromSkill.value = results.skill;
  fromGoal.value = results.goal;
  fromNum.value = results.phoneNum;
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
    <div v-if="matchingUsers.length > 0" class="connect-card">
      <div class="connect-header">
        This user matches all of your preferences!<br />User: {{ matchingUsers[0].username }} <br />
        <!-- Can  I link this to that user's profile?-->

        Gender: {{ matchingUsers[0].gender }} <br />Sports: {{ matchingUsers[0].sports }} <br />
      </div>
      <div class="connect-buttons">
        Would you like to connect? <br />

        <button class="connect-yes" @click="sendRequest()">Yes</button>
        <button class="connect-no" @click="nextUser">No</button>
      </div>
    </div>

    <h3 v-else>No users on our platform match all of your preferences..</h3>
  </div>

  <div class="friend-requests">
    <h3>Friend Requests</h3>
    <!-- <button @click="getRequests">Incoming Friend Requests</button> -->

    <div v-if="friendRequests.length > 0" class="request-card">
      <!-- {{ friendRequests }} -->

      <strong>Username: {{ friendRequests[0].from }}</strong> <br />
      Click the button to fill in the info below about this user!
      <button @click="getUniqueProfile(friendRequests[0].from)">Info about {{ friendRequests[0].from }}</button>
      <p>Gender: {{ fromGender }}</p>
      <p>Sports: {{ fromSports }}</p>
      <p>Skill: {{ fromSkill }}</p>
      <p>Goals: {{ fromGoal }}</p>
      <p>Phone Number: {{ fromNum }}</p>
      <div class="request-buttons">
        <button class="accept-button" @click="acceptRequest">Accept</button>
        <button class="reject-button" @click="rejectRequest">Reject</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.connect-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.connect-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.connect-buttons p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

.connect-yes,
.connect-no {
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.connect-yes:hover,
.connect-no:hover {
  background-color: #45a049;
}

.h3 {
  font-size: 1.2rem;
  color: #333;
  margin-top: 20px;
}

.request-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.request-buttons button {
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
}

.accept-button {
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.accept-button:hover {
  background-color: #45a049;
}

.reject-button {
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.reject-button:hover {
  background-color: #e53935;
}
</style>
<!-- <style>
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
</style> -->
