<template>
  <div>
    <div v-if="!list" class="cards">
      <div v-for="file in files.reverse()" :key="file.id">
        <div v-for="tag in tags" :key="tag.name">
          <Demos v-if="tagSelected(tag.name)" :file="file" :tag="tag.name" />
        </div>
      </div>
    </div>
    <div v-else class="list">
      <table>
        <tr>
          <th>Name</th>
          <th>Preview</th>
          <th>Tags</th>
        </tr>
        <tr v-for="file in files" :key="file.id">
          <td>{{ file.fields.title }}</td>
          <td>
            <div> 
              <button v-if="playing===file.fields.title" @click="pause(file.fields.title)">Pause</button> 
              <button v-else @click="play(file.fields.title)">Play</button> 
            </div>
            <audio :id="'player-'+file.fields.title" v-if="file.fields.file.contentType !== 'video/mp4'">
              <source
                :src="'https:' + file.fields.file.url"
                :type="file.fields.file.contentType"
              />
              Your browser does not support the audio tag.
            </audio>
          </td>
          <td><span v-for="tag, i in file.metadata.tags.map(tag=>tag.sys.id)" :key="i">{{tag}}</span></td>
        </tr>
      </table>    
    </div>
  </div>
</template>

<script>
import Demos from '../components/demos.vue';
export default {
  name: 'Files',
  components: {
    Demos,
  },
  computed: {
    list() {
      return this.$route.query.list
    }
  },
  data() {
    return {
      playing: '',
    }
  },
  props: {
    files: Array,
    tags: Array,
    cards: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    tagSelected(tag) {
      const tagName = this.tags.filter((t) => {
        if (t.name === tag) return t;
      });
      return tagName[0].selected;
    },
    hasTag(file, tag) {
      const tagnames = file.metadata.tags.map((tag) => tag.sys.id);
      if (tagnames.includes(tag)) return true;
      if (tag === 'other' && tagnames.length === 0) return true;
      return false;
    },
    play(id){
      this.playing = id
      document.getElementById('player-'+id).play()
    },
    pause(id){
      this.playing = ''
      document.getElementById('player-'+id).pause()
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

