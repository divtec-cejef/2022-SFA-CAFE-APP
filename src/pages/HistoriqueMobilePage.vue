<template>
  <div class="q-mx-lg">
    <h5 class="q-mb-lg">Historique</h5>
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
  </div>
</template>

<script>
import HistoriqueComponent from 'components/HistoriqueComponent'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'HistoriqueMobilePage',
  components: { HistoriqueComponent },
  methods: {
    ...mapActions('userStore', ['getHistorique'])
  },
  computed: {
    ...mapGetters('userStore', ['getTransactions']),
    getListeTransactions () {
      return this.getTransactions
    }
  },
  mounted () {
    this.getHistorique()
  }
}
</script>

<style scoped>

</style>
