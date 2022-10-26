<template>
  <q-table v-if="rows"
           title="Paramètres"
           :rows="rows"
           :columns="columns"
           row-key="id"
           hide-bottom
  >
    <template v-slot:body-cell-edit="props">
      <q-td :props="props">
        <q-btn dense flat round color="primary" field="edit" icon="edit" @click="editSetting(props.row)"></q-btn>
      </q-td>
      <q-dialog v-model="editDialog">
        <q-card style="width: 600px; max-width: 60vw">
          <q-card-section>
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
            <div class="text-h6">Modification d'un paramètre</div>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section class="q-pt-none">
            <q-form class="q-gutter-md">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">Paramètre</q-item-label>
                    <q-input disable dense outlined v-model="editedItem.nom" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">Valeur</q-item-label>
                    <q-input :type="isNaN(editedItem.valeur) ? 'text' : 'number'" dense outlined v-model="editedItem.valeur"
                             :rules="[
                                val => val !== null && val !== '' || 'Veuillez renseigner une valeur.'
                              ]"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-form>
          </q-card-section>
          <q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Annuler" v-close-popup/>
              <q-btn flat label="Enregistrer" color="green" v-close-popup @click="editedItem.valeur !== props.row.valeur ? saveUpdatedSetting(editedItem) : ''"/>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </q-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SettingsTableComponent',
  data () {
    return {
      editDialog: false, // Variable qui s'occupe d'afficher ou non la pop-up de l'édition d'un enregistrement
      editedItem: '', // Objet affecté par l'enregistrement en cours de modification
      rows: '', // Lignes du tableau généré
      columns: [ // Colonnes du tableau généré
        { name: 'setting', label: 'Description', require: true, field: row => row.nom, sortable: true, align: 'left', headerStyle: 'font-weight: bold' },
        { name: 'valeur', label: 'Valeur', require: true, field: row => row.valeur, align: 'left', headerStyle: 'font-weight: bold' },
        { name: 'edit', label: 'Actions', require: true, field: row => row.edit, align: 'center', headerStyle: 'font-weight: bold' }
      ]
    }
  },
  methods: {
    ...mapActions('userStore', ['getAdminSettings', 'updateSetting']),
    /**
     * Ouvre la pop-up d'édition et affecte l'enregistrement sélectionné à la variable editedItem
     * @param setting paramètre sélectionné à être éditer
     */
    editSetting (setting) {
      this.editDialog = true
      this.editedItem = Object.assign({}, setting)
    },
    /**
     * Appelle l'action de mise à jour d'un paramètre de l'application
     * Rappelle la liste des paramètres pour mettre à jour la liste affichée
     * @param updatedSetting Paramètre mis à jour
     */
    async saveUpdatedSetting (updatedSetting) {
      await this.updateSetting(updatedSetting)
      await this.getSettingsList()
    },
    /**
     * Appelle l'action qui récupère la liste des paramètres de l'application
     * Affecte les lignes du tableau avec un clône en profondeur (complet) d'un state du store
     * @returns {Promise<void>}
     */
    async getSettingsList () {
      await this.getAdminSettings()
      this.rows = structuredClone(this.settings)
    }

  },
  computed: {
    ...mapGetters('userStore', ['getSettings']),
    /**
     * Appelle le getter du store qui récupère les paramètres de l'application
     * @returns {string} Retourne les paramètres de l'application
     */
    settings () {
      return this.getSettings
    }
  },
  mounted () {
    this.getSettingsList()
  }
}
</script>

<style scoped>

</style>
