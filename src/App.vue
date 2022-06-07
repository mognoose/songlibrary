<template>
  <Navigation />
  <div>
    <router-view style="min-height: 82.5vh" />
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';

export default {
  name: 'HomeView',
  components: {
    Navigation,
    Footer,
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
.sectionButton {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 1em;
  border: 1px solid #333;
  display: block;
  padding: 0px;
  border-radius: 1em;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
}
.sectionButton{
  cursor: pointer;
}
.demo {
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
</style>
