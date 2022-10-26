<template>
  <q-card class="my-card q-mx-xs q-mb-md" flat bordered>
    <q-card-section v-if="!this.$q.platform.is.mobile" horizontal class="'q-ml-sm'">
      <q-card-section class="q-pt-sm col-10 q-pb-md">
        <div class="text-overline">{{ type }} | {{ date }}</div>

        <q-card-section horizontal >
          <q-card-section :class="quantite ? 'col-7' : 'col-12'" class="q-py-xs q-px-none">
            <div class="q-mt-sm q-mb-xs">{{ libelle }}</div>
            <div class="q-mt-sm">Prix : <span :class="quantite ? 'text-red-10' : 'text-green-7'">{{ montant.toFixed(2) }} CHF</span></div>
          </q-card-section>
          <q-card-section class="q-pt-xs col-5 desktop-only" v-if="quantite">
            <div class="q-mt-sm text-">Quantité : <span>{{ quantite }}</span></div>
          </q-card-section>
        </q-card-section>
      </q-card-section>
      <q-separator vertical />
      <q-card-actions vertical class="justify-around q-px-none col-2">
        <q-btn flat round color="red" class="q-pa-none" icon="delete" @click="confirm = true"/>
        <q-dialog v-model="confirm">
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar class="desktop-only" icon="delete" color="primary" text-color="white" />
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

    <q-card-section v-else class="q-py-xs">
        <q-card-section horizontal>
          <q-card-section id="titre" class="col-10 q-pa-none">
            <div class="text-overline q-my-xs">{{ type }} | {{ date }}</div>
          </q-card-section>
          <q-card-section id="delete" class="col-2 q-pa-none">
            <q-btn flat round color="red" class="float-right" icon="delete" @click="confirm = true"/>
            <q-dialog v-model="confirm">
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar class="desktop-only" icon="delete" color="primary" text-color="white" />
                  <span class="q-ml-sm">Êtes-vous sûr de vouloir supprimer cette transaction ?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Annuler" color="black" v-close-popup />
                  <q-btn flat label="Supprimer" color="red" v-close-popup @click="removeTransaction"/>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-card-section>
        </q-card-section>

        <q-card-section horizontal>
          <q-card-section id="libelle" class="col-7 q-pa-none">
            <div class="q-mt-sm q-mb-xs"><span v-if="quantite">{{ quantite }} x </span>{{ libelle }}</div>
          </q-card-section>
          <q-card-section id="prix" class="col-5 q-pa-none">
            <div class="q-mt-sm float-right">Prix : <span :class="quantite ? 'text-red-10' : 'text-green-7'">{{ montant.toFixed(2) }} CHF</span></div>
          </q-card-section>
        </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'HistoriqueComponent',
  data () {
    return {
      confirm: false // Variable qui s'occupe d'afficher ou non la pop-up de confirmation de suppression
    }
  },
  props: {
    id: { // ID de la transaction
      type: Number,
      required: true
    },
    type: { // Type de la transaction : Achat ou Versement
      type: String,
      required: true
    },
    date: { // Date de réalisation de la transaction
      type: String,
      required: true
    },
    libelle: { // Libellé de la transaction
      type: String,
      required: true
    },
    montant: { // Montant ou prix de la transaction
      type: Number,
      required: true
    },
    quantite: Number // Si la transaction est un achat, il s'agit de la quantité d'achat du produit
  },
  methods: {
    ...mapActions('userStore', ['supprimerTransaction']),
    /**
     * Appelle l'action de suppression d'une transaction du store
     */
    async removeTransaction () {
      await this.supprimerTransaction({ id: this.id, type: this.type })
    }
  }
}
</script>

<style scoped>

</style>
