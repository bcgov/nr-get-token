<template>
  <v-container class="pl-0">
    <v-progress-linear v-if="configSubmissionInProgress" :indeterminate="true"></v-progress-linear>
    <v-alert
      :value="configSubmissionSuccess != ''"
      tile
      icon="check"
      type="success"
      transition="scale-transition"
    >{{configSubmissionSuccess}}</v-alert>
    <v-alert
      :value="configSubmissionError != ''"
      tile
      type="error"
      transition="scale-transition"
    >{{configSubmissionError}}</v-alert>
    <v-row no-gutters>
      <v-col cols="12" lg="8" xl="6">
        <ConfigForm />
      </v-col>
      <v-col cols="12" lg="4" xl="5" offset-xl="1">
        <ConfigGeneratedJson />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ConfigForm from '@/components/webadeAccess/ConfigForm.vue';
import ConfigGeneratedJson from '@/components/webadeAccess/ConfigGeneratedJson.vue';
import webadeAccess from '@/store/modules/webadeAccess';

export default {
  name: 'WebadeAccess',
  components: {
    ConfigForm,
    ConfigGeneratedJson
  },
  props: ['acronym'],
  computed: {
    ...mapGetters('webadeAccess', ['configSubmissionError', 'configSubmissionInProgress', 'configSubmissionSuccess'])
  },
  methods: {
    ...mapActions('webadeAccess', ['initAcronymDetails']),
  },
  beforeDestroy() {
    this.$store.unregisterModule('webadeAccess');
  },
  created() {
    this.$store.registerModule('webadeAccess', webadeAccess);
    this.initAcronymDetails(this.acronym);
  }
};
</script>

<style scoped>
</style>
