<template>
  <div>
    <help-page v-if="$route.params.page" />
    <help-list v-else />
  </div>
</template>

<script>
import { createClient } from 'contentful';
import { mapGetters, mapActions } from 'vuex';
import Spinner from '../components/Spinner'
import helpList from '../components/helpList'
import helpPage from '../components/helpPage'

export default {
  components: {
    Spinner,
    helpList,
    helpPage
  },

  data() {
    return {
      pages: [],
      search: '',
    };
  },
  computed: {
    ...mapGetters(['loading']),
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    ...mapActions(['setLoading']),

    async fetchContent() {
      this.setLoading(true);
      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });

      return Promise.all([
        // fetch all songs sorted by creation date
        client.getEntries({
          content_type: 'helpPage',
          order: '-sys.createdAt',
          'fields.name[match]': this.search,
        }),
      ])
        .then(([pages]) => {
          this.pages = pages.items;
          this.setLoading(false);
        })
        .catch(console.error);
    },
    openSong(slug) {
      this.$router.push(`/help/${slug}`);
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
