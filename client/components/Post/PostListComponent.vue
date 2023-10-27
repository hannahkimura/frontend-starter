<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useSettingsStore } from "../../stores/settings";
const { suppressedUsers } = storeToRefs(useSettingsStore());
const { updateSession } = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let hidePostsFromSuppressedUsers = ref(true);
const friends = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
const props = defineProps(["own"]);
const emit = defineEmits(["refreshPosts"]);

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
  emit("refreshPosts");
  void updateSession();
}

async function getFriendsPost(author?: string) {
  let postResults;
  let query: Record<string, string> = author !== undefined ? { author } : {};
  try {
    if (author === undefined) {
      console.log("Gets here right");
      friends.value = await fetchy("/api/friends", "GET", { query });
      postResults = await fetchy("/api/posts", "GET");
      const allPosts = [];
      for (const post of postResults) {
        if (friends.value.includes(post.author)) {
          allPosts.push(post);
        }
      }
      searchAuthor.value = author ? author : "";
      posts.value.splice(0, posts.value.length, ...allPosts);
    } else {
      postResults = await fetchy("/api/posts", "GET", { query });
      searchAuthor.value = author ? author : "";
      posts.value.splice(0, posts.value.length, ...postResults);
    }
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  void updateSession();
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

// onBeforeMount(async () => {
//   if (props.own) {
//     await getPosts(currentUsername.value);
//   } else {
//     await getFriendsPost();
//   }
//   loaded.value = true;
// });

onMounted(async () => {
  if (props.own) {
    await getPosts(currentUsername.value);
  } else {
    await getFriendsPost();
  }
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm v-if="!props.own" @refreshPosts="getFriendsPost" />
    <CreatePostForm v-else @refreshPosts="getPosts(currentUsername)" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Your Friend's Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm v-if="!props.own" @getPostsByAuthor="getFriendsPost" />
  </div>
  <!-- <div v-if="isLoggedIn && !props.own" class="row">
    <button v-if="hidePostsFromSuppressedUsers" class="btn-small pure-button" @click="toggleSuppressionStatus">Show posts from suppressed users</button>
    <button v-else class="btn-small pure-button" @click="toggleSuppressionStatus">Hide posts from suppressed users</button>
  </div> -->
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getFriendsPost" @editPost="updateEditing" />
      <EditPostForm v-else-if="editing" :post="post" @refreshPosts="getFriendsPost" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
@import "@/assets/font.css";
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  font-family: "VTF Redzone Classic "; /* Use the font-family you defined in the CSS. */
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
  font-family: "VTF Redzone Classic "; /* Use the font-family you defined in the CSS. */
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
  font-family: "VTF Redzone Classic "; /* Use the font-family you defined in the CSS. */
}

.custom-font {
  font-family: "VTF Redzone Classic "; /* Use the font-family you defined in the CSS. */
}
</style>
