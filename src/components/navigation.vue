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
        <div class="profileButton" v-if="user"><img :src="user.avatarUrl"></div>
        <div class="profileButton" v-else><img src="asdf"></div>
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
