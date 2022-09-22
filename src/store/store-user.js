// State : données du magasin
import { api } from 'boot/axios'
import { Loading } from 'quasar'

const state = {
  listeTransactions: '',
  solde: '',
  notification: {
    message: '',
    color: ''
  }
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
  },
  SET_LISTE_TRANSACTIONS (state, listeTransactions) {
    state.listeTransactions = listeTransactions
  },
  SET_SOLDE (state, solde) {
    state.solde = solde
  },
  SET_NOTIFICATION (state, notification) {
    state.notification.message = notification.message
    state.notification.color = notification.color
  },
  RESET_NOTIFICATION (state) {
    state.notification.message = ''
    state.notification.color = ''
  }
}

/*
Actions : méthodes du magasin qui font appel aux mutations
Elles peuvent être asynchrones !
 */
const actions = {
  async registerUser ({ commit }, payload) {
    let data = ''
    Loading.show()
    await api.post('api/utilisateur/register', payload)
      .then(response => {
        Loading.hide()
        data = {
          color: 'green',
          message: response.data.Message
        }
        commit('SET_NOTIFICATION', data)
      })
      .catch(error => {
        Loading.hide()
        data = {
          color: 'red',
          message: error.response.data.error
        }
        commit('SET_NOTIFICATION', data)
      })
  },
  async loginUser ({ commit }, payload) {
    Loading.show()
    await api.post('api/utilisateur/login', payload)
      .then(response => {
        Loading.hide()
        // Ajoute les informations utilisateur et les infos importantes dans le localStorage
        commit('SET_USER', response.data.user)
        // Redirige vers le Dashboard
        this.$router.push({ path: '/dashboard' })
      })
      .catch(error => {
        Loading.hide()
        const data = {
          color: 'red',
          message: error.response.data.error
        }
        commit('SET_NOTIFICATION', data)
      })
  },
  achatCafe ({ commit }, payload) {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    const id = window.localStorage.getItem('id')
    api.post('api/utilisateur/' + id + '/achat', payload, config)
      .then(response => {
        const data = {
          color: 'green',
          message: response.data.Message
        }
        commit('SET_NOTIFICATION', data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  async supprimerTransaction ({ commit }, transactionOptions) {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    let url = 'api/delete/'
    console.log(transactionOptions.id)
    console.log(transactionOptions.type)
    url += transactionOptions.type === 'Achat' ? 'achat/' : 'versement/'
    await api.delete(url + transactionOptions.id, config)
      .then(response => {
        const data = {
          color: 'green',
          message: response.data.Message
        }
        commit('SET_NOTIFICATION', data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  effectuerVersement ({ commit }, payload) {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    const id = window.localStorage.getItem('id')
    api.post('api/utilisateur/' + id + '/versement', payload, config)
      .then(response => {
        const data = {
          color: 'green',
          message: response.data.Message
        }
        commit('SET_NOTIFICATION', data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  getHistorique ({ commit }) {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    const id = window.localStorage.getItem('id')
    api.get('api/utilisateur/' + id + '/historique', config)
      .then(response => {
        commit('SET_LISTE_TRANSACTIONS', response.data.Historique)
      })
      .catch(error => {
        console.log(error)
        return error
      })
  },
  async getUserSolde ({ commit }) {
    Loading.show()
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    const id = window.localStorage.getItem('id')
    await api.get('api/utilisateur/' + id + '/solde', config)
      .then(response => {
        Loading.hide()
        commit('SET_SOLDE', response.data.Solde.toFixed(2))
      })
      .catch(error => {
        Loading.hide()
        if (error.response.status === 401) {
          window.localStorage.clear()
          // Redirige vers le login
          this.$router.push({ path: '/login' })
        }
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
  getNotification (state) {
    return {
      message: state.notification.message,
      color: state.notification.color
    }
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
