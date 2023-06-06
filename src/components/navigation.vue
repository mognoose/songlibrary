<template>
  <nav>
    <div class="navContainer">
      <div class="logo">
        <router-link to="/"><h1>Songlibrary</h1></router-link>
      </div>

      <player />

      <div class="profile">
        <div class="dropDownMenu" v-if="menuOpen==='loggedIn'">
          <ul>
            <li><a href="https://app.contentful.com/spaces/ah7qwd6nxb6z/entries/3INXQN0afxT2ylK0qXMAlL" to="/add?section=song">ADD SONG</a></li>
            <li><a href="https://app.contentful.com/spaces/ah7qwd6nxb6z/entries?id=MYiI3GAMD3W9JYhE&contentTypeId=song&order.fieldId=updatedAt&order.direction=descending&displayedFieldIds=contentType&displayedFieldIds=updatedAt&displayedFieldIds=author&displayedFieldIds=createdAt&displayedFieldIds=createdBy&displayedFieldIds=jMcaJZN6fldjdEjf&roles=6nrC6mqyOoaTwH2jq9V0Kx&folderId=default&page=0" to="/add?section=recording">ADD RECORDING</a></li>
            <hr>
            <li><router-link to="/tabcreator">TABCREATOR</router-link></li>
            <hr>
            <li><router-link to="/help">HELP</router-link></li>
            <li><a href="" @click.prevent="logout()">LOG OUT</a></li>
          </ul>
        </div>
        <div class="dropDownMenu" v-if="menuOpen==='loggedOut'">
          <ul>
            <li><a href="https://be.contentful.com/login">ADD SONG</a></li>
            <li><a href="https://be.contentful.com/login">ADD RECORDING</a></li>
            <hr>
            <li><router-link to="/tabcreator">TABCREATOR</router-link></li>
            <hr>
            <li><router-link to="/help">HELP</router-link></li>
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
import { mapGetters, mapActions, mapMutations } from 'vuex';
import player from '@/components/player.vue';

export default {
  components: {
    player,
  },
  data() {
    return {
      authUrl: "https://be.contentful.com/oauth/authorize?response_type=token&client_id="+process.env.VUE_APP_CTF_CLIENT_ID+"&redirect_uri="+window.location+"&scope=content_management_manage",
      menuOpen: "",
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    $route (to, from) {
      this.menuOpen = "";
    }
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
.navContainer {
  display: grid;
  grid-template-columns: 1fr 8fr 1fr;
  grid-template-rows: 1fr;
  @media only screen and (max-width: 600px) {
    
    .player-container {
      grid-row-start: 2;
      grid-column-start: 1;
      grid-column-end: 4;
      widows: 100%;
    }

    .profile {
      grid-column-start: 3;
    }
  }
}
.profile{
      grid-column-start: 3;
}
.dropDownMenu{
  position: absolute;
  top: 7em;
  right: 1em;  
  padding: 2em;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  min-width: 10em;
  min-height: 10em;
  z-index: 200;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
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
.profileButton{
  width: 4em;
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
