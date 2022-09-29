<template>
  <q-form class="q-gutter-md" @submit.prevent="submitForm">
    <div class="row items-start">
      <q-input
        autofocus
        ref="nomForm"
        label="Nom *"
        type="text"
        v-model="registerForm.nom"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre nom.']"
        class="q-pr-sm"
        style="max-width: 50%"
      />
      <q-input
        ref="prenomForm"
        label="Prénom *"
        type="text"
        v-model="registerForm.prenom"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre prénom.']"
        class="q-pl-sm"
        style="max-width: 50%"
      />
    </div>
    <q-input
      ref="emailForm"
      label="E-mail *"
      type="text"
      v-model="registerForm.email"
      lazy-rules
      :rules="[ val => validateEmail (val) || 'Veuillez renseigner un e-mail valide.']"/>
    <q-input
      ref="passwordForm"
      label="Mot de passe *"
      type="password"
      v-model="registerForm.password"
      lazy-rules
      :rules="[ val => validatePassword (val) || 'Le mot de passe ne remplit pas tous les critères.']"/>
    <div class="password-criteria q-pa-sm">
      <div class="text-subtitle2 q-mb-sm">Critères mot de passe :</div>
      <div>
        <q-icon
          :name="this.checkPassword.length ? 'check_circle' : 'cancel'"
          :color="this.checkPassword.length ? 'positive' : 'negative'"
        ></q-icon>
        Doit contenir 7 caractères ou plus.
      </div>
      <div>
        <q-icon
          :name="this.checkPassword.capital ? 'check_circle' : 'cancel'"
          :color="this.checkPassword.capital ? 'positive' : 'negative'"
        ></q-icon>
        Doit contenir une majuscule.
      </div>
      <div>
        <q-icon
          :name="this.checkPassword.number ? 'check_circle' : 'cancel'"
          :color="this.checkPassword.number ? 'positive' : 'negative'"
        ></q-icon>
        Doit contenir un nombre.
      </div>
    </div>
      <div>
        <q-btn class="full-width" color="primary" label="Créer mon compte" type="submit" rounded/>
      </div>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'FormRegisterComponent',
  data () {
    return {
      registerForm: {
        nom: '',
        prenom: '',
        email: '',
        password: ''
      },
      checkPassword: {
        length: false,
        capital: false,
        number: false
      }
    }
  },
  methods: {
    ...mapActions('userStore', ['registerUser']),
    submitForm () {
      this.registerUser(this.registerForm)
    },
    validateEmail (email) {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)
    },
    validatePassword (password) {
      // Teste longueur
      this.checkPassword.length = this.registerForm.password.length >= 7

      // Test majuscule
      this.checkPassword.capital = /^(?=.*[A-Z]).*$/.test(password)

      // Test nombre
      this.checkPassword.number = /^(?=.*[0-9]).*$/.test(password)

      return this.checkPassword.length &&
             this.checkPassword.capital &&
             this.checkPassword.number
    }
  }
}
</script>

<style scoped>
.password-criteria {
  background-color: #c2613d;
  border-radius: 0.5rem;
}
</style>
