<template>
  <q-card class="my-card q-mx-xs q-mb-md" flat bordered>
    <q-card-section horizontal class="q-ml-sm">
      <q-card-section class="q-pt-sm q-pb-md col-10">
        <div class="text-overline">{{ type }} | {{ date }}</div>

        <q-card-section horizontal>
          <q-card-section class="q-py-xs q-px-none col-7">
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
        <q-btn flat round color="red" icon="delete" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'HistoriqueComponent',
  props: {
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
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
