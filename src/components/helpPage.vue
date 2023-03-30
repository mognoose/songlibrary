<template>
  <div>
    <div v-if="loading"><Spinner/> Loading content...</div>
    <div v-else>
      <div
        style="
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        "
      >
        <div style="width: 20%">
          <router-link
            :to="$route.query.section ? $route.path : '/help'"
            class="btn round"
            ><svg-icon :fa-icon="faArrowLeft" size="34"
          /></router-link>
        </div>
        <h1 style="width: 60%; text-align: center">{{ page.fields?.title }}</h1>
        <div style="width: 20%">&nbsp;</div>
      </div>      <div
        v-if="page.fields?.instructions"
        v-html="richTextFormat(page.fields?.instructions)"
        class="instructions"
      ></div>
    </div>
  </div>
</template>

<script>
import { createClient } from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import Spinner from "../components/Spinner";
import { mapGetters, mapActions } from "vuex";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    Spinner,
  },
  setup() {
    return {
      faArrowLeft,
    };
  },
  data() {
    return {
      page: {},
    };
  },
  mounted() {
    this.fetchContent();
  },
  computed: {
    ...mapGetters(["loading"]),
  },
  methods: {
    ...mapActions(["setLoading"]),

    async fetchContent() {
      this.setLoading(true);
      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });
      return Promise.all([
        // fetch song by slug
        client.getEntries({
          content_type: "helpPage",
          "fields.slug[in]": this.$route.params.page,
          order: "sys.createdAt",
          include: 4,
        }),
      ])
        .then(([page]) => {
          this.page = page.items[0];
          this.setLoading(false);
        })
        .catch(console.error);
    },
    richTextFormat(text) {
      return documentToHtmlString(text);
    },
    back() {
      this.$router.replace({ query: null });
    },
  },
};
</script>

<style lang="scss" scoped>
video {
  padding: 0px;
  margin: 0px;
  max-width: 100%;
}
.instructions {
  white-space: pre-line;
  font-size: 1.2rem;
  padding: 1em;
  text-align: left;
  max-width: 50rem;
  margin: 0 auto;
}
.tags {
  display: flex;
  justify-content: center;
}
.tag {
  min-width: 3em;
  cursor: pointer;
  margin: 0.5em;
  padding: 0.5em;
  border: 0px;
  border-radius: 1em;
  background: none;
  color: #666;
}
.tag:hover {
  background: #2f2f2f;
  color: #999;
}
.selectedTag {
  background: #333;
  color: #eee;
}
.selectedTag:hover {
  background: #363636;
  color: #fff;
}

.sectionButton {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
}

.icon {
  align-self: center;
}

.heading {
  align-self: center;
}
</style>
