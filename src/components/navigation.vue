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
      <div class="profile">ALPHA 0.1.2</div>
    </div>
  </nav>
</template>

<script>
export default {};
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
</style>
