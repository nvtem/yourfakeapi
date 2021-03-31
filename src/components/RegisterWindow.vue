<template lang="pug">
  b-modal(id="register-window" title="Register" :hide-footer="true" v-slot="slotProps")
    b-spinner(v-if="isLoading")

    b-form(v-else @submit.prevent="register")
      b-form-group(label="Username" label-for="username")
        b-form-input(v-model="username" type="text" :state="inputStates.username && !APIErrors.username" autocomplete="off")
        b-form-invalid-feedback(v-show="!inputStates.username") Username must be >2 characters long
        b-form-invalid-feedback(v-show="APIErrors.username") {{ APIErrors.username }}

      b-form-group(label="Password" label-for="password1")
        b-form-input(ref="password1" v-model="password1" type="password" :state="inputStates.password1 && !APIErrors.password" autocomplete="off")
        b-form-invalid-feedback(v-show="!inputStates.password") Password must be >8 characters long
        b-form-invalid-feedback(v-show="APIErrors.password") {{ APIErrors.password }}

      b-form-group(label="Repeat password" label-for="password2")
        b-form-input(v-model="password2" type="password" :state="inputStates.password2" autocomplete="off")
        b-form-invalid-feedback(:state="inputStates.password2") Passwords must be identical

      b-button(variant="dark" type="submit") Register
      b-button.text-dark(@click="slotProps.close()" variant="link") Cancel
</template>

<script>

  import { required, minLength, sameAs } from 'vuelidate/lib/validators'

  export default {
    name: "RegisterWindow",

    data() {
      return {
        isLoading: false,
        username: '',
        password1: '',
        password2: '',
        APIErrors: {}
      }
    },

    computed: {
      inputStates() {
        return {
          username: this.$v.username.$dirty ? !this.$v.username.$error : null,
          password1: this.$v.password1.$dirty ? !this.$v.password1.$error: null,
          password2: this.$v.password2.$dirty ? !this.$v.password2.$error : null
        }
      }
    },

    methods: {
      register() {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.isLoading = true

          this.$store.dispatch('auth/register', {
            username: this.username,
            password: this.password1
          })
            .then(r => {
              this.$bvModal.hide('register-window')
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
      },
    },

    validations: {
      username: {required, minLength: minLength(2)},
      password1: {required, minLength: minLength(8)},
      password2: {required, minLength: minLength(8), sameAs: sameAs('password1')}
    }
  }
</script>

<style scoped>

</style>
