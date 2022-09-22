<template>
  <q-page>
    <div class="row q-ma-md absolute-full">
      <div class="col-4 q-px-xl q-my-auto">
        <div class="tomorrow"
             data-location-id="018319"
             data-language="FR"
             data-unit-system="METRIC"
             data-skin="light"
             data-widget-type="upcoming"
             style="padding-bottom:22px;position:relative;">
          <a
            href="https://www.tomorrow.io/weather/"
            rel="nofollow noopener noreferrer"
            target="_blank"
            style="position: absolute; bottom: 0; transform: translateX(-50%); left: 50%;">
            <img
              alt="Powered by Tomorrow.io"
              src="https://weather-website-client.tomorrow.io/img/powered-by-tomorrow.svg"
              width="140"
              height="15"/>
          </a>
        </div>
      </div>
      <div class="col-4 q-mt-xl">
        <div class="row">
          <span id="solde" class="q-mx-auto ">
            Solde :
            <span :class="this.userSolde < 0 ? 'text-red-10' : 'text-green-7'">{{this.userSolde }}</span> CHF
          </span>
        </div>
        <div class="row">
          <img src="~assets/home.jpg" alt="avatar" class="q-mx-auto">
        </div>
        <div class="row q-mb-xl">
          <q-btn-group push class="q-mx-auto">
            <q-btn :disable="cafe.quantite === 1" push text-color="white" color="secondary" icon="remove" size="xl" @click="cafe.quantite--" glossy style="border-right: 1px solid wheat"/>
            <q-btn push color="secondary" size="xl" @click="functionAchatCafe" no-caps glossy>
              Acheter {{cafe.quantite}} café<span v-if="cafe.quantite > 1">s</span>
            </q-btn>
            <q-btn :disable="cafe.quantite === 20" push text-color="white" color="secondary" icon="add" size="xl" @click="cafe.quantite++" glossy style="border-left: 1px solid wheat"/>
          </q-btn-group>
        </div>
        <div class="row">
          <q-btn color="accent q-mx-auto" size="md" @click="versementForm = true" label="Effectuer un versement" />
          <q-dialog v-model="versementForm" persistent>
            <q-card>
              <q-card-section>
                <div class="text-h6">Versement</div>
              </q-card-section>
              <q-card-section class="q-p-md">
                <q-form @submit.prevent="functionVersement" @reset="resetFormVersement" class="q-gutter-lg">
                  <q-input
                    filled
                    v-model="versement.libelle"
                    label="Libellé *"
                    hint="TWINT de 20.-"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Veuillez renseigner un libellé.']"/>
                  <q-input
                    filled
                    type="number"
                    v-model="versement.montant"
                    label="Montant *"
                    lazy-rules
                    :rules="[
                      val => val !== null && val !== '' || 'Veuillez renseigner un montant.',
                      val => val > 0 && val < 200 || 'Le montant ne peut excéder 200CHF.'
                      ]"/>
                  <q-card-actions align="right">
                    <q-btn label="Annuler" type="reset" color="primary" flat class="q-ml-sm" v-close-popup />
                    <q-btn label="Enregistrer le versement" type="submit" color="primary" v-close-popup />
                  </q-card-actions>
                </q-form>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
      <div id="historique" class="col-4">

      </div>
    </div>
  </q-page>
</template>

<script>

import { useQuasar } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'DashboardPage',
  data () {
    return {
      cafe: {
        libelle: 'Achat de café',
        quantite: 1,
        prix: 0.85 // Prix du café
      },
      versement: {
        libelle: '',
        montant: ''
      }
    }
  },
  setup () {
    const $q = useQuasar()
    return {
      versementForm: ref(false),
      showNotif () {
        $q.notify({
          message: this.setNotification.message,
          color: this.setNotification.color
        })
      },
      setUpWeather () {
        (function (d, s, id) {
          if (d.getElementById(id)) {
            if (window.__TOMORROW__) {
              window.__TOMORROW__.renderWidget()
            }
            return
          }
          const fjs = d.getElementsByTagName(s)[0]
          const js = d.createElement(s)
          js.id = id
          js.src = 'https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js'

          fjs.parentNode.insertBefore(js, fjs)
        })(document, 'script', 'tomorrow-sdk')
      }
    }
  },
  methods: {
    ...mapActions('userStore', ['achatCafe', 'effectuerVersement', 'getHistorique', 'getUserSolde']),
    async functionAchatCafe () {
      await this.achatCafe(this.cafe)
      this.cafe.quantite = 1
      this.getHistorique()
      await this.getUserSolde()
      this.showNotif()
    },
    async functionVersement () {
      await this.effectuerVersement(this.versement)
      this.getHistorique()
      await this.getUserSolde()
      this.showNotif()
    },
    resetFormVersement () {
      this.versement.montant = ''
      this.versement.libelle = ''
    }
  },
  computed: {
    ...mapGetters('userStore', ['getSolde', 'getNotification']),
    userSolde () {
      return this.getSolde
    },
    setNotification () {
      return this.getNotification
    }
  },
  mounted () {
    this.$q.dark.set(false)
    this.setUpWeather()
    this.getUserSolde()
    // this.getInfosFromLocalStorage()
  }
}
</script>

<style scoped>
#solde {
  font-size: 2.5em;
}
</style>
