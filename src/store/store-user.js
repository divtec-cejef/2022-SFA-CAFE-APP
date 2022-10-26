// State : données du magasin
import { api } from 'boot/axios'
import { Loading, Notify } from 'quasar'

const state = {
  listeTransactions: '', // Liste des transactions effectuées par l'utilisateur
  solde: '', // Solde de l'utilisateur
  formRegisterActive: false, // Etat du formulaire affiché (register, login)
  settings: '', // Paramètres (constantes) de l'application
  users: '' // Liste des utilisateurs de l'application
}

/*
Mutations : méthode qui manipulent les données
Les mutations ne peuvent pas être asynchrones !!!
 */
const mutations = {
  // Set les informations de l'utilisateur dans le localStorage
  SET_USER (state, user) {
    window.localStorage.setItem('token', user.token)
    window.localStorage.setItem('id', user.id)
    window.localStorage.setItem('nom', user.nom)
    window.localStorage.setItem('prenom', user.prenom)
    window.localStorage.setItem('is_admin', user.is_admin)
  },
  // Set la liste de transactions des achats et versements de l'utilisateur
  SET_LISTE_TRANSACTIONS (state, listeTransactions) {
    state.listeTransactions = listeTransactions
  },
  // Set le solde de l'utilisateur
  SET_SOLDE (state, solde) {
    state.solde = solde
  },
  // Set l'état du formulaire (Register, Login)
  CHANGE_FORM_LOGIN_STATE (state) {
    state.formRegisterActive = !state.formRegisterActive
  },
  // Set les paramètres (constantes) de l'application
  SET_SETTINGS (state, settings) {
    state.settings = settings
  },
  // Set la liste des utilisateurs de l'application
  SET_LIST_USERS (state, users) {
    state.users = users
  },
  // Set le token de connexion et l'id de l'utilisateur utilisé pour les requêtes
  SET_TOKEN_AND_ID () {
    config = { headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` } }
    id = window.localStorage.getItem('id')
  }
}

/*
Actions : méthodes du magasin qui font appel aux mutations
Elles peuvent être asynchrones !
 */

// Ajoute au Header le token utilisateur pour chaque action le nécessitant
let config = {
  headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
}
// Récupère l'ID utilisateur dans le localStorage du navigateur
let id = window.localStorage.getItem('id')

const actions = {
  /**
   * Crée un compte utilisateur
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   * @param payload Contient le Body de la requête
   */
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
  /**
   * Authentifie l'utilisateur, puis crée un token de connexion valide 15 jours
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   * @param payload Contient le Body de la requête
   */
  async loginUser ({ commit }, payload) {
    Loading.show()
    await api.post('utilisateur/login', payload)
      .then(async response => {
        Loading.hide()
        // Ajoute les informations utilisateur et les infos importantes dans le localStorage
        await commit('SET_USER', response.data.user)
        await commit('SET_TOKEN_AND_ID')
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
  /**
   * Achète un ou plusieurs cafés
   * @param dispatch Permet d'appeler d'autre fonctions dans le même store
   * @param payload Contient le Body de la requête
   */
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
  /**
   * Effectue un ou plusieurs versements
   * @param dispatch Permet d'appeler d'autre fonctions dans le même store
   * @param payload Contient le Body de la requête
   */
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
  /**
   * Supprime la transaction sélectionnée dans l'historique
   * @param dispatch Permet d'appeler d'autre fonctions dans le même store
   * @param transactionOptions Attributs de l'élément à supprimer
   */
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
  /**
   * Récupère l'historique de transactions de l'utilisateur
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   */
  async getHistorique ({ commit }) {
    await api.get('utilisateur/' + id + '/historique', config)
      .then(response => {
        commit('SET_LISTE_TRANSACTIONS', response.data)
      })
      .catch(async error => {
        if (error.response.status === 401) {
          if (error.response.data.error) {
            await Notify.create({
              color: 'red',
              message: error.response.data.error
            })
          }
          window.localStorage.clear()
          // Redirige vers le login
          this.$router.push({ path: '/login' })
        }
      })
  },
  /**
   * Récupère le solde de l'utilisateur
   * Si le token de connexion n'est plus valide le localStorage est vidé et l'utilisateur est invité à se reconnecter
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   */
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
  /**
   * Récupère les paramètres (constantes) de l'application
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   */
  async getUserSettings ({ commit }) {
    await api.get('settings', config)
      .then(response => {
        commit('SET_SETTINGS', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  /* ------------------------------------- Administrateur ------------------------------------- */
  /**
   * Récupère les paramètres (constantes) de l'application
   * [SI L'UTILISATEUR EST ADMIN] Envoie l'utilisateur sur la page admin
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   */
  async getAdminSettings ({ commit }) {
    await api.get('administrateur/settings', config)
      .then(response => {
        commit('SET_SETTINGS', response.data)
      })
      .catch(error => {
        this.$router.push({ path: '/dashboard' })
        Notify.create({
          message: error.response.data.error,
          color: 'red'
        })
      })
  },
  /**
   * Met à jour le paramètre modifié par un administrateur
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   * @param updatedSetting Contient les attributs de l'élément à mettre à jour
   */
  async updateSetting ({ commit }, updatedSetting) {
    await api.put('administrateur/settings/update', updatedSetting, config)
      .then(response => {
        Notify.create({
          message: response.data.message,
          color: 'green'
        })
      })
      .catch(error => {
        Notify.create({
          message: error.response.data.error,
          color: 'red'
        })
      })
  },
  /**
   * Récupération de tous les utilisateurs de l'application
   * @param commit Permet d'appeler une mutation pour mettre à jour le state
   */
  async getAllUsers ({ commit }) {
    await api.get('administrateur/utilisateurs', config)
      .then(response => {
        commit('SET_LIST_USERS', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  /**
   * Activation/Désactivation d'un compte utilisateur par un administrateur
   * @param dispatch Permet d'appeler d'autre fonctions dans le même store
   * @param idUser ID de l'utilisateur qui verra son compte se faire désactiver
   */
  disableAccount ({ dispatch }, idUser) {
    api.patch('administrateur/utilisateur/' + idUser + '/statut', '', config)
      .then(response => {
        Notify.create({
          color: 'green',
          message: response.data.message
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  /**
   * Suppression d'un compte utilisateur par un administrateur
   * @param dispatch Permet d'appeler d'autre fonctions dans le même store
   * @param idUser ID de l'utilisateur qui verra son compte se faire supprimer
   */
  deleteAccount ({ dispatch }, idUser) {
    api.delete('administrateur/utilisateur/' + idUser + '/delete', config)
      .then(response => {
        Notify.create({
          color: 'green',
          message: response.data.message
        })
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
  // Retourne les transactions
  getTransactions (state) {
    return state.listeTransactions
  },
  // Retourne le solde
  getSolde (state) {
    return state.solde
  },
  // Retourne l'état du formulaire (register, login)
  getFormRegisterState (state) {
    return state.formRegisterActive
  },
  // Retourne les paramètres (constantes) de l'application
  getSettings (state) {
    return state.settings
  },
  // Retourne la liste des utilisateurs de l'application
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
