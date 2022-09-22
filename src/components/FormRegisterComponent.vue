<template>
  <q-form class="q-gutter-md" @submit.prevent="submitForm">
    <q-input
      autofocus
      ref="nomForm"
      label="Nom *"
      type="text"
      v-model="registerForm.nom"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre nom.']"/>
    <q-input
      ref="prenomForm"
      label="Prénom *"
      type="text"
      v-model="registerForm.prenom"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre prénom.']"/>
    <q-input
      ref="emailForm"
      label="E-mail *"
      type="text"
      v-model="registerForm.email"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre e-mail.']"/>
    <q-input
      ref="passwordForm"
      label="Mot de passe *"
      type="password"
      v-model="registerForm.password"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre mot de passe.']"/>
    <div>
      <q-btn class="full-width" color="primary" label="Créer mon compte" type="submit" rounded/>
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { useQuasar } from 'quasar'

export default {
  name: 'FormRegisterComponent',
  data () {
    return {
      registerForm: {
        nom: '',
        prenom: '',
        email: '',
        password: ''
      }
    }
  },
  setup () {
    const $q = useQuasar()
    return {
      showNotif () {
        $q.notify({
          message: this.setNotification.message,
          color: this.setNotification.color
        })
      }
    }
  },
  methods: {
    ...mapActions('userStore', ['registerUser']),
    ...mapMutations('userStore', ['RESET_NOTIFICATION']),
    async submitForm () {
      await this.registerUser(this.registerForm)
      this.showNotif()
      this.RESET_NOTIFICATION()
    }
  },
  computed: {
    ...mapGetters('userStore', ['getNotification']),
    setNotification () {
      return this.getNotification
    }
  }
}
</script>

<style scoped>

</style>
