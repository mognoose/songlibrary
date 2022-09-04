<template>
  <div class="home">
    <Songs />
  </div>
</template>

<script>
// @ is an alias to /src
import Songs from "@/components/songs.vue";
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "HomeView",
  components: {
    Songs,
  },
    
  computed: {
    ...mapGetters(['user',])
  },
};
</script>
