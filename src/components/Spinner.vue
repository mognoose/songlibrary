<template>
  <div class="sk-cube-grid" :style="loading?'opacity:1':'opacity:0'">
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>
  </div>
</template>

<script>
  export default {
    name: "spinnerComponent",
    props: {
      loading: {
        type: Boolean,
        required: true
      },
    },
  }

</script>

<style lang="scss" scoped>

</style>