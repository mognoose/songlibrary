<template>
  <div>
    <h2>Songs</h2>
    <div class="searchWrapper">
      <input
        type="search"
        placeholder="search"
        class="search"
        v-model="search"
        @input="fetchSongs"
      />
    </div>
    <table>
      <tr v-for="song in songs" :key="song.id">
        <td @click="openSong(song.fields.slug)">{{ song.fields.name }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { createClient } from 'contentful';
export default {
  data() {
    return {
      songs: [],
      search: '',
    };
  },
  mounted() {
    this.fetchSongs();
  },
  methods: {
    async fetchSongs() {
      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });

      return Promise.all([
        // fetch all songs sorted by creation date
        client.getEntries({
          content_type: 'song',
          order: '-sys.createdAt',
          'fields.name[match]': this.search,
        }),
      ])
        .then(([songs]) => {
          this.songs = songs.items;
        })
        .catch(console.error);
    },
    openSong(slug) {
      this.$router.push(slug);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  background-color: #121212;
  color: #cecece;
  padding: 10px 35px 10px 15px;
  border: 1px solid #666;
  border-radius: 100px;
  outline: none;
  margin-bottom: 1em;
  border-style: hidden; /* hide standard table (collapsed) border */
  box-shadow: 0 0 0 1px #666; /* this draws the table border  */
}
td {
  cursor: pointer;
  border: 1px solid #666;
  padding: 1em;
  width: 100%;
}
td:hover {
  background-color: rgba(255, 255, 255, 0.02);
}
.searchWrapper {
  margin: 0 auto;
  width: 90%;
  max-width: 40em;
}
</style>
