<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="q-py-md">
      <q-toolbar>
        <q-avatar size="60px" class=" shadow-7 q-ml-md">
          <img src="~assets/avatar.jpg" alt="avatar">
        </q-avatar>
        <q-toolbar-title id="title" class="q-ml-xs desktop-only">Pause Café</q-toolbar-title>
        <p id="bienvenueMessage" class="q-mb-none q-mr-xl desktop-only">Bienvenue, {{ nom }} {{ prenom }} !</p>
        <q-btn round icon="person" class="q-ml-auto q-mr-lg header-icons">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
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
        <q-btn round :icon="this.$route.name === 'historique' ? 'dashboard' : 'history'" class="q-mr-lg header-icons" @click="historiqueButton">
          <q-tooltip class="bg-accent desktop-only">Afficher l'historique</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      :width="500"
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
          <div class="col-auto q-my-auto q-ml-auto">
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
      confirm: false,
      drawer: false
    }
  },
  methods: {
    ...mapActions('userStore', ['getHistorique']),
    removeTokenFromLocalStorage () {
      window.localStorage.clear()
      this.$router.push({ path: '/login' })
    },
    getInfosFromLocalStorage () {
      // Récupération des informations stockées dans le local storage
      this.nom = localStorage.getItem('nom')
      this.prenom = localStorage.getItem('prenom')
    },
    historiqueButton () {
      if (this.$q.platform.is.desktop) {
        this.drawer = !this.drawer
      } else {
        if (this.$route.name === 'historique') {
          this.$router.push({ path: '/dashboard' })
        } else {
          this.$router.push({ path: '/historique' })
        }
      }
    }
  },
  computed: {
    ...mapGetters('userStore', ['getTransactions']),
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
