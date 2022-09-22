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
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { useQuasar } from 'quasar'

export default {
  name: 'FormLoginComponent',
  data () {
    return {
      loginForm: {
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
    ...mapActions('userStore', ['loginUser']),
    ...mapMutations('userStore', ['RESET_NOTIFICATION']),
    async submitForm () {
      await this.loginUser(this.loginForm)
      if (this.setNotification.message) {
        this.showNotif()
        this.RESET_NOTIFICATION()
      }
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
