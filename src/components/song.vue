<template>
  <div>
    <div v-if="song?.fields">
      <h1>♬ {{ song.fields.name }}</h1>
      <div class="sectionButton" v-if="$route.query.section" @click="back()"><h2>🡠 Back</h2></div>
      <div class="files" v-if="$route.query.section === 'files'">
        <h2>🎧 Files</h2>
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

        <div v-for="file in song.fields.demo" :key="file.id">
          <div v-for="tag in tags" :key="tag.name">
            <Demos v-if="tagSelected(tag.name)" :file="file" :tag="tag.name" />
          </div>
        </div>
      </div>
      <div class="lyrics" v-else-if="$route.query.section === 'lyrics'">
        <h2>🎤 Lyrics</h2>
        <div
          v-if="song.fields.lyrics"
          v-html="richTextFormat(song.fields.lyrics)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No lyrics</div>
      </div>
      <div class="lyrics" v-else-if="$route.query.section === 'chords'">
        <h2>🎼 Chords and Structure</h2>
        <div
          v-if="song.fields.chordsAndStructure"
          v-html="richTextFormat(song.fields.chordsAndStructure)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No tabulatures</div>
      </div>
      <!-- <div class="lyrics">
        <h2>🎼 Tabulatures</h2>
        <div v-if="song.fields.tabs" style="padding-bottom: 1em">
          <div v-for="tab in song.fields.tabs" :key="tab.id">
            <a :href="'https://' + tab.fields.file.url">{{
              tab.fields.title
            }}</a>
          </div>
        </div>
        <div v-else style="padding-bottom: 1em">No tabulatures</div>
      </div> -->
      <div v-else>
        <div class="sectionButton" @click="openSection('lyrics')"><h2>🎤 Lyrics</h2></div>
        <div class="sectionButton" @click="openSection('chords')"><h2>🎼 Chords</h2></div>
        <div class="sectionButton" @click="openSection('files')"><h2>🎧 Files</h2></div>
      </div>
      <div style="padding-bottom: 1em"></div>

      <!-- <button @click.prevent="returnHome">Back</button>
      <pre v-if="song?.fields?.name">{{ song.fields }}</pre> -->
    </div>
    <div v-else>Song not found</div>
  </div>
</template>

<script>
import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import Demos from '../components/demos.vue';
export default {
  components: {
    Demos,
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
  methods: {
    async fetchSong() {
      console.log(this.$route.params.song);
      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });
      return Promise.all([
        // fetch song by slug
        client.getEntries({
          content_type: 'song',
          'fields.slug[in]': this.$route.params.song,
        }),
      ])
        .then(([song]) => {
          this.song = song.items[0];
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
