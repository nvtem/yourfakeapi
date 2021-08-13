<template lang="pug">
  b-modal(id="login-window" title="Login" :hide-footer="true" v-slot="slotProps")
    b-spinner(v-if="isLoading")

    b-form(v-else @submit.prevent="login")
      b-form-group(label="Username" label-for="username")
        b-form-input(v-model="username" type="text" :state="inputStates.username && !APIErrors.username")
        b-form-invalid-feedback(v-show="!inputStates.username") Username must be >2 characters long
        b-form-invalid-feedback(v-show="APIErrors.username") {{ APIErrors.username }}

      b-form-group(label="Password" label-for="password")
        b-form-input(v-model="password" type="password" :state="inputStates.password && !APIErrors.password")
        b-form-invalid-feedback(v-show="!inputStates.password") Password must be >8 characters long
        b-form-invalid-feedback(v-show="APIErrors.password") {{ APIErrors.password }}

      b-button(variant="dark" type="submit") Login
      b-button.text-dark(@click="slotProps.close()" variant="link") Cancel
</template>

<script>

  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    name: "LoginWindow",

    props: {
      title: String
    },

    data() {
      return {
        isLoading: false,
        username: '',
        password: '',
        APIErrors: {}
      }
    },

    computed: {
      inputStates() {
        return {
          username: this.$v.username.$dirty ? !this.$v.username.$error : null,
          password: this.$v.password.$dirty ? !this.$v.password.$error: null,
        }
      }
    },

    methods: {
      login() {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.isLoading = true
          this.$store.dispatch('auth/login', {
            username: this.username,
            password: this.password
          })
            .then(r => {
              this.$bvModal.hide('login-window')
            })
            .catch(e => {
              this.APIErrors = {
                [e.response.data.input]: e.response.data.message
              }
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      }
    },

    validations: {
      username: {required, minLength: minLength(2)},
      password: {required, minLength: minLength(8)}
    }
  }
</script>

<style scoped>

</style>
