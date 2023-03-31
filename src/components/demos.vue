<template>
  <div class="demo" v-if="hasTag(file, tag)">
    <router-link :to="$route.params.song+'/'+file?.sys?.id">
      <h2>
        {{ file?.fields?.title }}
      </h2>
    </router-link>
    <small>{{ dateFormat + ' - ' + tag}}</small>
    <h3>{{ file?.fields?.description }}</h3>
    <div class="media-container" :class="file?.fields?.file?.contentType === 'audio/mpeg' ? 'audio-container' : 'video-container'">
      <a class="btn round" @click.prevent="playerAction('play')" v-if="playerSource.title !== file.fields.title || playerSource.status !== 'play'"><svg-icon :fa-icon="faPlay" size="34" /></a>
      <a class="btn round" @click.prevent="playerAction('pause')" v-if="playerSource.title === file.fields.title && playerSource.status === 'play'"><svg-icon :fa-icon="faPause" size="34" /></a>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";


export default {
  name: 'Demos',
  props: {
    file: Object,
    tag: String,
  },
  setup() {
		return {
			faPlay, faPause
    }
  },
  computed: {
    ...mapGetters(['playerSource']),
    dateFormat() {
      return this.$luxonDateTime.fromISO(this.file.sys.createdAt).setLocale('fi-fi').toLocaleString()
    }
  },
  methods: {
    ...mapMutations(['setPlayerSource']),

    hasTag(file, tag) {
      const tagnames = file.metadata.tags.map((tag) => tag.sys.id);
      if (tagnames.includes(tag)) return true;
      if (tag === 'other' && tagnames.length === 0) return true;
      return false;
    },
    playerAction(status) {
      this.setPlayerSource(
        {
          title: this.file.fields.title,
          url: this.file.fields.file.url,
          contentType: this.file.fields.file.contentType,
          status: status,
        }
      )
    },
  },
};
</script>

<style lang="scss" scoped>
.demo {
  max-width: 80vw;
  overflow: hidden;
  h3{
    max-width: 100%;
  }
}
video {
  margin-left: 0px;
}
h2{
  margin-bottom: 0px;
}  
small{
  padding: 0px;
  margin: 0px;
}
a:link {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

.demo {
  .round {
    cursor: pointer;
    margin: 0 auto;
  }

  .media-container {
    box-sizing: border-box;
    max-width: 320px;
    margin: 0 auto;
  }

  .video-container {
    background: #000;
    padding: 4rem;
  }
}
</style>
