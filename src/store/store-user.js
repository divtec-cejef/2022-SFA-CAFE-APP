// State : données du magasin
import { api } from 'boot/axios'
import { Loading, Notify } from 'quasar'

const state = {
  listeTransactions: '',
  solde: '',
  formRegisterActive: false,
  settings: '',
  users: ''
}

/*
Mutations : méthode qui manipulent les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  SET_USER (state, user) {
    window.localStorage.setItem('token', user.token)
    window.localStorage.setItem('id', user.id)
    window.localStorage.setItem('nom', user.nom)
    window.localStorage.setItem('prenom', user.prenom)
    window.localStorage.setItem('is_admin', user.is_admin)
  },
  SET_LISTE_TRANSACTIONS (state, listeTransactions) {
    state.listeTransactions = listeTransactions
  },
  SET_SOLDE (state, solde) {
    state.solde = solde
  },
  CHANGE_FORM_LOGIN_STATE (state) {
    state.formRegisterActive = !state.formRegisterActive
  },
  SET_SETTINGS (state, settings) {
    state.settings = settings
  },
  SET_LIST_USERS (state, users) {
    state.users = users
  }
}

/*
Actions : méthodes du magasin qui font appel aux mutations
Elles peuvent être asynchrones !
 */

// Ajoute au Header le token utilisateur pour chaque action le nécessitant
const config = {
  headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
}
// Récupère l'ID utilisateur dans le localStorage du navigateur
const id = window.localStorage.getItem('id')

const actions = {
  async registerUser ({ commit }, payload) {
    Loading.show()
    await api.post('utilisateur/register', payload)
      .then(response => {
        Loading.hide()
        commit('CHANGE_FORM_LOGIN_STATE')
        Notify.create({
          color: 'green',
          message: response.data.message
        })
      })
      .catch(error => {
        Loading.hide()
        Notify.create({
          color: 'red',
          message: error.response.data.error
        })
      })
  },
  async loginUser ({ commit }, payload) {
    Loading.show()
    await api.post('utilisateur/login', payload)
      .then(response => {
        Loading.hide()
        // Ajoute les informations utilisateur et les infos importantes dans le localStorage
        commit('SET_USER', response.data.user)
        // Redirige vers le Dashboard
        this.$router.push({ path: '/dashboard' })
      })
      .catch(error => {
        Loading.hide()
        Notify.create({
          color: 'red',
          message: error.response.data.error
        })
      })
  },
  achatCafe ({ dispatch }, payload) {
    Loading.show()
    api.post('utilisateur/' + id + '/achat', payload, config)
      .then(async response => {
        await dispatch('getHistorique')
        await dispatch('getUserSolde')
        Notify.create({
          color: 'green',
          message: response.data.message
        })
      })
      .catch(error => {
        console.log(error)
        Loading.hide()
      })
  },
  effectuerVersement ({ dispatch }, payload) {
    Loading.show()
    api.post('utilisateur/' + id + '/versement', payload, config)
      .then(async response => {
        await dispatch('getHistorique')
        await dispatch('getUserSolde')
        Notify.create({
          color: 'green',
          message: response.data.message
        })
      })
      .catch(error => {
        console.log(error)
        Loading.hide()
      })
  },
  async supprimerTransaction ({ dispatch }, transactionOptions) {
    console.log(transactionOptions.type)
    const type = transactionOptions.type === 'Achat' ? 'achat/' : 'versement/'
    await api.delete('delete/' + type + transactionOptions.id, config)
      .then(async response => {
        await dispatch('getHistorique')
        await dispatch('getUserSolde')
        Notify.create({
          color: 'green',
          message: response.data.message
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  async getHistorique ({ commit }) {
    await api.get('utilisateur/' + id + '/historique', config)
      .then(response => {
        commit('SET_LISTE_TRANSACTIONS', response.data)
      })
      .catch(error => {
        console.log(error)
        return error
      })
  },
  async getUserSolde ({ commit }) {
    Loading.show()
    await api.get('utilisateur/' + id + '/solde', config)
      .then(response => {
        Loading.hide()
        commit('SET_SOLDE', response.data.solde.toFixed(2))
      })
      .catch(error => {
        Loading.hide()
        if (error.response.status === 401) {
          window.localStorage.clear()
          // Redirige vers le login
          this.$router.push({ path: '/login' })
        }
      })
  },
  getAdminSettings ({ commit }) {
    api.get('administrateur/config', config)
      .then(response => {
        commit('SET_SETTINGS', response.data)
        this.$router.push({ path: '/settings' })
      })
      .catch(error => {
        this.$router.push({ path: '/dashboard' })
        Notify.create({
          message: error.response.data.error,
          color: 'red'
        })
      })
  },
  async getAllUsers ({ commit }) {
    await api.get('administrateur/utilisateurs', config)
      .then(response => {
        commit('SET_LIST_USERS', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }
}

/*
Getters : retourne les données du magasin
Fonctionne comme les propriétés calculées
Sert à calculer, trier, filtrer ou formater les donneés
 */
const getters = {
  getTransactions (state) {
    return state.listeTransactions
  },
  getSolde (state) {
    return state.solde
  },
  getFormRegisterState (state) {
    return state.formRegisterActive
  },
  getSettings (state) {
    return state.settings
  },
  getListUsers (state) {
    return state.users
  }
}

/*
Exporte les constantes, variables du fichier
On pourra ainsi les récupérer, les importer dans un autre fichier JS.

namespace: true, ajoute un namespace à notre objet retourné.
 */
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
