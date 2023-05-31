<template>
  <div>
    <div v-if="rec.fields">
      <div style="max-width: 1000px;margin: 0 auto; display: flex; justify-content: flex-start; align-items: center">
        <div style="width: 20%">
          <router-link :to="'/'+$route.params.song+'?section=recordings'" class="btn round"><svg-icon :fa-icon="faArrowLeft" size="34"/></router-link>
        </div>
        
        <div style="width: 60%">&nbsp;</div>
        <div style="width: 20%">
          <ShareNetwork
            class="btn round"
            style="margin-left: auto;"
            network="whatsapp"
            :url="urlShare()"
            :title="rec.fields?.title"
            :description="$route.query.section || 'Songlibrary'"
          >
            <svg-icon :fa-icon="faWhatsapp" size="34" />
          </ShareNetwork>
        </div>
      </div>
      <DemoFiles :files="[rec]" :tags="[{ name: 'demo', selected: true },{ name: 'rehersalrec', selected: true },{ name: 'riff', selected: true },{ name: 'other', selected: true }]" />
      <Comments />
    </div>

    <div v-else>
      <div class="message" v-if="loading"><Spinner /> Loading recording...</div>
      <div class="message" v-else>Recording not found</div>
    </div>
  </div>
</template>

<script>
import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import Demos from '../components/demos.vue';
import Comments from '../components/comments.vue';
import DemoFiles from '../components/files.vue';
import Spinner from '../components/Spinner'
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { faArrowLeft, faMusic, faHeadphones, faMicrophone, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
export default {
  components: {
    DemoFiles,
    Demos,
    Comments,
    Spinner,
  },
  setup() {
		return {
			faArrowLeft, faMusic, faHeadphones, faMicrophone, faWhatsapp, faPlay, faPause
    }
  },
  data() {
    return {
      rec: {},
    };
  },

  mounted() {
    this.fetchRecording();
  },
  computed: {
    ...mapGetters(['loading', 'playerSource']),
  },
  methods: {
    ...mapActions(['setLoading']),
    ...mapMutations(['setPlayerSource']),

    async fetchRecording() {
      this.setLoading(true);
      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });
      await client.getAsset(this.$route.params.rec)
        .then(rec => {
          this.rec = rec;
          this.setLoading(false);
        })
        .catch('ERROR '+console.error);
    },
    richTextFormat(text) {
      return documentToHtmlString(text);
    },
    urlShare(){
      return window.location
    },
    dateFormat(date) {
      return this.$luxonDateTime.fromISO(date).setLocale('fi-fi').toLocaleString()
    },
    back() {
      this.$router.replace({'query': null})
    },
    playerAction(status) {
      this.setPlayerSource(
        {
          title: this.rec.fields.title,
          url: this.rec.fields.file.url,
          contentType: this.rec.fields.file.contentType,
          status: status,
        }
      )
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
.lyricsbody {
  white-space: pre-line;
  font-size: 1.2rem;
  padding: 1em;
  text-align: left;
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

.demo {
  .round {
    cursor: pointer;
    margin: 0 auto;
  }
}


</style>
