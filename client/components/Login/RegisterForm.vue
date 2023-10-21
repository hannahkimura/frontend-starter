<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const genderPref = ref([]);
const sportsPref = ref([]);
const sports = ref([]);
const gender = ref("");
const minSkillPref = ref(0);
const maxSkillPref = ref(5);
const skill = ref(0); //skill score starts at 0
const location = ref("");
const maxLocationDistance = ref(1000); //max number of miles willing to travel
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  const skillPrefRange = [minSkillPref.value, maxSkillPref.value]; //store the range
  await createUser(username.value, password.value, genderPref.value, gender.value, sportsPref.value, sports.value, skill.value, skillPrefRange, location.value, maxLocationDistance.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>

      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>

      <div class="pure-control-group" id="GenderPref">
        <label for="genderPref">Gender Preference</label>
        <div class="checkbox-container">
          <div>
            <input type="checkbox" value="male" v-model="genderPref" id="genderPrefMale" />
            <label for="genderPrefMale">Male</label>
          </div>

          <div>
            <input type="checkbox" value="female" v-model="genderPref" id="genderPrefFemale" />
            <label for="genderPrefFemale">Female</label>
          </div>

          <div>
            <input type="checkbox" value="other" v-model="genderPref" id="genderPrefOther" />
            <label for="genderPrefOther">Other</label>
          </div>
        </div>
      </div>

      <div class="pure-control-group">
        <label for="gender">Gender</label>
        <div class="radio-container">
          <div>
            <input type="radio" value="male" v-model="gender" id="genderPrefMale" />
            <label for="genderPrefMale">Male</label>
          </div>
          <div>
            <input type="radio" value="female" v-model="gender" id="genderPrefFemale" />
            <label for="genderPrefFemale">Female</label>
          </div>
        </div>
      </div>

      <div class="pure-control-group">
        <label for="location">Current location</label>
        <input type="text" id="location" v-model.trim="location" placeholder="Current Location" required />
      </div>

      <div class="pure-control-group">
        <label for="skill">Skill Level (0 to 5)</label>
        <input type="number" id="skill" v-model="skill" min="0" max="5" required />
      </div>

      <div class="pure-control-group">
        <label for="maxLocationDistance">Max Location Distance (in miles)</label>
        <input type="number" id="maxLocationDistance" v-model="maxLocationDistance" min="0" required />
      </div>

      <div class="pure-control-group">
        <label for="sportsPref">Sports Preferences</label>
        <div class="checkbox-container">
          <div>
            <input type="checkbox" value="basketball" v-model="sportsPref" id="sportsPrefBasketball" />
            <label for="sportsPrefBasketball">Basketball</label>
          </div>
          <div>
            <input type="checkbox" value="tennis" v-model="sportsPref" id="sportsPrefTennis" />
            <label for="sportsPrefTennis">Tennis</label>
          </div>
          <div>
            <input type="checkbox" value="volleyball" v-model="sportsPref" id="sportsPrefVolleyball" />
            <label for="sportsPrefVolleyball">Volleyball</label>
          </div>
          <div>
            <input type="checkbox" value="running" v-model="sportsPref" id="sportsPrefRunning" />
            <label for="sportsPrefRunning">Running</label>
          </div>
        </div>
      </div>

      <div class="pure-control-group">
        <label for="skillPrefMin">Minimum Skill Level (0 to 5)</label>
        <input type="number" id="skillPrefMin" v-model="minSkillPref" min="0" max="5" required />
      </div>

      <div class="pure-control-group">
        <label for="skillPrefMax">Maximum Skill Level (0 to 5)</label>
        <input type="number" id="skillPrefMax" v-model="maxSkillPref" min="0" max="5" required />
      </div>

      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}

.checkbox-container,
.radio-container {
  display: flex;
  justify-content: center;
}
</style>
