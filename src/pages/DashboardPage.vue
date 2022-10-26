<template>
  <q-page>
    <div class="row q-ma-md absolute-full">
      <div class="col-4 q-px-xl q-my-auto desktop-only">
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
      <div :class="this.$q.platform.is.mobile ? 'col-auto' : 'col-4'" class="q-mt-lg">
        <div class="row">
          <span id="solde" class="q-mx-auto">
            Solde :
            <span :class="this.userSolde < 0 ? 'text-red-10' : 'text-green-7'">{{this.userSolde }}</span> CHF
          </span>
        </div>
        <div class="row">
          <img src="~assets/home.jpg" alt="avatar" id="imgCafe" class="q-mt-sm q-mx-auto">
        </div>
        <div class="row q-mb-xl">
          <q-btn-group push class="q-mx-auto" :class="this.$q.platform.is.mobile ? 'q-mt-xl' : 'q-mt-sm'">
            <q-btn :disable="cafe.quantite === 1" push text-color="white" color="secondary" icon="remove" :size="this.$q.platform.is.mobile ? 'lg' : 'xl'" @click="cafe.quantite--" glossy style="border-right: 1px solid wheat"/>
            <q-btn push color="secondary" :size="this.$q.platform.is.mobile ? 'lg' : 'xl'" @click="functionAchatCafe" no-caps glossy>
              Acheter {{cafe.quantite}} café<span v-if="cafe.quantite > 1">s</span>
            </q-btn>
            <q-btn :disable="cafe.quantite === 20" push text-color="white" color="secondary" icon="add" :size="this.$q.platform.is.mobile ? 'lg' : 'xl'" @click="cafe.quantite++" glossy style="border-left: 1px solid wheat"/>
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
      <div id="historique" class="col-4 desktop-only"/>
    </div>
  </q-page>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'DashboardPage',
  data () {
    return {
      cafe: {
        libelle: '', // Libellé de l'achat de café
        quantite: 1, // Quantité par défaut
        prix: '' // Prix du café
      },
      versement: {
        libelle: '', // Libellé du vermsement
        montant: '' // Montant du versement
      },
      versementForm: ref(false) // Variable qui s'occupe d'afficher ou non la pop-up de versement
    }
  },
  methods: {
    ...mapActions('userStore', ['achatCafe', 'effectuerVersement', 'getHistorique', 'getUserSolde', 'getUserSettings']),
    /**
     * Appelle l'action du store qui achète un/des café(s)
     * Reset automatiquement la quantité à 1 café
     */
    functionAchatCafe () {
      this.achatCafe(this.cafe)
      this.cafe.quantite = 1
    },
    /**
     * Appelle l'action du store qui crée un versement
     */
    functionVersement () {
      this.effectuerVersement(this.versement)
    },
    /**
     * Réinitialise le formulaire de versement
     */
    resetFormVersement () {
      this.versement.montant = ''
      this.versement.libelle = ''
    },
    /**
     * Initialise le prix et le libellé du café
     */
    setConstant () {
      this.cafe.libelle = this.settings.find(val => val.nom === 'Libellé achat de café').valeur
      this.cafe.prix = this.settings.find(val => val.nom === 'Prix du café').valeur
    },
    /**
     * Initialise la météo
     */
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
  },
  computed: {
    ...mapGetters('userStore', ['getSolde', 'getSettings']),
    /**
     * Appelle le getter du store qui récupère le solde utilisateur
     * @returns {string} Retourne le solde utilisateur
     */
    userSolde () {
      return this.getSolde
    },
    /**
     * Appelle le getter du store qui récupère les paramètres (constantes) de l'application
     * @returns {string} Retourne les paramètres
     */
    settings () {
      return this.getSettings
    }
  },
  async mounted () {
    this.$q.dark.set(false) // Désactive le thème sombre
    this.setUpWeather()
    await this.getUserSolde()
    await this.getUserSettings()
    this.setConstant()
  }
}
</script>

<style scoped>
#solde {
  font-size: 2.5em;
}

#imgCafe {
  width: 90%;
  height: auto;
}
</style>
