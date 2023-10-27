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
    const currGender = ref("");
    const currSports = ref([""]);
    const currSkill = ref("");
    const currPhone = ref("");

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      currGenderPref.value = [];
      currSportsPref.value = [];
      currSkillPrefRange.value = [];
      currGender.value = "";
      currSports.value = [];
      currSkill.value = "";
      currPhone.value = "";
    };

    const createUser = async (
      username: string,
      password: string,
      genderPref: string,
      gender: string,
      sportsPref: Array<string>,
      sports: Array<string>,
      skill: number,
      skillPref: Array<number>,
      location: string,
      locationRange: number,
      goal: string,
      phoneNum: string,
    ) => {
      await fetchy("/api/users", "POST", {
        body: { username, password, genderPref, gender, sportsPref, sports, skill, skillPref, location, locationRange, goal, phoneNum },
      });
    };

    const getuserProfile = async () => {
      return await fetchy(`/api/users/profile/${currentUsername.value}`, "GET");
      // currGender.value = "";
      // currSports.value = [];
      // currSkill.value = "";
      // currPhone.value = "";
      // currGender.value = profile.gender;
      // currSports.value = profile.sports;
      // currSkill.value= profile.skill;
      // currPhone.value=
    };

    const getUserMatches = async (genderPref: string, sportsPref: Array<string>, skillPref: Array<number>, goal: string) => {
      return await fetchy("api/users/:_id", "POST", {
        body: { genderPref, sportsPref, skillPref, goal },
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
      getuserProfile,
    };
  },
  { persist: true },
);
