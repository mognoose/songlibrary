<template>
  <div class="notification" v-if="notification">
    <div class="notifContainer">
      <div class="message">{{notification}}</div>
      <div class="close" @click="setNotification('')">✕</div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  export default {
    name: "notificationComponent",
    computed: {
      ...mapGetters(['notification'])
    },
    
    methods: {
      ...mapActions(['setNotification'])
    },
  }

</script>

<style lang="scss" scoped>

.notification{
  position: fixed;
  top: 1em;
  width: 100%;
}

.notifContainer{
  border: 1px solid rgb(93, 35, 35);
  background-color: #121212;
  margin: 2em;
  display: grid;
  grid-template-columns: 9fr 1fr;
  border-radius: 1em;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  
}

.message{
  color: rgb(169, 0, 0);
  padding: 1em;

}

.close{
  align-self: center;

  font-size: 2em;
  cursor: pointer;
}

</style>