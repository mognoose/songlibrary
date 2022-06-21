<template>
  <div class="container">
    <h1>Add Song</h1>
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
    <!-- <div class="input">
      <RichTextEditor />
    </div> -->
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      song: {},
    };
  },
  methods: {
    async create() {
      if (!this.song.name) {
        console.log('Name is required');
        // return;
      }
      const file = this.$refs.file.files[0]
      // console.log(file.name)
      // console.log(file.type)

      const contentful = require('contentful-management');

      const client = contentful.createClient({
        accessToken: process.env.VUE_APP_CTF_CMA_ACCESS_TOKEN,
      });
      const space = await client.getSpace(process.env.VUE_APP_CTF_SPACE_ID);
      const environment = await space.getEnvironment("master");

        /**
       * Asset creation and publish
       */
      let asset = await environment.createAssetFromFiles({
        fields: {
          title: {
            'en-US': this.song.name
          },
          description: {
            'en-US': 'Asset description'
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

      
      /**
       * Entry creation and publish
       */
      let entry = await environment.createEntry('song', {
            fields: {
              name: {
                'en-US': 'test',
              },
              demo: {
                "en-US": [{
                  sys: {
                    type: "Link",
                    linkType: "Asset",
                    id: asset.sys.id
                  }
                }]
              }
            }
          })
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

    },
    cancel() {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  background-color: #121212;
  color: #cecece;
  padding: 10px 35px 10px 15px;
  border: 1px solid #666;
  border-radius: 100px;
  outline: none;
  margin-bottom: 1em;
  width: 100%;
}
.input {
  margin: 0 auto;
}
.label {
  margin: 0.5em;
  text-align: left;
}
.input {
  max-width: 30em;
}
</style>
