<template>
    <div class="comments card">
      <div v-if="comments.length > 0">
        <div class="comment" v-for="comment in comments" :key="comment.sys.id">
          <div class="user">{{ comment.fields.user }}</div>
          <div class="content">{{ comment.fields.comment }}</div>
          <div class="date">{{ dateFormat(comment.sys.createdAt) }}</div>
          <!-- <pre>{{getSnapshot(comment.sys.id)}}</pre> -->
          <hr>
        </div>
      </div>
  
      <div class="no-comment" v-else>
        <div v-if="loading"><Spinner /> Loading comments...</div>
        <div v-else>No comments yet</div>
      </div>
      
      <div class="add-comment">
        <input type="text">
      </div>
    </div>
  </template>
  
  <script>
  import { createClient } from 'contentful';
  import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
  import Spinner from '../components/Spinner'
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import { faArrowLeft, faMusic, faHeadphones, faMicrophone, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
  import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
  export default {
    components: {
      Spinner,
    },
    setup() {
          return {
              faArrowLeft, faMusic, faHeadphones, faMicrophone, faWhatsapp, faPlay, faPause
      }
    },
    data() {
      return {
        comments: []
      };
    },
  
    mounted() {
      this.fetchComments();
    },
    computed: {
      ...mapGetters(['loading', 'playerSource']),
    },
    methods: {
      ...mapActions(['setLoading']),
      ...mapMutations(['setPlayerSource']),
  
      async fetchComments() {
        this.setLoading(true);
        const cda = createClient({
          space: process.env.VUE_APP_CTF_SPACE_ID,
          accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
        });

        return Promise.all([
        cda.getEntries({
          content_type: 'comment',
          order: 'sys.createdAt',
          'fields.reference.sys.id[match]': this.$route.params.rec

        }),
      ])
        .then(([comments]) => {
          this.comments = comments.items;
          this.setLoading(false);
        })
        .catch(console.error);
      },
      richTextFormat(text) {
        return documentToHtmlString(text);
      },
      urlShare(){
        return window.location
      },
      dateFormat(datetime) {
        return this.$luxonDateTime.fromISO(datetime).setLocale('fi-fi').toLocaleString(this.$luxonDateTime.DATETIME_SHORT);
      },
      back() {
        this.$router.replace({'query': null})
      },
      playerAction(status) {
        this.setPlayerSource(
          {
            title: this.rec.fields.title,
            url: this.rec.fields.file.url,
            contentType: this.rec.fields.file.contentType,
            status: status,
          }
        )
      },
      getSnapshot(id) {
        return id
      }
    },
  };
  </script>
  
<style lang="scss" scoped>
  .comments {
    padding: 1em;
    width: 80%;
  }
  .comment {
    text-align: left;
    padding: .25em;
    .user {
      font-weight: bold;
    }
    .date {
      font-size: small;
      opacity: .5;
    }
    hr {
      height: 1px;
      background-color: aqua;
      border: 0px solid rgba(255,255,255,.5);
      background: linear-gradient(
        90deg,
        rgba(255,255,255,.05) 0%,
        rgba(0,0,0,0) 100%
      );
    }
  }
  .add-comment{
    input {
      box-sizing: border-box;
      width: 100%;
    }
  }

  .no-comment {
    div {
      margin: 1em;
    }
  }

  pre {
    width: 800px;
    margin: 0 auto;
    text-align: left;
  }
  
  
  </style>
  