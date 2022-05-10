<template>
  <div class="home">
    <h1>Login</h1>
    <input type="email" name="email" v-model="user.email" />
    <input type="password" name="password" v-model="user.password" />
    <input type="submit" value="Login" @click="login" />
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  components: {},
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      this.$auth.login({
        body: this.user,
        redirect: { name: 'user-account' },
        remember: 'Rob',
        staySignedIn: true,
        fetchUser: true,
      });
    },
  },
};
</script>
