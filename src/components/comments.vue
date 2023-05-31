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
    <pre>{{ user }}</pre>
    <div v-if="user.firstName" class="add-comment">
      <form @submit.prevent="submit">
        <input type="text" v-model="newComment" name="newComment">
      </form>
    </div>
    <div v-else class="add-comment">
      <a :href="authUrl">Login</a> to add a comment
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
      authUrl: "https://be.contentful.com/oauth/authorize?response_type=token&client_id="+process.env.VUE_APP_CTF_CLIENT_ID+"&redirect_uri="+window.location+"&scope=content_management_manage",
      comments: [],
      newComment: "",
    };
  },

  mounted() {
    this.fetchComments();
  },
  computed: {
    ...mapGetters(['loading', 'playerSource', 'user']),
  },
  methods: {
    ...mapActions(['setLoading', 'setNotification']),
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
    },

    async getEnvironment(branch) {
      const contentful = require("contentful-management");
      const client = contentful.createClient({
        accessToken: process.env.VUE_APP_CTF_CMA_ACCESS_TOKEN,
      });
      const space = await client.getSpace(process.env.VUE_APP_CTF_SPACE_ID);
      const environment = await space.getEnvironment(branch || process.env.VUE_APP_CTF_BRANCH);
      return environment;
    },

    async submit() {
      this.setLoading(true);
      console.log(`CREATING NEW COMMENT: ${this.newComment}`);

      console.log('reference: ', this.$route.params.rec);
      console.log('user: ', this.user.firstName);

      try {
        if (!this.newComment) throw "Comment can't be empty";
        const environment = await this.getEnvironment("master");

        /**
         * Entry creation and publish
         */
        const comment = {
          fields: {
            reference: {
              "en-US": this.$route.params.rec,
            },
            user: {
              "en-US": this.user.firstName,
            },
            comment: {
              "en-US": this.newComment,
            },
          }
        };

        let entry = await environment.createEntry("comment", comment);
        // reassign `entry` to have the latest version number
        entry = await entry.publish();
        console.log("COMMENT CREATED");
        // this.$router.push("/add");
      } catch (error) {
        console.log(error);
        this.setNotification('Error creating comment', error);
        this.setLoading(false);
        return;
    }
  },
  },
} 
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
  