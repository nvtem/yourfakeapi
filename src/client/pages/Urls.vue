<template lang="pug">
  b-container
    h2 URLs
    p
      | Endpoint: {{ this.endpointName }}
      br
      | {{ this.endpointUrl }}

    b-button.mr-2.mb-3(:to="`/endpoints`" variant="outline-dark") Back
    b-button.mb-3(:to="`/endpoints/${endpointID}/urls/new`" variant="dark") New

    b-table(v-if="urls.length > 0" :fields="fields" :items="items" @row-clicked="rowClicked" hover tbody-tr-class="cursor-pointer")
      template(#cell(path)="data")
        | /{{ data.value }}
        b-icon-link45deg.icon-hover(class="ml-1" style="cursor: hand" @click="showFullURLWindow(data.value)")
      template(#cell(type)="data") {{ data.value === 'single' ? 'Single URL' : 'Resource' }}
      template(#cell(actions)="data")
        div(class='text-right')
          b-button(size="sm" variant="outline-danger" @click="deleteURL(data.item.id)") Delete

</template>

<script>
  export default {
    name: "Urls",

    data: () => ({
      urls: [],
      endpointID: '',
      endpointName: ''
    }),

    async created() {
      this.endpointID = this.$route.params.endpoint_id
      this.endpointName = (await this.$api.request('GET_ENDPOINT', { endpoint_id: this.endpointID })).data.name
      await this.fetchURLs()
    },

    methods: {
      rowClicked(item, index, event) {
        if (event.target.tagName === 'TD' || event.target.tagName === 'DIV')
          this.$router.push(`/endpoints/${this.endpointID}/urls/${item.id}`)
      },

      async deleteURL(id) {
        if (confirm("Delete?")) {
          await this.$api.request('DELETE_URL', {
            endpoint_id: this.endpointID,
            url_id: id
          })
          this.fetchURLs()
        }
      },

      fetchURLs() {
        this.$api.request('GET_URLS', { endpoint_id: this.endpointID })
          .then(r => {
            this.urls = r.data.urls
          })
      },

      showFullURLWindow(path) {
        let url = `${location.origin}/endpoint/${this.endpointID}/${path}`

        if (process.env.NODE_ENV === 'development')
          url = url.replace('localhost:1000', 'localhost:2000')

        prompt('Full URL', url)
      }
    },

    computed: {
      endpointUrl() {
        let url = `${location.origin}/endpoint/${this.endpointID}`

        if (process.env.NODE_ENV === 'development')
          url = url.replace(/:1000/, ':2000')

        return url
      },

      fields() {
        return [
          {
            key: 'path',
            label: 'Path'
          },
          {
            key: 'type',
            label: 'Type'
          },
          {
            key: 'actions',
            label: ''
          }
        ]
      },

      items() {
        if (this.urls)
          return this.urls.map((item, index) => {
            return {
              id: item._id,
              path: item.path,
              type: item.type
            }
          })
        else
          return []
      }
    }
  }
</script>

