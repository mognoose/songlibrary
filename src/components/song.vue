<template>
  <div>
    <div v-if="song?.fields">
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
            :to="$route.query.section ? $route.path : '/'"
            class="btn round"
            ><svg-icon :fa-icon="faArrowLeft" size="34"
          /></router-link>
        </div>
        <h1 style="width: 60%; text-align: center">{{ song.fields.name }}</h1>
        <div style="width: 20%">
          <ShareNetwork
            class="btn round"
            style="margin-left: auto;"
            network="whatsapp"
            :url="urlShare().toString()"
            :title="song.fields.name"
            :description="$route.query.section || 'Songlibrary'"
          >
            <svg-icon :fa-icon="faWhatsapp" size="34" />
          </ShareNetwork>
        </div>
      </div>

      <div v-if="$route.query.section === 'recordings'">
        <h2><svg-icon :fa-icon="faHeadphones" /> Recordings</h2>
        <div class="tags">
          <button
            class="tag"
            @click="toggleTag(tag.name)"
            v-for="tag in tags"
            :key="tag.name"
            :class="tag.selected ? 'selectedTag' : 'unselectedTag'"
          >
             {{ tag.name }} <span class="badge">{{tagCount[tag.name]}}</span>
          </button>
        </div>

        <DemoFiles :files="filesReversed" :tags="tags" />
      </div>

      <div class="btn lyrics" v-else-if="$route.query.section === 'lyrics'">
        <h2><svg-icon :fa-icon="faMicrophone" /> Lyrics</h2>
        <div
          v-if="song.fields.lyrics"
          v-html="richTextFormat(song.fields.lyrics)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No lyrics</div>
      </div>

      <div class="btn lyrics" v-else-if="$route.query.section === 'tabs'">
        <h2><svg-icon :fa-icon="faMusic" /> Tabs</h2>
        <div
          v-if="song.fields.tabs"
          class="lyricsbody"
        >
          <table>
            <tr v-for="tab in song.fields.tabs" :key="tab.sys.id" @click="download(tab.fields.file.url)">
              <td style="width: auto;">{{ tab.fields.title }}</td>
              <td style="width: auto;">{{ tab.fields.file.fileName }}</td>
              <td style="width: 1rem;"><svg-icon :fa-icon="faDownload" /></td>
              </tr>
          </table>
        </div>
        <div v-else style="padding-bottom: 1em">No tabs</div>
      </div>

      <div class="btn lyrics" v-else-if="$route.query.section === 'chords'">
        <h2><svg-icon :fa-icon="faMusic" /> Chords and Structure</h2>
        <div v-if="song.fields?.chords?.length > 0">
          <button
              class="tag"
              v-for="instrument in song.fields.chords"
              @click="selectInstrument(instrument.fields.instrument)"
              :key="instrument.sys.id"
              :class="$route.query.instrument === instrument.fields.instrument ? 'selectedTag' : 'unselectedTag'"
            >
              {{ instrument.fields.instrument }}
            </button>
          <div v-for="chords in song.fields.chords">
            <div
              v-if="$route.query.instrument == chords.fields.instrument"
              v-html="richTextFormat(chords.fields.chords)"
              class="lyricsbody"
            ></div>
          </div>
        </div>
        <div
          v-else-if="song.fields.chordsAndStructure"
          v-html="richTextFormat(song.fields.chordsAndStructure)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No chords</div>
      </div>

      <div v-else-if="$route.query.section === 'links'">
        <h2><svg-icon :fa-icon="faLink" /> Links</h2>
        <div
          v-if="song.fields.links"
          class="lyricsbody"
        >
          <table>
            <tr v-for="link in song.fields.links" :key="link.sys.id">
              <td><div><a :href="link.fields.url" target="_Blank">{{ link.fields.title }} - {{ link.fields.url }}</a></div></td>
            </tr>
          </table>
        </div>
        <div v-else style="padding-bottom: 1em">No links</div>
      </div>

      <div v-else>
        <div v-if="song.fields?.demo" class="btn sectionButton" @click="openSection('recordings')">
          <div class="icon"><svg-icon :fa-icon="faHeadphones" /></div>
          <div class="heading"><h2>Recordings</h2></div>
        </div>
        <div v-if="song.fields?.chordsAndStructure" class="btn sectionButton" @click="openSection('chords')">
          <div class="icon"><svg-icon :fa-icon="faMusic" /></div>
          <div class="heading"><h2>Chords</h2></div>
        </div>
        <div v-if="song.fields?.tabs" class="btn sectionButton" @click="openSection('tabs')">
          <div class="icon"><svg-icon :fa-icon="faMusic" /></div>
          <div class="heading"><h2>Tabs</h2></div>
        </div>
        <div v-if="song.fields?.lyrics" class="btn sectionButton" @click="openSection('lyrics')">
          <div class="icon"><svg-icon :fa-icon="faMicrophone" /></div>
          <div class="heading"><h2>Lyrics</h2></div>
        </div>
        <div v-if="song.fields?.links" class="btn sectionButton" @click="openSection('links')">
          <div class="icon"><svg-icon :fa-icon="faLink" /></div>
          <div class="heading"><h2>Links</h2></div>
        </div>
      </div>
      <div style="padding-bottom: 1em"></div>
    </div>
    <div v-else>
      <div class="message" v-if="loading"><Spinner /> Loading song...</div>
      <div class="message" v-else>Song not found</div>
    </div>
  </div>
</template>

<script>
import { createClient } from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import Demos from "../components/demos.vue";
import DemoFiles from "../components/files.vue";
import Spinner from "../components/Spinner";
import { mapGetters, mapActions } from "vuex";
import {
  faArrowLeft,
  faMusic,
  faHeadphones,
  faDownload,
  faMicrophone,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp
} from "@fortawesome/free-brands-svg-icons";

export default {
  components: {
    DemoFiles,
    Demos,
    Spinner,
  },
  setup() {
    return {
      faArrowLeft,
      faMusic,
      faHeadphones,
      faMicrophone,
      faDownload,
      faWhatsapp,
      faLink,
    };
  },
  data() {
    return {
      tags: [
        { name: "demo", selected: false },
        { name: "rehersalrec", selected: false },
        { name: "riff", selected: false },
        { name: "other", selected: false },
      ],
      tagCount: {},
      song: {},
    };
  },
  mounted() {
    this.fetchSong();
  },
  computed: {
    ...mapGetters(["loading"]),

    filesReversed() {
      return this.song.fields.demo.reverse();
    },
  },
  methods: {
    ...mapActions(["setLoading"]),

    async fetchSong() {
      this.setLoading(true);
      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });
      return Promise.all([
        // fetch song by slug
        client.getEntries({
          content_type: "song",
          "fields.slug[in]": this.$route.params.song,
          order: "sys.createdAt",
          include: 4,
        }),
      ])
        .then(([song]) => {
          this.song = song.items[0];
          const tagCount = {
            demo: 0,
            riff: 0,
            rehersalrec: 0,
            other: 0,
          };
          song.items[0].fields.demo.forEach((demo) => {
            if (!demo.metadata.tags[0]) {
              tagCount.other++;
              return;
            }
            if (demo.metadata.tags[0].sys.id === "demo") {
              tagCount.demo++;
              return;
            }
            if (demo.metadata.tags[0].sys.id === "riff") {
              tagCount.riff++;
              return;
            }
            if (demo.metadata.tags[0].sys.id === "rehersalrec") {
              tagCount.rehersalrec++;
              return;
            }
            if (demo.metadata.tags[0].sys.id === "other") {
              tagCount.other++;
              return;
            }
          });
          let showTag = 0;
          if (tagCount.demo === 0) showTag++;
          if (tagCount.rehersalrec === 0 && showTag === 1) showTag++;
          if (tagCount.riff === 0 && showTag === 2) showTag++;

          this.tags[showTag].selected = true;

          this.tagCount = tagCount;

          this.setLoading(false);
        })
        .catch(console.error);
    },
    richTextFormat(text) {
      return documentToHtmlString(text);
    },
    toggleTag(tag) {
      return this.tags.map((t) => {
        if (t.name === tag) t.selected = !t.selected;
      });
    },
    tagSelected(tag) {
      const tagName = this.tags.filter((t) => {
        if (t.name === tag) return t;
      });
      return tagName[0].selected;
    },
    openSection(section) {
      this.$router.push("?section=" + section);
    },
    back() {
      this.$router.replace({ query: null });
    },
    urlShare(){
      return window.location
    },
    selectInstrument(instrument) {
      this.$router.push({ params: this.$router.params, query: {section: "chords", instrument} })      
    },
    download(url) {
      window.location = url;
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
  padding-left: 0.75em;
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

.badge {
  display: inline-block;
  border-radius: 50%;
  background: #666;
  color: #2f2f2f;
  height: 15px;
  width: 15px;
}
td{
  div{
    width: 80vw;
    max-width: 800px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

</style>
