<template lang="pug">
  b-form(@submit.prevent="save")
    b-form-radio-group(v-model="URLType" :options="URLTypeOptions" buttons button-variant="outline-dark")

    b-form-checkbox(v-model="json" v-show="URLType === 'single'" class="mt-2") JSON

    b-form-group(label="Path" class="mt-2")
      b-form-input(v-model="path" @input="onPathChanged" required)

    b-tabs(v-if="URLType === 'single'")
      b-tab(v-for="method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']" :title="method")
        ace(:options="{ useWorker: json || URLType === 'resource' }" v-model="responses[method]" lang="json" width="100%" height="300px" theme="chrome")

    ace(v-else v-model="resource" lang="json" width="100%" height="300px" theme="chrome")

    div(class="mt-2")
      b-button(type="submit" v-if="mode === 'create'" variant="dark") Create
      b-button(type="submit" v-else variant="dark") Save

      b-button(@click="$emit('cancel')" class="ml-1" variant="outline-dark") Cancel
</template>

<script>
  import ace from "vue2-ace-editor";

  export default {
    name: "EditURL",
    props: ['id', 'endpointID'],

    components: { ace },

    data: () => ({
      URLType: 'single',
      json: true,
      path: '/',
      resource: '',
      responses: {
        GET: '{}',
        POST: '{}',
        PUT: '{}',
        PATCH: '{}',
        DELETE: '{}',
      }
    }),

    created() {
      if (this.id === 'new') {
        this.mode = 'create'
      } else {
        this.mode = 'update'
        this.$api.request('GET_URL', {
          endpoint_id: this.endpointID,
          url_id: this.id
        })
          .then(r => {
            this.URLType = r.data.url.type
            _.assign(this, _.pick(r.data.url, ['path', 'responses', 'resource']))
            this.path = '/' + this.path
          })
      }

      require('brace/mode/json')
      require('brace/theme/chrome')
    },

    computed: {
      URLTypeOptions() {
        return [
          { value: "single", text: "Single URL" },
          { value: "resource", text: "Resource" },
        ]
      }
    },

    watch: {
      json(checked) {
        const replaceWhat = checked ? '' : '{}'
        const replaceTo = checked ? '{}' : ''

        for (const key in this.responses) {
          if (this.responses[key] === replaceWhat) {
            this.responses[key] = replaceTo
          }
        }
      }
    },

    methods: {
      onPathChanged() {
        if (!this.path.startsWith('/'))
          this.path = '/' + this.path
      },

      save() {
        if (this.URLType === 'single' && this.json) {
          for (const response of Object.values(this.responses)) {
            try {
              JSON.parse(response)
            } catch (e) {
              alert('Error! All responses must be in JSON format')
              return false
            }
          }
        }

        if (this.URLType === 'resource') {
          try {
            JSON.parse(this.resource)
          } catch (e) {
            alert('Error! Resource must be in JSON format')
            return false
          }
        }

        let requestType, params

        if (this.mode === 'create') {
          requestType = 'CREATE_URL'
          params = {
            endpoint_id: this.endpointID
          }
        } else {
          requestType = 'UPDATE_URL'
          params = {
            url_id: this.id
          }
        }

        let data = {
          type: this.URLType,
          path: this.path
        }

        if (data.path.startsWith('/'))
          data.path = data.path.substr(1)

        if (data.path === '') {
          alert('Enter path!')
          return false
        }

        if (this.URLType === 'single')
          data.responses = this.responses
        else
          data.resource = this.resource

        this.$api.request(requestType, params, data)
          .then(r => {
            this.$router.push(`/endpoints/${this.endpointID}/urls`)
          })
          .catch(() => {
            alert('Error! URL already exists')
          })
      },

    },
  }
</script>

<style scoped>

</style>