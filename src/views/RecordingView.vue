<template>
  <div class="home">
    <Recording />
  </div>
</template>

<script>
// @ is an alias to /src
import Recording from "@/components/recording.vue";

export default {
  name: "RecordingView",
  components: {
    Recording,
  },
};
</script>
