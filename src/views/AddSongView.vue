<template>
  <div>
    <div v-if="!auth">

      <div class="input">
        <div class="label">
          <label for="name">PIN:</label>
        </div>
        <div class="field">
          <input type="password" v-model="pin" :class="{authFailed}">
          <button @click="login()" class="button success">Login</button>

        </div>
      </div>
    </div>
    <div class="container" v-else>
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
            <div class="field" style="padding-bottom: 1em;">
              <Multiselect
                v-model="song.recording.type"
                placeholder="Choose recording type"
                :searchable="true"
                label="name"
                valueProp="value"
                :options="tags"
              />
            </div>
            <div class="field">
              <input name="name" type="text" placeholder="Name of the recording" v-model="song.recording.name" />
              <input name="description" type="text" placeholder="Description of the recording" v-model="song.recording.description" />

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
        <h2>🎧 Recording</h2>
        <div class="input">
          <div class="label">
            <label for="name">For Song: {{song.name}}</label>
          </div>
            <Multiselect
              v-model="song.id"
              placeholder="Choose a song from library"
              :filter-results="false"
              :min-chars="1"
              :resolve-on-load="false"
              :delay="0"
              :searchable="true"
              :options="async query => await fetchSongs(query)"
            />
        </div>

        <div v-if="song.id">

          <div class="input">
            <div class="label">
              <label for="name">Type</label>
            </div>
            <div class="field">
              <Multiselect
                v-model="song.recording.type"
                placeholder="Choose recording type"
                :searchable="true"
                label="name"
                valueProp="value"
                :options="tags"
              />
            </div>
          </div>
        </div>
        <div v-if="song.id && song.recording.type">
          <div class="input">
            <div class="label">
              <label for="name">Recording</label>
            </div>
            <input name="name" type="text" placeholder="Name of the recording" v-model="song.recording.name" />
            <input name="description" type="text" placeholder="Description of the recording" v-model="song.recording.description" />

            <input type="file" @change="uploadFile" ref="file">
          </div>
          <button @click="addFile()" class="button success">Send</button>
          <button @click="cancel()" class="button danger">Cancel</button>
        </div>
        <div style="padding-bottom: 2em" />

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
        />
        <button @click="addFile()" class="button success">Send</button>
        <button @click="cancel()" class="button danger">Cancel</button>
        <Spinner loading />
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import { createClient } from 'contentful';
import Spinner from '../components/Spinner'
export default {
  components: {
    Multiselect,
    Spinner
  },
  data() {
    return {
      auth: false,
      authFailed: false,
      pin: "",
      song: {
        recording: {type:""}
      },
      tags:
      [
        { value: "demo", name: "Demo" },
        { value: "riff", name: "Riff" },
        { value: "rehersalrec", name: "Rehersalrec" },
        { value: "other", name: "Other" },
      ],
      loading: true,
    };
  },
  computed: {
    slug() {
      if(!this.song.name) return location.protocol+'//'+location.host+'/songlibrary/'
      return location.protocol+'//'+location.host+'/songlibrary/'+this.song.name.replace(/[^\w\s]/gi, '').replaceAll(' ', '-').toLowerCase()
    }
  },
  methods: {
    login(){
      console.log("login");
      if(this.pin.toString() === "0707") this.auth = true
      else this.authFailed = true
    },
    async getEnvironment(branch){
      const contentful = require('contentful-management')
      const client = contentful.createClient({accessToken: process.env.VUE_APP_CTF_CMA_ACCESS_TOKEN})
      const space = await client.getSpace(process.env.VUE_APP_CTF_SPACE_ID)
      const environment = await space.getEnvironment(branch)
      return environment
    },
    async upload() {
      this.loading = true
      console.log("UPLOADING...");

      const environment = await this.getEnvironment("master");
      const file = this.$refs.file.files[0]

      /**
     * Asset creation and publish
     */
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
                  id: this.song.recording.type
                }
              }
            ]
          }
      })
      asset = await asset.processForAllLocales()
      asset = await asset.publish()

      console.log("FILE UPLOADED", asset);
      this.loading = false

      return {
          "en-US": [{
            sys: {
              type: "Link",
              linkType: "Asset",
              id: asset.sys.id
            }
          }]
        }

    },
    async create() {
      console.log("CREATING NEW SONG...");
      if (!this.song.name && !this.song.id) {
        console.log('Song name is required');
        return;
      }

      const environment = await this.getEnvironment("master");
      const file = this.$refs.file.files[0]
      
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
        var recording = await this.upload()
        song.fields.demo = recording
      }
      let entry = await environment.createEntry('song', song)
      // reassign `entry` to have the latest version number
      entry = await entry.publish();
      console.log("SONG CREATED");


      },
      async addFile() {
      const environment = await this.getEnvironment("master");

      var recording = await this.upload()

      /**
       * Entry update and publish
       */
      console.log("LINKING RECORDING", recording);

      let entry = await environment.getEntry(this.song.id)
      console.log("TO", entry);
      if(entry.fields.demo) {entry.fields.demo["en-US"].push(recording["en-US"][0]); console.log("added", entry);}
      else {entry.fields.demo = recording; console.log("created", entry);}

      let updatedEntry = await entry.update()
      updatedEntry = await updatedEntry.publish();
      console.log("DONE", updatedEntry);

    },
    cancel() {
      this.$router.push('/add');
    },
    openSection(section) {
      this.$router.push('?section='+section)
    },

    async fetchSongs(query) {

      const client = createClient({
        space: process.env.VUE_APP_CTF_SPACE_ID,
        accessToken: process.env.VUE_APP_CTF_CDA_ACCESS_TOKEN,
      });

      const data = await client.getEntries({
          content_type: 'song',
          order: '-sys.createdAt',
          'fields.name[match]': query,
        })
      
      console.log(data.items);

      return data.items.map((item) => {
        return { value: item.sys.id, label: item.fields.name }
      })
    }
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss">
input,
textarea,
select,
.multiselect-search,
.multiselect,
.multiselect-options{
  background-color: #121212;
  color: #cecece;
  padding: 10px 35px 10px 15px;
  border: 1px solid #666;
  border-radius: 100px;
  outline: none;
  margin-bottom: 1em;
  width: 100%;
}
.multiselect,
.multiselect-options{
  border: 0px;
  margin: 0px;
  padding: 0px;
  width: 110%;
}
.is-pointed{
  background-color: #121212 !important;
  color: #FFF !important;
}
.multiselect-dropdown{
  border-radius: 15px;
  border: 0px;
  background-color: rgba($color: #000000, $alpha: 0);
  overflow-x: hidden;
}
.input{
  margin: 0 auto;
}
textarea,
.multiselect-options{
  border-radius: 15px;
}
select{
  width: 110%;
  -webkit-appearance: none;
  appearance: none;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: "▼";
  font-size: 1rem;
  top: 9px;
  right: -35px;
  position: absolute;
}
.label {
  margin: 0.5em;
  text-align: left;
}
.input {
  max-width: 30em;
}
.song{
  background-color: none;
}
.authFailed{
  border: 1px solid red;
.success, .danger{
  height: 50px;
  width: 100px;
}
}










.sk-cube-grid {
  display: inline-block;
  margin: 0px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #666;
  float: left;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
          animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; 
}
.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s; }
.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
          animation-delay: 0s; }
.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1); 
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1);
  } 
}
</style>

