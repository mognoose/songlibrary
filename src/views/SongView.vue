<template>
  <div class="home">
    <Song />
  </div>
</template>

<script>
// @ is an alias to /src
import Song from "@/components/song.vue";

export default {
  name: "SongView",
  components: {
    Song,
  },
};
</script>
