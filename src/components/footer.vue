<template>
  <footer>
    <div class="flex">
      <div class="logo">
        <a href="https://be.contentful.com/login">Contentful</a>
      </div>
      <div class="profile"><small>Version {{ version }}</small></div>
    </div>
  </footer>
</template>

<script>
import { version } from "../../package.json";

export default {
  data() {
    return {
      version: version
    }
  },
};
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
