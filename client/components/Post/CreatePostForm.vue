<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const result = ref("");
const otherUser = ref("");
const image = ref(null); // For the image file
const visibility = ref("public");
const emit = defineEmits(["refreshPosts"]);
// Function to handle image input change

const createPost = async () => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { content: content.value, result: result.value, collaborator: otherUser.value, visibility: visibility.value },
    });
    emit("refreshPosts");
  } catch (_) {
    return;
  }

  emptyForm();
};

const emptyForm = () => {
  content.value = "";
  result.value = "";
  otherUser.value = "";
  visibility.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost()">
    <label for="result">Result:</label>
    <select id="result" v-model="result">
      <option value="win">Win</option>
      <option value="lose">Lose</option>
    </select>

    <label for="otherUser">Opponent/Workout Buddy Username:</label>
    <input type="text" id="anotherUser" v-model="otherUser" placeholder="Add your opponent" />

    <label for="visibility">Visibility:</label>
    <select id="visibility" v-model="visibility">
      <option value="private">Private (Only you can see this)</option>
      <option value="friends">Friends</option>
    </select>

    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
