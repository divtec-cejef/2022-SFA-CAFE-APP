<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="q-py-md">
      <q-toolbar>
        <q-avatar size="60px" class=" shadow-7 q-ml-md">
          <img src="~assets/avatar.jpg" alt="avatar">
        </q-avatar>
        <q-toolbar-title id="title" class="q-ml-xs">
          Pause Café
        </q-toolbar-title>

        <p id="bienvenueMessage" class="q-mb-none q-mr-xl">Bienvenue, {{ nom }} {{ prenom }} !</p>
        <q-btn round icon="person" class="q-mx-lg header-icons">
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
              <q-avatar icon="logout" color="primary" text-color="white" />
              <span class="q-ml-sm">Êtes-vous sûr de vouloir vous déconnecter ?</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Annuler" color="black" v-close-popup />
              <q-btn flat label="Se déconnecter" color="red" v-close-popup @click="removeTokenFromLocalStorage"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-btn round icon="history" class="q-mr-lg header-icons" @click="drawer = !drawer">
          <q-tooltip class="bg-accent">Afficher l'historique</q-tooltip>
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
        <q-list>
          <q-card class="my-card q-mx-xs q-mb-md" flat bordered>
            <q-card-section horizontal class="q-ml-sm">
              <q-card-section class="q-pt-sm q-pb-md col-10">
                <div class="text-overline">Achat | 16.09.2022 15:08</div>

                <q-card-section horizontal>
                  <q-card-section class="q-py-xs q-px-none col-7">
                    <div class="q-mt-sm q-mb-xs">Achat de café</div>
                    <div class="q-mt-sm">Prix : <span class="text-red-10">4 CHF</span></div>
                  </q-card-section>

                  <q-card-section class="q-pt-xs col-3">
                      <div class="q-mt-sm text-">Quantité : <span class="">4</span></div>
                  </q-card-section>
                </q-card-section>
              </q-card-section>

              <q-separator vertical />

              <q-card-actions vertical class="justify-around q-px-md col-2">
                <q-btn flat round color="red" icon="delete" />
              </q-card-actions>
            </q-card-section>
          </q-card>
          <q-card class="my-card q-ma-xs" flat bordered>
            <q-card-section horizontal class="q-ml-sm">
              <q-card-section class="q-pt-sm q-pb-md col-10">
                <div class="text-overline">Versement | 16.09.2022 14:43</div>

                <q-card-section horizontal>
                  <q-card-section class="q-py-xs q-px-none col-7">
                    <div class="q-mt-sm q-mb-xs">Achat de touillettes</div>
                    <div class="q-mt-sm">Montant : <span class="text-green-10">20 CHF</span></div>
                  </q-card-section>
                </q-card-section>
              </q-card-section>

              <q-separator vertical />

              <q-card-actions vertical class="justify-around q-px-md col-2">
                <q-btn flat round color="red" icon="delete" />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      token: '',
      nom: '',
      prenom: '',
      listeTransactions: ''
    }
  },
  setup () {
    return {
      confirm: ref(false),
      drawer: ref(true)
    }
  },
  methods: {
    removeTokenFromLocalStorage () {
      window.localStorage.clear()
      this.$router.push({ path: '/login' })
    },
    getInfosFromLocalStorage () {
      // Récupération des informations stockées dans le local storage
      this.nom = localStorage.getItem('nom')
      this.prenom = localStorage.getItem('prenom')
    }
  },
  mounted () {
    this.getInfosFromLocalStorage()
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
