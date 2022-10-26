<template>
  <div class="row">
    <div :class="this.$q.platform.is.desktop ? 'col-5 q-py-lg q-pl-lg q-pr-md' : 'col-12 q-pa-md'">
      <SettingsTableComponent/>
    </div>
    <div :class="this.$q.platform.is.desktop ? 'col-7 q-py-lg q-pr-lg  q-pl-md' : 'col-12 q-pa-md'">
      <UserTableComponent/>
    </div>
  </div>
</template>

<script>
import UserTableComponent from 'components/UserTableComponent'
import SettingsTableComponent from 'components/SettingsTableComponent'

export default {
  name: 'AdminPage',
  components: { UserTableComponent, SettingsTableComponent }
}
</script>

<style scoped>

</style>
