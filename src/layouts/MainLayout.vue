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
      :width="200"
      :breakpoint="500"
      overlay
      bordered
      class="bg-grey-3 inset-shadow"
      side="right"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in listeTransactions" :key="index">
            <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
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
      drawer: ref(false)
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
