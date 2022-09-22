<template>
  <img src="~assets/wave.png" class="wave" alt="registerForm-wave">
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
      <q-img round src="~assets/login.svg" class="responsive" alt="registerForm-image"/>
    </div>
    <div v-bind:class="{'justify-center': $q.screen.md || $q.screen.sm ||$q.screen.xs}"
         class="col-12 col-md-6 flex content-center">
      <q-card v-bind:style="$q.screen.lt.sm ? {'width': '80%'} : {'width': '50%'}">
        <q-card-section>
          <q-avatar size="103px" class="absolute-center shadow-10">
            <img src="~assets/avatar.jpg" alt="avatar">
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col flex justify-center q-pt-sm">
              <h2 class="text-h4 q-my-none text-weight-regular q-py-sm" style="max-width: 100%; font-size: calc(12px + 1.5vh + 1vw)">
                {{ formState ? 'Créer un compte' : 'Login'}}
              </h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div >
            <FormRegisterComponent v-if="formState"/>
            <FormLoginComponent v-else/>
            <div class="text-center q-mt-sm q-gutter-lg">
              <a class="text-white createAccountButton" @click="formLoginState">
                {{ formState ? 'Se connecter ?' : 'Créer un compte ?' }}
              </a>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>

import FormLoginComponent from 'components/FormLoginComponent'
import FormRegisterComponent from 'components/FormRegisterComponent'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'LoginPage',
  components: { FormRegisterComponent, FormLoginComponent },
  mounted () {
    this.$q.dark.set(true)
  },
  methods: {
    ...mapMutations('userStore', ['CHANGE_FORM_LOGIN_STATE']),
    formLoginState () {
      this.CHANGE_FORM_LOGIN_STATE()
    }
  },
  computed: {
    ...mapGetters('userStore', ['getFormRegisterState']),
    formState () {
      return this.getFormRegisterState
    }
  }
}
</script>

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}

.createAccountButton {
  cursor: pointer;
  text-decoration: underline;
}
</style>
