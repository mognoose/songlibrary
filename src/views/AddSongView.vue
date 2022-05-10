<template>
  <div class="container">
    <h1>Add Song</h1>
    <div class="input">
      <div class="label">
        <label for="name">Name</label>
      </div>
      <div class="field">
        <input name="name" type="text" placeholder="name" v-model="song.name" />
      </div>
    </div>
    <button @click="add()" class="button success">Send</button>
    <button @click="cancel()" class="button danger">Cancel</button>
    <!-- <div class="input">
      <RichTextEditor />
    </div> -->
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      song: {},
    };
  },
  methods: {
    async add() {
      if (!this.song.name) {
        console.log('Name is required');
        return;
      }
      const contentful = require('contentful-management');

      const client = contentful.createClient({
        accessToken: process.env.VUE_APP_CTF_CMA_ACCESS_TOKEN,
      });
      client
        .getSpace(process.env.VUE_APP_CTF_SPACE_ID)
        .then((space) =>
          space.getEnvironment(process.env.VUE_APP_CTF_ENVIRONMENT)
        )
        .then((environment) =>
          environment.createEntry('song', {
            fields: {
              name: {
                'en-US': this.song.name || 'Unnamed',
              },
            },
          })
        )
        .then((entry) => entry.publish())
        .then((entry) => console.log(`Entry ${entry.sys.id} published.`))
        .catch(console.error);
    },
    cancel() {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  background-color: #121212;
  color: #cecece;
  padding: 10px 35px 10px 15px;
  border: 1px solid #666;
  border-radius: 100px;
  outline: none;
  margin-bottom: 1em;
  width: 100%;
}
.input {
  margin: 0 auto;
}
.label {
  margin: 0.5em;
  text-align: left;
}
.input {
  max-width: 30em;
}
</style>
