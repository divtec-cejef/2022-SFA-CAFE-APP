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
    /**
     * Appelle le getter du store qui récupère les transactions réalisées par l'utilisateur
     * @returns {string} Retourne les transactions réalisées par l'utilisateur
     */
    getListeTransactions () {
      return this.getTransactions
    }
  },
  mounted () {
    this.getHistorique() // Appelle l'action du store pour récupérer toutes les transactions de l'utilisateur
  }
}
</script>

<style scoped>

</style>
