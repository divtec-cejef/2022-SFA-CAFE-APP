<template>
  <q-card class="my-card q-mx-xs q-mb-md" flat bordered>
    <q-card-section horizontal class="q-ml-sm">
      <q-card-section class="q-pt-sm q-pb-md col-10">
        <div class="text-overline">{{ type }} | {{ date }}</div>

        <q-card-section horizontal>
          <q-card-section :class="quantite ? 'col-7' : 'col-12'" class="q-py-xs q-px-none">
            <div class="q-mt-sm q-mb-xs">{{ libelle }}</div>
            <div class="q-mt-sm">Prix : <span :class="quantite ? 'text-red-10' : 'text-green-7'">{{ montant.toFixed(2) }} CHF</span></div>
          </q-card-section>

          <q-card-section class="q-pt-xs col-5" v-if="quantite">
            <div class="q-mt-sm text-">Quantité : <span>{{ quantite }}</span></div>
          </q-card-section>
        </q-card-section>
      </q-card-section>

      <q-separator vertical />

      <q-card-actions vertical class="justify-around q-px-md col-2">
        <q-btn flat round color="red" icon="delete" @click="confirm = true"/>
        <q-dialog v-model="confirm" >
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar icon="delete" color="primary" text-color="white" />
              <span class="q-ml-sm">Êtes-vous sûr de vouloir supprimer cette transaction ?</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Annuler" color="black" v-close-popup />
              <q-btn flat label="Supprimer" color="red" v-close-popup @click="removeTransaction"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { useQuasar } from 'quasar'

export default {
  name: 'HistoriqueComponent',
  data () {
    return {
      confirm: false
    }
  },
  setup () {
    const $q = useQuasar()
    return {
      showNotif () {
        $q.notify({
          message: this.setNotification.message,
          color: this.setNotification.color
        })
      }
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    libelle: {
      type: String,
      required: true
    },
    montant: {
      type: Number,
      required: true
    },
    quantite: Number
  },
  methods: {
    ...mapActions('userStore', ['supprimerTransaction', 'getHistorique', 'getUserSolde']),
    async removeTransaction () {
      await this.supprimerTransaction({ id: this.id, type: this.type })
      this.getHistorique()
      await this.getUserSolde()
      this.showNotif()
    }
  },
  computed: {
    ...mapGetters('userStore', ['getNotification']),
    setNotification () {
      return this.getNotification
    }
  }
}
</script>

<style scoped>

</style>
