<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="q-py-md">
      <q-toolbar>
        <q-btn round class="q-ml-md" to="/dashboard">
          <q-avatar size="65px" class=" shadow-7">
            <img src="~assets/avatar.jpg" alt="avatar">
          </q-avatar>
        </q-btn>
        <q-toolbar-title id="title" class="q-ml-xs desktop-only">Pause Café</q-toolbar-title>
        <p id="bienvenueMessage" class="q-mb-none q-mr-xl desktop-only">Bienvenue, {{ nom }} {{ prenom }} !</p>
        <q-btn round icon="person" class="q-ml-auto q-mr-lg header-icons">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            anchor="bottom right"
            self="top right"
            :offset="[0, 15]"
          >
            <q-list style="min-width: 200px">
              <q-item clickable v-close-popup  @click="confirm = true">
                <q-item-section avatar class="q-pr-none content-center">
                  <q-icon color="black" name="logout" />
                </q-item-section>
                <q-item-section>Se déconnecter</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-dialog v-model="confirm" >
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar class="desktop-only" icon="logout" color="primary" text-color="white" />
              <span class="q-ml-sm">Êtes-vous sûr de vouloir vous déconnecter ?</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Annuler" color="black" v-close-popup />
              <q-btn flat label="Se déconnecter" color="red" v-close-popup @click="removeTokenFromLocalStorage"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-btn :disable="this.$route.name === 'settings'" round :icon="this.$route.name === 'historique' ? 'dashboard' : 'history'" class="q-mr-lg header-icons" @click="historiqueButton"/>
        <q-btn v-if="is_admin" round :icon="this.$route.name === 'settings' ? 'dashboard' : 'settings'" class="q-mr-lg header-icons" @click="settingsButton"/>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      :width="$q.screen.width * 0.275"
      :breakpoint="500"
      overlay
      bordered
      class="bg-grey-1 inset-shadow"
      side="right"
    >
      <q-scroll-area class="fit q-px-lg">
        <div class="row">
          <div class="col-10">
            <h5>Historique</h5>
          </div>
          <div class="col-2 q-my-auto q-ml-auto">
            <q-btn round icon="clear" class="q-mr-md" @click="drawer = !drawer"></q-btn>
          </div>
        </div>
        <q-list v-if="this.getListeTransactions.historique">
          <HistoriqueComponent  v-for="transaction in this.getListeTransactions.historique" :key="transaction.id"
                                :id="transaction.id"
                                :montant="transaction.prix ? transaction.prix * transaction.quantite : transaction.montant"
                                :libelle="transaction.libelle"
                                :date="transaction.created_at"
                                :type="transaction.quantite ? 'Achat' : 'Versement'"
                                :quantite="transaction.quantite ? transaction.quantite : null"/>
        </q-list>
        <span v-else>
          {{ this.getListeTransactions.message }}
        </span>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import HistoriqueComponent from 'components/HistoriqueComponent'
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
  name: 'MainLayout',
  components: { HistoriqueComponent },
  data () {
    return {
      nom: '',
      prenom: '',
      is_admin: '', // Booléen qui vérifie si l'utilisateur est admin ou non
      confirm: false, // Variable qui s'occupe d'afficher ou non le menu utilisateur
      drawer: false // Variable qui s'occupe d'afficher ou non l'historique
    }
  },
  methods: {
    ...mapActions('userStore', ['getHistorique']),
    /**
     * Supprime les éléments du localStorage du navigateur
     */
    removeTokenFromLocalStorage () {
      window.localStorage.clear()
      this.$router.push({ path: '/login' })
    },
    /**
     * Récupération des éléments du localStorage du navigateur
     */
    getInfosFromLocalStorage () {
      // Récupération des informations stockées dans le local storage
      this.nom = localStorage.getItem('nom')
      this.prenom = localStorage.getItem('prenom')
      this.is_admin = localStorage.getItem('is_admin') !== 'false'
    },
    /**
     * Change la route du bouton historique en fonction du nom de la vue active
     */
    historiqueButton () {
      if (this.$q.platform.is.desktop) {
        this.drawer = !this.drawer
        if (this.$route.name === 'historique') {
          this.$router.push({ path: '/dashboard' })
        }
      } else {
        if (this.$route.name === 'historique') {
          this.$router.push({ path: '/dashboard' })
        } else {
          this.$router.push({ path: '/historique' })
        }
      }
    },
    /**
     * Change la route du bouton settings en fonction du nom de la vue active
     */
    settingsButton () {
      if (this.$route.name === 'settings') {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.push({ path: '/settings' })
      }
    }
  },
  computed: {
    ...mapGetters('userStore', ['getTransactions']),
    /**
     * Appelle le getter du store qui récupère les transactions réalisées par l'utilisateur
     * @returns {string} Retourne les transactions de l'utilisateur
     */
    getListeTransactions () {
      return this.getTransactions
    }
  },
  mounted () {
    this.getInfosFromLocalStorage()
    this.getHistorique()
  }
})
</script>

<style scoped>
#title {
  font-size: 2em;
}
#bienvenueMessage {
  font-size: 1.5em;
}
</style>
