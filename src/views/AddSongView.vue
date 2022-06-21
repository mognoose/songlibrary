<template>
  <div class="container">
    <h1>Add content</h1>
    <div v-if="!$route.query.section">
      <div class="sectionButton" @click="openSection('song')"><h2>✹ New song</h2></div>
      <div class="sectionButton" @click="openSection('lyrics')"><h2>🎤 Lyrics</h2></div>
      <div class="sectionButton" @click="openSection('recording')"><h2>🎧 Recording</h2></div>
      <div class="sectionButton" @click="openSection('chords')"><h2>🎼 Chords</h2></div>
    </div>
      <div class="files" v-if="$route.query.section === 'song'">
        <h2>✹ New song</h2>
          <div class="input">
            <div class="label">
              <label for="name">Name</label>
            </div>
            <div class="field">
              <input name="name" type="text" placeholder="Name of the song" v-model="song.name" />
              <small>link: <strong>{{slug}}</strong></small>
            </div>
          </div>
          <div class="input">
            <div class="label">
              <label for="name">Lyrics</label>
            </div>
            <div class="field">
              <textarea name="name" type="text" rows="10" placeholder="Lyrics of the song" v-model="song.lyrics" />
            </div>
          </div>
          <div class="input">
            <div class="label">
              <label for="name">Recording</label>
            </div>
            <div class="field">
              <input name="name" type="text" placeholder="Name of the recording" v-model="song.recording.name" />
              <input name="name" type="text" placeholder="Description of the recording" v-model="song.recording.description" />

              <input type="file" @change="uploadFile" ref="file">
            </div>
          </div>
          <div class="input">
            <div class="label">
              <label for="name">Chords</label>
            </div>
            <div class="field">
              <textarea name="name" type="text" rows="10" placeholder="Chords for the song" v-model="song.chords" />
            </div>
          </div>

        <button @click="create()" class="button success">Send</button>
        <button @click="cancel()" class="button danger">Cancel</button>
      </div>

      <div class="files" v-if="$route.query.section === 'recording'">
        <h2>🎧 Files</h2>
          <div class="input">
            <div class="label">
              <label for="name">Name</label>
            </div>
            <div class="field">
              <input name="name" type="text" placeholder="name" v-model="song.name" />
              <input type="file" @change="uploadFile" ref="file">
            </div>
          </div>
        <button @click="create()" class="button success">Send</button>
        <button @click="cancel()" class="button danger">Cancel</button>
      </div>

      <div class="lyrics" v-else-if="$route.query.section === 'lyrics'">
        <h2>🎤 Lyrics</h2>
        <div
          v-if="song.fields.lyrics"
          v-html="richTextFormat(song.fields.lyrics)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No lyrics</div>
      </div>

      <div class="lyrics" v-else-if="$route.query.section === 'chords'">
        <h2>🎼 Chords and Structure</h2>
        <div
          v-if="song.fields.chordsAndStructure"
          v-html="richTextFormat(song.fields.chordsAndStructure)"
          class="lyricsbody"
        ></div>
        <div v-else style="padding-bottom: 1em">No tabulatures</div>
      </div>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      song: {
        recording: {}
      },
    };
  },
  computed: {
    slug() {
      if(!this.song.name) return location.protocol+'//'+location.host+'/songlibrary/'
      return location.protocol+'//'+location.host+'/songlibrary/'+this.song.name.replace(/[^\w\s]/gi, '').replaceAll(' ', '-').toLowerCase()
    }
  },
  methods: {
    async create() {
      console.log("SENDING...");
      if (!this.song.name) {
        console.log('Name is required');
        return;
      }
      const file = this.$refs.file.files[0]

      const contentful = require('contentful-management');

      const client = contentful.createClient({
        accessToken: process.env.VUE_APP_CTF_CMA_ACCESS_TOKEN,
      });
      const space = await client.getSpace(process.env.VUE_APP_CTF_SPACE_ID);
      const environment = await space.getEnvironment("master");

        /**
       * Asset creation and publish
       */
      if(file){
        var asset = await environment.createAssetFromFiles({
          fields: {
            title: {
              'en-US': this.song.recording.name || file.name
            },
            description: {
              'en-US': this.song.recording.description || " "
            },
            file: {
              'en-US': {
                contentType: file.type,
                fileName: file.name,
                file: file
              }
            }
          },
          metadata: {
              tags: [
                {
                  sys: {
                    type: "Link",
                    linkType: "Tag",
                    id: "demo"
                  }
                }
              ]
            }
        })
        asset = await asset.processForAllLocales()
        asset = await asset.publish()
      }      
      
      /**
       * Entry creation and publish
       */
      const song = {
        fields: {
          name: {
            "en-US": this.song.name,
          },
          slug: {
            "en-US": this.song.name.replace(/[^\w\s]/gi, '').replaceAll(' ', '-').toLowerCase()
          },
          lyrics: {
            "en-US": {
              content:[{nodeType: "paragraph", data:{}, content: [{nodeType: "text", value:this.song.lyrics, marks: [], data:{}}]}], data: {}, nodeType: "document"
              }
          },
          chordsAndStructure: {
            "en-US": {
              content:[{nodeType: "paragraph", data:{}, content: [{nodeType: "text", value:this.song.chords, marks: [], data:{}}]}], data: {}, nodeType: "document"
              }
          },
        }
      }
      if(file){
        song.fields.demo = {
          "en-US": [{
            sys: {
              type: "Link",
              linkType: "Asset",
              id: asset.sys.id
            }
          }]
        }
      }
      let entry = await environment.createEntry('song', song)
      // reassign `entry` to have the latest version number
      entry = await entry.publish();
    
      
      /**
       * Update entry with new asset
       */
      // console.log(entry)
      // entry.fields["demo"] = [
      //   {
      //     sys: {
      //     id: asset.sys.id,
      //     linkType: "Asset",
      //     type: "Link",
      //     }
      //   },
      // ];
      // entry = await entry.update();
      // entry = await entry.publish();
    console.log("DONE");
    },
    cancel() {
      this.$router.push('/add');
    },
    openSection(section) {
      this.$router.push('?section='+section)
    },
  },
};
</script>

<style lang="scss" scoped>
input, textarea {
  background-color: #121212;
  color: #cecece;
  padding: 10px 35px 10px 15px;
  border: 1px solid #666;
  border-radius: 100px;
  outline: none;
  margin-bottom: 1em;
  width: 100%;
}
.input{
  margin: 0 auto;
}
textarea {
  border-radius: 15px;
}
.label {
  margin: 0.5em;
  text-align: left;
}
.input {
  max-width: 30em;
}
</style>
