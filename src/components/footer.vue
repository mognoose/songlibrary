<template>
  <footer>
    <div class="flex">
      <div class="logo">
        <a href="https://be.contentful.com/login">Login</a>
      </div>
      <!-- <div class="menu">
        <router-link to="/">Songs</router-link>&nbsp;|&nbsp;<router-link
          to="/add"
          >Add&nbsp;Song</router-link
        >
      </div> -->
      <div class="profile">ALPHA 0.1.2</div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
footer {
  background-color: #121212;
  margin: 0px;
  padding: 1em;
  box-sizing: border-box;
  width: 100%;
  color: white;
  text-align: center;
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
