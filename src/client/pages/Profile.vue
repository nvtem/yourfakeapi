<template lang="pug">
  b-container
    h5 Username: {{ username }}
    b-link(@click="showChangePasswordForm = !showChangePasswordForm") Change password
    b-form(class="pt-4" v-if="showChangePasswordForm" @submit.prevent="changePassword")
      b-form-group(label="Password")
        b-form-input(type="password" v-model="password" :state="inputStates.password && !APIErrors.password")
        b-form-invalid-feedback(v-show="!inputStates.password") Password must be >8 characters long
        b-form-invalid-feedback(v-show="APIErrors.password") {{ APIErrors.password }}
      b-form-group(label="New password")
        b-form-input(type="password" v-model="newPassword1" :state="inputStates.newPassword1 && !APIErrors.newPassword")
        b-form-invalid-feedback(v-show="!inputStates.newPassword1") Password must be >8 characters long
        b-form-invalid-feedback(v-show="APIErrors.newPassword") {{ APIErrors.newPassword }}
      b-form-group(label="Repeat new password")
        b-form-input(type="password" v-model="newPassword2" :state="inputStates.newPassword1 && inputStates.newPassword2 && !APIErrors.newPassword")
        b-form-invalid-feedback(v-show="!inputStates.newPassword2") Password must be identical
      b-button(type="submit" variant="dark") Save
</template>

<script>
  import { mapState } from 'vuex'
  import { minLength, required, sameAs } from "vuelidate/lib/validators"

  export default {
    name: "Profile",

    data: () => ({
      showChangePasswordForm: false,
      password: '',
      newPassword1: '',
      newPassword2: '',
      APIErrors: {}
    }),

    computed: {
      ...mapState('auth', ['username']),
      inputStates() {
        return {
          password: this.$v.password.$dirty ? !this.$v.password.$error : null,
          newPassword1: this.$v.newPassword1.$dirty ? !this.$v.newPassword1.$error: null,
          newPassword2: this.$v.newPassword2.$dirty ? !this.$v.newPassword2.$error: null,
        }
      }
    },

    methods: {
      changePassword() {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.$api.request('CHANGE_PASSWORD', {}, {
            password: this.password,
            newPassword: this.newPassword1,
          }).then(r => {
            this.showChangePasswordForm = false
            this.APIErrors = {}
            this.$store.commit('auth/updateToken', r.data.token)
            this.$noticeSuccess('Password has been changed')
          })
          .catch(e => {
            this.APIErrors = {
              [e.response.data.input]: e.response.data.message
            }
          })
        }
      }
    },

    validations: {
      password: { required, minLength: minLength(8) },
      newPassword1: { required, minLength: minLength(8) },
      newPassword2: { required, minLength: minLength(8), sameAs: sameAs('newPassword1') }
    }
  }
</script>

<style scoped>

</style>