<template lang="pug">
  b-container
    h2 Endpoints

    div(v-if="isLoading" class="d-flex justify-content-center mt-3")
      b-spinner

    template(v-else)
      b-button.mt-3.mb-2(@click="create" variant="dark") New

      b-table(v-if="endpoints.length > 0" :fields="fields" :items="items" @row-clicked="rowClicked" hover tbody-tr-class="cursor-pointer")
        template(#cell(name)="data")
          | {{ data.value }}
          b-icon-pencil.icon-hover(class="ml-2" @click.prevent="editName(data.item.id, data.value)")
        template(#cell(id)="data") {{ data.value }}
        template(#cell(actions)="data")
          div(class='text-right')
            b-button(size="sm" variant="outline-danger" @click="deleteEndpoint(data.item.id)") Delete

</template>

<script>
  export default {
    name: "Endpoints",

    data: () => ({
      isLoading: false,
      endpoints: [],
    }),

    async created() {
      await this.fetchEndpoints()
    },

    methods: {
      rowClicked(item, index, event) {
        if (event.target.tagName === 'TD' || event.target.tagName === 'DIV')
          this.$router.push(`/endpoints/${item.id}/urls`)
      },

      async fetchEndpoints() {
        this.isLoading = true
        this.endpoints = (await this.$api.request('GET_ENDPOINTS')).data.endpoints
        this.isLoading = false
      },

      create() {
        const name = prompt('Name:')

        if (name) {
          this.$api.request('CREATE_ENDPOINT', {}, {
            name
          })
            .then(() => {
              this.fetchEndpoints()
            })
            .catch(() => {
              this.$noticeError()
            })
        }
      },

      editName(id, oldName) {
        const name = prompt('Name:', oldName)
        if (name && name !== oldName) {
          this.$api.request('UPDATE_ENDPOINT', { endpoint_id: id }, {
            name
          })
            .then(() =>
              this.fetchEndpoints()
            )
            .catch(() =>
              this.$noticeError()
            )
        }
      },

      deleteEndpoint(id) {
        if (confirm("Delete?")) {
          this.$api.request('DELETE_ENDPOINT', { endpoint_id: id })
            .then(() =>
              this.fetchEndpoints()
            )
            .catch(() =>
              this.$noticeError()
          )
        }
      }
    },

    computed: {
      fields() {
        return [
          {
            key: 'name',
            label: 'Name'
          },
          {
            key: 'id',
            label: 'ID'
          },
          {
            key: 'actions',
            label: ''
          }
        ]
      },

      items() {
        if (this.endpoints)
          return this.endpoints.map(item => {
            return {
              id: item._id,
              name: item.name
            }
          })
        else
          return []
      }
    },
  }
</script>