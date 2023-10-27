<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let hidePostsFromSuppressedUsers = ref(true);

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
const props = defineProps(["own"]);

function userIsSuppressed(author: string): boolean {
  return hidePostsFromSuppressedUsers.value && currentUsername.value !== author;
}

function toggleSuppressionStatus() {
  hidePostsFromSuppressedUsers.value = !hidePostsFromSuppressedUsers.value;
}

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
  console.log("POSTRESULTS", posts.value);
}

async function updateEditing(id: string) {
  editing.value = id;
  if (props.own) {
    await getPosts(currentUsername.value);
  } else {
    await getPosts();
  }
  loaded.value = true;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div>
  <div v-if="isLoggedIn && !props.own" class="row">
    <button v-if="hidePostsFromSuppressedUsers" class="btn-small pure-button" @click="toggleSuppressionStatus">Show posts from suppressed users</button>
    <button v-else class="btn-small pure-button" @click="toggleSuppressionStatus">Hide posts from suppressed users</button>
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <p v-if="hidePostsFromSuppressedUsers && suppressedUsers.includes(post.author)">Thus is a post from a user you've suppressed</p>
      <PostComponent v-else-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else-if="editing" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
<!-- 
<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useSettingsStore } from "../../stores/settings";
import SearchPostForm from "./SearchPostForm.vue";

const { suppressedUsers } = storeToRefs(useSettingsStore());

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

// TODO: When hidePostsFromSuppressedUsers is true, display text saying "This is a post from a user you've suppressed" in
// place of the post information for every post by a suppressed user.

const loaded = ref(false);
let hidePostsFromSuppressedUsers = ref(true);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
const props = defineProps(["own"]);

function userIsSuppressed(author: string): boolean {
  return hidePostsFromSuppressedUsers.value && currentUsername.value !== author;
}

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

function toggleSuppressionStatus() {
  hidePostsFromSuppressedUsers.value = !hidePostsFromSuppressedUsers.value;
}

onBeforeMount(async () => {
  if (props.own) {
    await getPosts(currentUsername.value);
  } else {
    await getPosts();
  }
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm v-if="!props.own" @getPostsByAuthor="getPosts" />
  </div>
  <div v-if="isLoggedIn && !props.own" class="row">
    <button v-if="hidePostsFromSuppressedUsers" class="btn-small pure-button" @click="toggleSuppressionStatus">Show posts from suppressed users</button>
    <button v-else class="btn-small pure-button" @click="toggleSuppressionStatus">Hide posts from suppressed users</button>
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <p v-if="hidePostsFromSuppressedUsers && suppressedUsers.includes(post.author)">Thus is a post from a user you've suppressed</p>
      <PostComponent v-else-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else-if="editing" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style> -->
