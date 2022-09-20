// State : données du magasin
import { api } from 'boot/axios'
import { Loading } from 'quasar'

const state = {
  user: {
    id: '',
    nom: '',
    prenom: '',
    token: null
  },
  listeTransactions: '',
  solde: ''
}

/*
Mutations : méthode qui manipulent les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  SET_USER (state, user) {
  },
  SET_LISTE_TRANSACTIONS (state, listeTransactions) {
    state.listeTransactions = listeTransactions
  },
  SET_SOLDE (state, solde) {
    state.solde = solde
  }
}

/*
Actions : méthodes du magasin qui font appel aux mutations
Elles peuvent être asynchrones !
 */
const actions = {
  loginUser ({ commit }, payload) {
    Loading.show()
    api.post('api/utilisateur/login', payload)
      .then(response => {
        Loading.hide()

        // Ajout à VueX des informations utilisateur
        state.user.token = response.data.user.token
        state.user.id = response.data.user.id
        state.user.nom = response.data.user.nom
        state.user.prenom = response.data.user.prenom

        // Ajoute le token dans le header
        // axios.defaults.headers.common.Authorization = 'Bearer ' + response.data.token

        // Ajoute le token et les infos importantes dans le localStorage
        window.localStorage.setItem('token', state.user.token)
        window.localStorage.setItem('id', state.user.id)
        window.localStorage.setItem('nom', state.user.nom)
        window.localStorage.setItem('prenom', state.user.prenom)

        // Redirige vers le Dashboard
        this.$router.push({ path: '/dashboard' })
      })
      .catch(error => {
        console.log(error)
        Loading.hide()
      })
  },
  achatCafe ({ commit }, payload) {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    const id = window.localStorage.getItem('id')
    api.post('api/utilisateur/' + id + '/achat', payload, config)
      .then(response => {
      })
      .catch(error => {
        console.log(error)
        // if (error.response.status === 401) {
        //   window.localStorage.clear()
        //   // Redirige vers le login
        //   this.$router.push({ path: '/login' })
        // }
      })
  },
  effectuerVersement ({ commit }, payload) {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    const id = window.localStorage.getItem('id')
    api.post('api/utilisateur/' + id + '/versement', payload, config)
      .then(response => {
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
  getUserSolde ({ commit }) {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    }
    const id = window.localStorage.getItem('id')
    api.get('api/utilisateur/' + id + '/solde', config)
      .then(response => {
        commit('SET_SOLDE', response.data.Solde.toFixed(2))
      })
      .catch(error => {
        console.log(error)
        return error
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
