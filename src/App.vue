<template>
  <Navigation />
  <div>
    <router-view />
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios'

import { faArrowLeft, faMusic, faHeadphones, faMicrophone } from "@fortawesome/free-solid-svg-icons";

export default {
  name: 'HomeView',
  components: {
    Navigation,
    Footer,
  },
  setup() {
		return {
			faArrowLeft, faMusic, faHeadphones, faMicrophone
    }
  },
  watch: {
  $route (to, from) {
    this.checkAuth()
  }
},
  methods: {
    ...mapActions(['setUser',]),

    async checkAuth() {
      if(this.$route.hash){
        const hash = this.$route.hash.split("&")
        if(hash[1] !== "token_type=Bearer") return
        const token = hash[0].split("=")[1]
        const userData = await axios.get("https://api.contentful.com/users/me?access_token="+token)
        this.setUser({...userData.data, token:token})
        localStorage.setItem('token', token)
        this.$router.push('/')
      } else if(localStorage.getItem('token')) {
        const userData = await axios.get("https://api.contentful.com/users/me?access_token="+localStorage.getItem('token'))
        this.setUser({...userData.data, token:localStorage.getItem('token')})
      }
    }
  },
};
</script>

<style lang="scss">
html,
body {
  background-color: #212121;
  padding: 0px;
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #a7a7a7;
  background-color: #212121;
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr 8fr 1fr;
}

a {
  font-weight: bold;
  color: #bbbbbb;

  &.router-link-exact-active {
    color: #a7a7a7;
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #a7a7a7;

    &.router-link-exact-active {
      color: #a7a7a7;
    }
  }
}

.files,
.lyrics,
.sectionButton,
.btn {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 1em;
  border: 1px solid #333;
  display: block;
  padding: 0px;
  border-radius: 1em;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  transition: .35s;
}
.sectionButton{
  cursor: pointer;
}

.round {
  display:block;
  margin: .5em 0;
  padding: .1em;
  width: 2em;
  height: 2em;
  text-decoration: none;
  font-size: 2em;
  line-height: 2.4em;
  border: 1px solid #333;
  border-radius: 50%;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
}

.btn:hover{
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.95);

}

.demo,
.card {
  width: 100%;
  border: 1px solid #333;
  display: inline-block;
  margin: 1em;
  padding: 1em;
  border-radius: 0.5em;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
audio {
  max-width: 100%;
}
.button {
  background-color: rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  border: 1px solid #666;
  padding: 1em;
  margin: 1em;
  border-radius: 1em;
  text-decoration: none;
  font-weight: bold;
  color: #bbbbbb;
  cursor: pointer;
}
.button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.success {
  border: 1px solid #228822;
  background-color: #228844;
}
.danger {
  border: 1px solid #883333;
  background-color: #bb4444;
}
.success:hover {
  border: 1px solid #228822;
  background-color: #22cc55;
  color: #ffffff;
}
.danger:hover {
  border: 1px solid #883333;
  background-color: #ee5555;
  color: #ffffff;
}
table {
  width: 90%;
  max-width: 40em;
  margin: 0 auto;
  border-collapse: collapse;
  border-radius: 0.5em;

  border-style: hidden; /* hide standard table (collapsed) border */
  box-shadow: 0 0 0 1px #666; /* this draws the table border  */
}
td, th {
  cursor: pointer;
  border: 1px solid #666;
  padding: 1em;
  width: 100%;
}
th {
  background-color: #2a2a2a;
  border-radius: 0.5em;

}
tr:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.message {
  margin-top: 4em;
}

.round {
  margin: 1rem;
}
</style>
