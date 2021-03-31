<template lang="pug">
  div
    b-navbar(variant="dark" type="dark" toggleable="sm")
      b-container
        b-navbar-brand.font-weight-bold.brand(to="/") yourfakeapi

        b-navbar-toggle(target="navbar-right")

        b-collapse(id="navbar-right" is-nav)
          b-navbar-nav(class="ml-auto")
            template(v-if="isLogged")
              b-nav-item
                b-button(to="/profile" variant="outline-light") Profile
              b-nav-item
                b-button(to="/endpoints" variant="outline-light") Endpoints

              b-nav-item
                b-button(@click="c_logout" variant="outline-light") Logout
            template(v-else)
              b-nav-item
                b-button(v-b-modal="'register-window'" variant="outline-light") Register
              b-nav-item
                b-button(v-b-modal="'login-window'" variant="outline-light") Login

    RegisterWindow
    LoginWindow

    b-container(class="pt-5 content")
      router-view

    div(class="footer")
      b-link(style="color: #212529" href="http://github.com/nvtem/yourfakeapi" target="_blank") GitHub

</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import LoginWindow from "../components/LoginWindow";
  import RegisterWindow from "../components/RegisterWindow";

  export default {
    name: "MainLayout",

    components: { LoginWindow, RegisterWindow},

    computed: {
      ...mapGetters('auth', ['isLogged'])
    },

    methods: {
      c_logout() {
        this.logout()
        this.$router.push('/').catch(()=>{})
      },

      ...mapActions('auth', ['logout'])
    }
  }
</script>

<style lang="stylus" scoped>
  .brand:hover
    transform scale(1.05)

  .content
    position relative
    padding-bottom 40px

  .footer
    bottom 0
    position fixed
    height 30px
    background-color #ddd
    width 100%
    text-align center
</style>
