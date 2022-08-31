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
        <div class="dropDownMenu" v-if="menuOpen==='loggedIn'">LOG OUT</div>
        <div class="dropDownMenu" v-if="menuOpen==='loggedOut'"><a :href="authUrl">LOGIN</a></div>
        <div class="profileButton" v-if="user.token" @click="openMenu('loggedIn')"><img :src="user.avatarUrl"></div>
        <div class="profileButton" v-else @click="openMenu('loggedOut')"><img src="./../assets/icons/user.svg"></div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['user'])
  },
  data() {
    return {
      authUrl: "https://be.contentful.com/oauth/authorize?response_type=token&client_id="+process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN+"&redirect_uri=https://songlibrary.herokuapp.com&scope=content_management_manage",
      menuOpen: "",
    };
  },
  methods: {
    openMenu(menu){
      if(this.menuOpen===menu){
        this.menuOpen=""
        return
      }
      this.menuOpen=menu;
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

  width: 10em;
  min-height: 10em;
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
