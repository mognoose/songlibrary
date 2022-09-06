<template>
  <nav>
    <div class="flex">
      <div class="logo">
        <router-link to="/"><h1>Songlibrary</h1></router-link>
      </div>
      <!-- <div class="menu">
        <router-link to="/">Songs</router-link>&nbsp;|&nbsp;<router-link
          to="/add"
          >Add&nbsp;Song</router-link
        >
      </div> -->
      <div>{{ $version }}</div>
      <div class="profile">
        <div class="dropDownMenu" v-if="menuOpen==='loggedIn'">
          <ul>
            <li><a href="/add?section=song">ADD SONG</a></li>
            <li><a href="/add?section=recording">ADD RECORDING</a></li>
            <li><a href="#" class="disabled">ADD MEMBER</a></li>
            <hr>
            <li><a href="" @click.prevent="logout()">LOG OUT</a></li>
          </ul>
        </div>
        <div class="dropDownMenu" v-if="menuOpen==='loggedOut'">
          <ul>
            <li><a href="#" class="disabled">ADD SONG</a></li>
            <li><a href="#" class="disabled">ADD RECORDING</a></li>
            <li><a href="#" class="disabled">ADD MEMBER</a></li>
            <hr>
            <li><a :href="authUrl">LOGIN</a></li>
          </ul>
          </div>
        <div class="profileButton" v-if="user.token" @click="openMenu('loggedIn')"><img :src="user.avatarUrl"></div>
        <div class="profileButton" v-else @click="openMenu('loggedOut')"><img src="./../assets/icons/user.svg"></div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['user'])
  },
  data() {
    return {
      authUrl: "https://be.contentful.com/oauth/authorize?response_type=token&client_id="+process.env.VUE_APP_CTF_CLIENT_ID+"&redirect_uri=https://songlibrary.vercel.app&scope=content_management_manage",
      menuOpen: "",
    };
  },
  methods: {
    ...mapActions(['setUser']),
    openMenu(menu){
      if(this.menuOpen===menu){
        this.menuOpen=""
        return
      }
      this.menuOpen=menu;
    },
    login(){
      this.menuOpen=""
      this.setUser({firstName: 'debug'})
      localStorage.setItem('token', 'debug')
    },
    logout(){
      this.menuOpen=""
      this.setUser({})
      localStorage.removeItem('token')
      this.$router.push('/')
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  background-color: #121212;
  margin: 0px;
  padding: 1em;
}
.flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.profile,
.menu,
.logo {
  display: inline-block;
  width: 30%;
}
.dropDownMenu{
  position: absolute;
  top: 7em;
  padding: 2em;
  background-color: #121212;

  min-width: 10em;
  min-height: 10em;
}
.dropDownMenu ul{
  list-style-type: none;
  padding: 0px;
  margin: 0px;
}
li {
  padding-left: 2em;
  text-indent: -2em;
  }
li a{
  display: block;
  text-decoration: none;
  margin: 1em;
  transition: 450ms;
}
li a:hover{
  color: #eee;
}
.disabled{
  color: #333;
}
.disabled:hover{
  color: #444;
}
hr {
  border: 1px solid #212121
}
.logo{
  display: flex;
  justify-content: flex-start;
}
.profile{
  display: flex;
  justify-content: flex-end;
}
.profileButton{
  max-width: 4em;
  border-radius: 50%;
}
.profileButton img{
  border-radius: 50%;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.8);
  width: 100%;
  cursor: pointer;
}
.profileButton img:hover{
  border-radius: 50%;
  box-shadow: 0px 0px 5px rgba(200,200,200,0.3);
  width: 100%;
}
</style>
