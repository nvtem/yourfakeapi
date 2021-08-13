<template lang="pug">
  #app
    component(:is="layout")
</template>

<script>
  import { mapState } from 'vuex'
  import MainLayout from './layouts/MainLayout'

  export default {
    name: "App",

    components: {
      MainLayout
    },

    computed: {
      ...mapState('auth', ['isLogged', 'username', 'token']),

      layout() {
        return this.$route.meta.layout
      }
    },

    created() {
      this.$store.dispatch('auth/loadData')
    }
  }
</script>

<style lang="stylus">
  .cursor-pointer
    cursor pointer

  .icon-hover:hover
    color #007bff
</style>