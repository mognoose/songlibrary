<template>
  <div class="home">
    <Songs />
  </div>
</template>

<script>
// @ is an alias to /src
import Songs from "@/components/songs.vue";

export default {
  name: "HomeView",
  components: {
    Songs,
  },
};
</script>
