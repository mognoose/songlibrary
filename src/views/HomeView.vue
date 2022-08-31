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
  mounted () {
    this.checkAuth();
  },
  updated () {
    this.checkAuth();
  },
  methods: {
    ...mapActions(['setUser',]),

    async checkAuth() {
      if(this.$route.hash){
        console.log("hash found", this.$route.hash);
        const hash = this.$route.hash.split("&")
        if(hash[1] !== "token_type=Bearer") return
        console.log("hash type correct", hash);
        const token = hash[0].split("=")[1]
        const userData = await axios.get("https://api.contentful.com/users/me?access_token="+token)
        this.setUser({...userData.data, token:token})
        localStorage.setItem('token', token)
        this.$router.push('/add')
      }      
    }
  },
};
</script>
