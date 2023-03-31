<template>
  <div v-show="playerSource.url">

    <div class="player" v-if="playerSource.contentType === 'audio/mpeg'">
      <div>
        <a class="btn round" @click.prevent="play()"><svg-icon :fa-icon="playerSource.status === 'play' ? faPause : faPlay" size="34" /></a>
      </div>
      <div>
        {{ timeLabel }} | {{ playerSource.title }}
        <input
          style="max-width: 90%"
          type="range"
          :min="0"
          :max="duration"
          v-model="currentTime"
          @input="updateTime"
        >
      </div>
      <button class="closeButton" @click="closePlayer()"><svg-icon :fa-icon="faXmark" size="34" /></button>
    </div>

    <div v-else-if="playerSource.contentType === 'video/mp4'" class="video">
      <div class="videoheader"><h1>{{playerSource.title}}</h1><button class="closeButton" @click="closePlayer()"><svg-icon :fa-icon="faXmark" size="34" /></button></div>
      <video
        width="320"
        height="240"
        controls
        autoplay
        v-if="playerSource.contentType === 'video/mp4'"
        ref="video"
      >
        <source
          :src="'https:' + playerSource.url"
          :type="playerSource.contentType"
        />
        Your browser does not support the video tag.
      </video>
    </div>

    <div v-else>&nbsp;</div>
  </div>

</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { faPlay, faPause, faXmark } from "@fortawesome/free-solid-svg-icons";

export default {
  data() {
    return {
      player: null,
      duration: 0,
      currentTime: 0,
      timeLabel: '00:00'
    };
  },
  computed: {
    ...mapGetters(['playerSource']),
  },
  setup() {
		return {
			faPlay, faPause, faXmark
    }
  },
  watch: {
    playerSource (newRec, oldRec) {

      if(newRec.contentType !== 'audio/mpeg') {
        if(this.player){
          this.player.pause();
          this.player.removeEventListener('timeupdate', this.timeupdate, false);
          this.player = null;
        }

        return;
      }

      if(!this.player){
        this.player = new Audio(this.playerSource.url);
        this.player.addEventListener('timeupdate', this.timeupdate, false);
        this.player.play();
        this.duration = this.player.duration;
        
        return
      }

      this.player.volume = 1;

      if(oldRec.url !== newRec.url){
        this.player.src = newRec.url
        this.player.play();

      }

      if(oldRec.status !== newRec.status){
        if(newRec.status === 'play') this.player.play();
        if(newRec.status === 'pause') this.player.pause();
      }


    }
  },
  methods: {
    ...mapMutations(['setPlayerSource']),
    play() {
      let status = 'pause'
      if (this.player.paused) {
        status = 'play'
      }
      this.setPlayerSource(
        {
          title: this.playerSource.title,
          url: this.playerSource.url,
          contentType: this.playerSource.contentType,
          status: status,
        }
      )
    },
    updateTime() {
      this.player.currentTime = this.currentTime;
    },
    timeupdate() {
      this.currentTime = this.player.currentTime;
      const hr = Math.floor(this.currentTime / 3600);
      const min = Math.floor((this.currentTime - (hr * 3600)) / 60);
      const sec = Math.floor(this.currentTime - (hr * 3600) - (min * 60));
      this.timeLabel = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    },
    closePlayer(){
      this.setPlayerSource({});
      if(this.player && this.playerSource.contentType === 'audio/mpeg'){
        this.player.pause();
        this.player.removeEventListener('timeupdate', this.timeupdate, false);
        this.player = null;

      } 

    }
  }
};
</script>

<style lang="scss" scoped>
.player {
  display: grid;
  grid-template-columns: 2fr 6fr 2fr;
  align-items: center;
  justify-items: center;
  max-width: 600px;
  margin: 0 auto;
}

.round {
  cursor: pointer;
  margin: 0 auto;
}

.video {
  position: fixed;
  left: 0vw;
  top: 0vh;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.05);
  backdrop-filter: blur(64px);
  z-index: 200;
  video{
    width: 100vw;
    height: 90vh;
  }
  .videoheader {
    display: grid;
    grid-template-columns: 1fr 9fr 1fr;
    align-items: center;
    justify-items: center;

    h1{
      grid-column-start: 2;
    }

  }

}
.closeButton {
  background: none;
  border: 0;
  color: #a7a7a7;
  cursor: pointer;
}
</style>
