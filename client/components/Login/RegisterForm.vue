<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const genderPref = ref("");
const sportsPref = ref([]);
const sports = ref([]);
const gender = ref("");
const goal = ref("");
const minSkillPref = ref(0);
const maxSkillPref = ref(5);
const skill = ref(0); //skill score starts at 0
const location = ref("");
const phoneNum = ref("");
const maxLocationDistance = ref(1000); //max number of miles willing to meet another person
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  const skillPrefRange = [minSkillPref.value, maxSkillPref.value]; //store the range
  await createUser(
    username.value,
    password.value,
    genderPref.value,
    gender.value,
    sportsPref.value,
    sports.value,
    skill.value,
    skillPrefRange,
    location.value,
    maxLocationDistance.value,
    goal.value,
    phoneNum.value,
  );
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <div class="registration-container">
    <form @submit.prevent="register">
      <h3>Register User</h3>
      <fieldset>
        <div>
          <label for="aligned-name">Username</label>
          <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
        </div>

        <div>
          <label for="aligned-password">Password</label>
          <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
        </div>

        <div>
          <h3 for="genderPref">Gender Preference</h3>
          <div class="radio-container">
            <div>
              <input type="radio" value="male" v-model="genderPref" id="genderPrefMale" />
              <label for="genderPrefMale">Male</label>
            </div>
            <div>
              <input type="radio" value="female" v-model="genderPref" id="genderPrefFemale" />
              <label for="genderPrefFemale">Female</label>
            </div>
            <div>
              <input type="radio" value="both" v-model="genderPref" id="both" />
              <label for="both">both</label>
            </div>
          </div>
        </div>

        <div>
          <h3 for="gender">Gender</h3>
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
        <div>
          <h3 for="sports">Sports You Play</h3>
          <div class="checkbox-container">
            <div>
              <input type="checkbox" value="basketball" v-model="sports" id="sportsBasketball" />
              <label for="sportsBasketball">Basketball</label>
            </div>
            <div>
              <input type="checkbox" value="tennis" v-model="sports" id="sportsTennis" />
              <label for="sportsTennis">Tennis</label>
            </div>
            <div>
              <input type="checkbox" value="volleyball" v-model="sports" id="sportsVolleyball" />
              <label for="sportsVolleyball">Volleyball</label>
            </div>
            <div>
              <input type="checkbox" value="running" v-model="sports" id="sportsRunning" />
              <label for="sportsRunning">Running</label>
            </div>
          </div>
        </div>

        <div>
          <h3 for="goal">Goals</h3>
          <div class="radio-container">
            <div>
              <input type="radio" value="serious" v-model="goal" id="goalSerious" />
              <label for="goalSerious">Scrimmage (Serious)</label>
            </div>
            <div>
              <input type="radio" value="casual" v-model="goal" id="goalCasual" />
              <label for="goalCasual">Casual play</label>
            </div>
          </div>
        </div>

        <div>
          <h3 for="location">Current location</h3>
          <input type="text" id="location" v-model.trim="location" placeholder="Current Location" required />
        </div>

        <div>
          <h3 for="phoneNum">Phone Number</h3>
          <input type="text" id="phoneNum" v-model.trim="phoneNum" placeholder="Phone Number" required />
        </div>

        <div>
          <h3 for="skill">Skill Level (0 to 5)</h3>
          <input type="number" id="skill" v-model="skill" min="0" max="5" required />
        </div>

        <div>
          <h3 for="maxLocationDistance">Max Location Distance (in miles)</h3>
          <input type="number" id="maxLocationDistance" v-model="maxLocationDistance" min="0" required />
        </div>

        <div>
          <h3 for="sportsPref">Sports Preferences</h3>
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

        <div>
          <h3 for="skillPrefMin">Minimum Skill Level (0 to 5)</h3>
          <input type="number" id="skillPrefMin" v-model="minSkillPref" min="0" max="5" required />
        </div>

        <div>
          <h3 for="skillPrefMax">Maximum Skill Level (0 to 5)</h3>
          <input type="number" id="skillPrefMax" v-model="maxSkillPref" min="0" max="5" required />
        </div>
      </fieldset>
      <div>
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.registration-container {
  top: 100px; /* Adjust the top position as needed */
  display: flex;
  justify-content: center;
  align-items: center;
}

.registration-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center form content horizontally */
  margin: 0 auto; /* Center form horizontally */
  height: auto; /* Adjust height automatically based on content */
}

h3 {
  text-align: center;
}

.checkbox-container,
.radio-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
