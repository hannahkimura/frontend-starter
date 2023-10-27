import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    const currGenderPref = ref([""]);
    const currSportsPref = ref([]);
    const currSkillPrefRange = ref([]);

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      currGenderPref.value = [];
      currSportsPref.value = [];
      currSkillPrefRange.value = [];
    };

    const createUser = async (
      username: string,
      password: string,
      genderPref: string,
      gender: string,
      sportsPref: Array<string>,
      sports: Array<string>,
      skill: number,
      skillPrefRange: Array<number>,
      location: string,
      maxLocationDistance: number,
      goal: string,
    ) => {
      await fetchy("/api/users", "POST", {
        body: { username, password, genderPref, gender, sportsPref, sports, skill, skillPrefRange, location, maxLocationDistance, goal },
      });
    };

    const getUserMatches = async (genderPref: string, sportsPref: Array<string>, skillPrefRange: Array<number>) => {
      return await fetchy("api/users/:_id", "POST", {
        body: { genderPref, sportsPref, skillPrefRange },
      });
    };

    const loginUser = async (username: string, password: string) => {
      console.log("HERE", username, password);
      await fetchy("/api/login", "POST", {
        body: { username, password },
      });
    };

    const updateSession = async () => {
      try {
        const { username, genderPref, sportsPref, skillPrefRange } = await fetchy("/api/session", "GET", { alert: false });
        currentUsername.value = username;
        currGenderPref.value = genderPref;
        currSportsPref.value = sportsPref;
        currSkillPrefRange.value = skillPrefRange;
      } catch {
        currentUsername.value = "";
        currGenderPref.value = [];
        currSportsPref.value = [];
        currSkillPrefRange.value = [];
      }
    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUser = async (patch: BodyT) => {
      await fetchy("/api/users", "PATCH", { body: { update: patch } });
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    return {
      currentUsername,
      isLoggedIn,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      updateUser,
      deleteUser,
      getUserMatches,
    };
  },
  { persist: true },
);

// new page
// similar to post list component
//write backend
