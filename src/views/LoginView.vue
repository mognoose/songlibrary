<template>
  <div class="home">
    <h1>Login</h1>
    <a :href="oAuthUrl">oAuth</a>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  components: {},
  data() {
    return {
      oAuthUrl: "https://be.contentful.com/oauth/authorize?response_type=token&client_id=aUcTsnU9SixQqaRQ1GTz7jBYy-cGkEGqfJ3_K1zOXio&redirect_uri=https://songlibrary.herokuapp.com&scope=content_management_manage",
    };
  },
  // methods: {
  //   login() {
  //     this.$router.go(this.oAuthUrl)
  //   },
  // },
};
</script>
<style scoped>
.home{
  max-width: 1000px;
  margin: 0 auto;
}
</style>
