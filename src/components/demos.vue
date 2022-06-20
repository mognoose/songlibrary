<template>
  <div class="demo" v-if="hasTag(file, tag)">
    <h2>
      {{ file?.fields?.title }}
    </h2>
    <small>{{ dateFormat }}</small>
    <h3>{{ file?.fields?.description }}</h3>

    <video
      width="320"
      height="240"
      controls
      v-if="file.fields.file.contentType === 'video/mp4'"
    >
      <source
        :src="'https:' + file.fields.file.url"
        :type="file.fields.file.contentType"
      />
      Your browser does not support the video tag.
    </video>
    <audio controls v-else>
      <source
        :src="'https:' + file.fields.file.url"
        :type="file.fields.file.contentType"
      />
      Your browser does not support the audio tag.
    </audio>
  </div>
</template>

<script>
export default {
  name: 'Demos',
  props: {
    file: Object,
    tag: String,
  },
  computed: {
    dateFormat() {
      return this.$luxonDateTime.fromISO(this.file.sys.createdAt).setLocale('fi-fi').toLocaleString()
    }
  },
  methods: {
    hasTag(file, tag) {
      const tagnames = file.metadata.tags.map((tag) => tag.sys.id);
      if (tagnames.includes(tag)) return true;
      if (tag === 'other' && tagnames.length === 0) return true;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.demo {
  max-width: 80%;
  overflow: hidden;
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
</style>
