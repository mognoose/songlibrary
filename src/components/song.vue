<template>
  <div>
    <div v-if="song?.fields">
      <h1 v-if="song?.fields">♬ {{ song.fields.name }}</h1>
      <div class="demos">
        <h2>🎧 Demos</h2>
        <div v-for="demo in song.fields.demo" :key="demo.id" class="demo">
          <h2>
            {{ demo?.fields?.title }}
          </h2>
          <h3>{{ demo?.fields?.description }}</h3>

          <video
            width="360"
            height="120"
            controls
            v-if="demo.fields.file.contentType === 'video/mp4'"
          >
            <source
              :src="'https:' + demo.fields.file.url"
              :type="demo.fields.file.contentType"
            />
            Your browser does not support the video tag.
          </video>
          <audio controls v-else>
            <source
              :src="'https:' + demo.fields.file.url"
              :type="demo.fields.file.contentType"
            />
            Your browser does not support the audio tag.
          </audio>
        </div>
      </div>
      <div class="lyrics">
        <h2>🎤 Lyrics</h2>
        <div
          v-if="song.fields.lyrics"
          v-html="richTextFormat(song.fields.lyrics)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No lyrics</div>
      </div>
      <div class="lyrics">
        <h2>🎼 Tabulatures</h2>
        <div v-if="song.fields.tabs" style="padding-bottom: 1em">
          <div v-for="tab in song.fields.tabs" :key="tab.id">
            <a :href="'https://' + tab.fields.file.url">{{
              tab.fields.title
            }}</a>
          </div>
        </div>
        <div v-else style="padding-bottom: 1em">No tabulatures</div>
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

export default {
  data() {
    return {
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
</style>
