<template>
  <q-table v-if="rows"
           title="Utilisateurs"
           :rows="rows"
           :columns="columns"
           row-key="nom"
           :filter="filter"
           binary-state-sort
           :pagination="pagination"
  >
    <template v-if="this.$q.platform.is.desktop" v-slot:top-right>
      <q-input
        outlined
        dense
        debounce="300"
        v-model="filter"
        placeholder="Rechercher"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-solde="props">
      <q-td :props="props">
        <div>
          <span :class="props.row.solde < 0 ? 'text-red-10' : 'text-green-7'">{{ props.row.solde.toFixed(2) }}</span> CHF
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-actif="props">
      <q-td :props="props">
        <q-toggle v-model="props.row.actif" color="green" @click="updateStateUser(props.row.id)"/>
      </q-td>
    </template>
    <template v-slot:body-cell-admin="props">
      <q-td :props="props">
        <q-icon :color="props.row.admin ? 'green' : 'red'" :name="props.row.admin ? 'check_circle' : 'cancel'" size="30px"/>
      </q-td>
    </template>
    <template v-slot:body-cell-delete="props">
      <q-td :props="props">
        <q-btn v-if="!props.row.admin" color="red" label="Supprimer" no-caps @click="confirm = true"/>
        <q-dialog v-model="confirm" >
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar class="desktop-only" icon="delete" color="primary" text-color="white" />
              <span class="q-ml-sm">Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                  <br>
                  <strong>PS : Cette action est irréversible.</strong>
                  </span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Annuler" color="black" v-close-popup />
              <q-btn flat label="Supprimer" color="red" v-close-popup @click="deleteUser(props.row.id)"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'
import { ref } from 'vue'

export default {
  name: 'UserTableComponent',
  data () {
    return {
      pagination: {
        rowsPerPage: 10 // utilisateurs affichées par page
      },
      filter: ref(''), // Filtre de recherche
      confirm: false, // Variable qui s'occupe d'afficher ou non la pop-up de confirmation de suppression
      rows: '', // Lignes du tableau généré
      columns: '' // Colonnes du tableau généré
    }
  },
  methods: {
    ...mapActions('userStore', ['getAllUsers', 'disableAccount', 'deleteAccount']),
    /**
     * Appelle l'action du store qui permet d'activer/désactiver un compte
     * @param id id de l'utilisateur
     */
    updateStateUser (id) {
      if (id === parseInt(localStorage.getItem('id'))) {
        Notify.create({
          color: 'red',
          message: 'Vous ne pouvez pas désactiver votre compte.'
        })
      } else {
        this.disableAccount(id) // Active/Désactive le compte
        this.$store.commit('userStore/SET_LIST_USERS', this.rows) // Réaffecte les utilisateurs au store
      }
      this.rows = structuredClone(this.listUsers) // Rappelle le store pour mettre les enregistrements à jour
    },
    /**
     * Appelle l'action du store qui permet de supprimer un utilisateur
     * @param id id de l'utilisateur
     */
    deleteUser (id) {
      this.deleteAccount(id)
      this.getUserList()
    },
    /**
     * Appelle l'action du store qui s'occupe de récupérer tous les utilisateurs
     */
    async getUserList () {
      await this.getAllUsers()
      this.rows = structuredClone(this.listUsers)
    },
    /**
     * Génère les colonnes du tableau en fonction de l'appareil utilisé (pc ou mobile)
     */
    setColumns () {
      if (this.$q.platform.is.desktop) {
        this.columns = [
          { name: 'name', label: 'Nom', require: true, field: row => row.nom, sortable: true, align: 'left', headerStyle: 'font-weight: bold' },
          { name: 'prenom', label: 'Prénom', require: true, field: row => row.prenom, sortable: true, align: 'left', headerStyle: 'font-weight: bold' },
          { name: 'email', label: 'E-mail', require: true, field: row => row.email, align: 'left', headerStyle: 'font-weight: bold' },
          { name: 'solde', label: 'Solde', require: true, field: row => row.solde, sortable: true, align: 'center', headerStyle: 'font-weight: bold' },
          { name: 'actif', label: 'Activité', require: true, field: row => row.actif, align: 'center', headerStyle: 'font-weight: bold' },
          { name: 'admin', label: 'Administrateur', require: true, field: row => row.admin, sortable: true, align: 'center', headerStyle: 'font-weight: bold' },
          { name: 'delete', label: 'Action', require: true, field: '', align: 'center', headerStyle: 'font-weight: bold' }
        ]
      } else {
        this.columns = [
          { name: 'name', label: 'Nom', require: true, field: row => row.nom, sortable: true, align: 'left', headerStyle: 'font-weight: bold' },
          { name: 'prenom', label: 'Prénom', require: true, field: row => row.prenom, sortable: true, align: 'left', headerStyle: 'font-weight: bold' },
          { name: 'solde', label: 'Solde', require: true, field: row => row.solde, sortable: true, align: 'center', headerStyle: 'font-weight: bold' },
          { name: 'actif', label: 'Activité', require: true, field: row => row.actif, align: 'center', headerStyle: 'font-weight: bold' },
          { name: 'delete', label: 'Action', require: true, field: '', align: 'center', headerStyle: 'font-weight: bold' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('userStore', ['getListUsers']),
    /**
     * Appelle le getter du store qui récupère les utilisateurs de l'application
     * @returns {string} Retourne les utilisateurs de l'application
     */
    listUsers () {
      return this.getListUsers
    }
  },
  mounted () {
    this.getUserList()
    this.setColumns()
  }
}
</script>

<style scoped>

</style>
