<template>
  <div class="row">
    <div class="col-5" style="border: solid 1px #FF9F1C; border-radius: 5px">
      <span>{{settings}}</span>
    </div>
    <div class="col-7" style="border: solid 1px #FF9F1C; border-radius: 5px">
      <q-table v-if="rows"
               title="Utilisateurs"
               :rows="rows"
               :columns="columns"
               row-key="nom"
               :filter="filter"
               binary-state-sort
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Rechercher">
            <template v-slot:append>
              <q-icon name="search"/>
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
            <q-toggle v-model="props.row.actif" color="green"/>
          </q-td>
        </template>
        <template v-slot:body-cell-admin="props">
          <q-td :props="props">
            <q-icon :color="props.row.admin ? 'green' : 'red'" :name="props.row.admin ? 'check_circle' : 'cancel'" size="30px"/>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'AdminPage',
  data () {
    return {
      filter: ref(''),
      columns: [
        { name: 'name', label: 'Nom', require: true, field: row => row.nom, sortable: true, align: 'left', headerStyle: 'font-weight: bold' },
        { name: 'prenom', label: 'Prénom', require: true, field: row => row.prenom, sortable: true, align: 'left', headerStyle: 'font-weight: bold' },
        { name: 'email', label: 'E-mail', require: true, field: row => row.email, align: 'left', headerStyle: 'font-weight: bold' },
        { name: 'solde', label: 'Solde', require: true, field: row => row.solde, headerStyle: 'font-weight: bold' },
        { name: 'actif', label: 'Activité', require: true, field: row => row.actif, headerStyle: 'font-weight: bold' },
        { name: 'admin', label: 'Administrateur', require: true, field: row => row.admin, headerStyle: 'font-weight: bold' }
      ],
      rows: ''
    }
  },
  methods: {
    ...mapActions('userStore', ['getAdminSettings', 'getAllUsers'])
  },
  computed: {
    ...mapGetters('userStore', ['getSettings', 'getListUsers']),
    selection: {
      get () { return this.getListUsers },
      set (val) { this.$store.commit('distributionsEnseignant/SET_SEL_FOUR', val) }
    },
    // listUddsers () {
    //   return this.getListUsers
    // },
    settings () {
      return this.getSettings
    }
  },
  async mounted () {
    await this.getAllUsers()
    this.getAdminSettings()
    this.rows = this.listUsers
  }

}
</script>

<style scoped>

</style>
