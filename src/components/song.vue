<template>
  <div>
    <div v-if="song?.fields">
      <div style="max-width: 1000px;margin: 0 auto; display: flex; justify-content: flex-start; align-items: center">
        <div style="width: 20%">
          <router-link to="/" class="btn round">🡠</router-link>
        </div>
        <h1 style="width: 60%; text-align: center">♬ {{ song.fields.name }}</h1>
        <div style="width: 20%">&nbsp;</div>
      </div>
      <div class="sectionButton" v-if="$route.query.section" @click="back()"><h2>🡠 Back</h2></div>

      <div class="files" v-if="$route.query.section === 'recordings'">
        <h2>🎧 Recordings</h2>
        <div class="tags">
          <button
            class="tag"
            @click="toggleTag(tag.name)"
            v-for="tag in tags"
            :key="tag.name"
            :class="tag.selected ? 'selectedTag' : 'unselectedTag'"
          >
            {{ tag.name }}
          </button>
        </div>

        <DemoFiles :files="song.fields.demo" :tags="tags" />
      </div>

      <div class="btn lyrics" v-else-if="$route.query.section === 'lyrics'">
        <h2>🎤 Lyrics</h2>
        <div
          v-if="song.fields.lyrics"
          v-html="richTextFormat(song.fields.lyrics)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No lyrics</div>
      </div>

      <div class="btn lyrics" v-else-if="$route.query.section === 'chords'">
        <h2>🎼 Chords and Structure</h2>
        <div
          v-if="song.fields.chordsAndStructure"
          v-html="richTextFormat(song.fields.chordsAndStructure)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No chords</div>
      </div>
      
      <div v-else>
        <div class="btn sectionButton" @click="openSection('recordings')"><h2>🎧 Recordings</h2></div>
        <div class="btn sectionButton" @click="openSection('chords')"><h2>🎼 Chords</h2></div>
        <div class="btn sectionButton" @click="openSection('lyrics')"><h2>🎤 Lyrics</h2></div>
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
import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import Demos from '../components/demos.vue';
import DemoFiles from '../components/files.vue';
import Spinner from '../components/Spinner'
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    DemoFiles,
    Demos,
    Spinner,
  },
  data() {
    return {
      tags: [
        { name: 'demo', selected: true },
        { name: 'riff', selected: false },
        { name: 'rehersalrec', selected: false },
        { name: 'other', selected: false },
      ],
      song: {},
    };
  },
  mounted() {
    this.fetchSong();
  },
  computed: {
    ...mapGetters(['loading']),

    filesReversed() {
      return this.song.fields.demo.reverse()
    }
  },
  methods: {
    ...mapActions(['setLoading']),

    async fetchSong() {
      this.setLoading(true);
      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });
      return Promise.all([
        // fetch song by slug
        client.getEntries({
          content_type: 'song',
          'fields.slug[in]': this.$route.params.song,
          order: '-sys.createdAt',
          include: 4

        }),
      ])
        .then(([song]) => {
          this.song = song.items[0];
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
      this.$router.push('?section='+section)
    },
    back() {
      this.$router.replace({'query': null})
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
</style>
