<template>
  <div class="demo" v-if="hasTag(file, tag)">
    <h2>
      {{ file?.fields?.title }}
    </h2>
    <h3>{{ file?.fields?.description }}</h3>

    <video
      width="360"
      height="120"
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
  methods: {
    hasTag(file, tag) {
      const tagnames = file.metadata.tags.map((tag) => tag.sys.id);
      if (tagnames.includes(tag)) return true;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
