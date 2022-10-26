<template>
  <q-form class="q-gutter-md" @submit.prevent="submitForm">
    <q-input
      autofocus
      ref="emailForm"
      label="E-mail *"
      type="email"
      v-model="loginForm.email"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre e-mail.']"/>
    <q-input
      ref="passwordForm"
      label="Mot de passe *"
      type="password"
      v-model="loginForm.password"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre mot de passe.']"/>
    <div>
      <q-btn class="full-width" color="primary" label="Login" type="submit" rounded/>
    </div>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'
// import { api } from 'boot/axios'

export default {
  name: 'FormLoginComponent',
  data () {
    return {
      loginForm: { // Formulaire de connexion
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('userStore', ['loginUser']),
    /**
     * Appelle l'action de login du store
     */
    async submitForm () {
      // Retourne un cookie CSRF afin de protéger le formulaire
      // await api.get('https://api-cafe.divtec.me/sanctum/csrf-cookie', { withCredentials: true }).then(async response => {
      //   await console.log(response.headers.get('set-cookies'))
      // })
      await this.loginUser(this.loginForm)
    }
  }
}
</script>

<style scoped>

</style>
