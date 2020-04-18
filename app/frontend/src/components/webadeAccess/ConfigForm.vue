<template>
  <v-stepper v-model="configFormStep" vertical class="elevation-0">
    <v-stepper-step :complete="configFormStep > 1" step="1">
      Set up Application
      <small>Enter service client details</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <Step1 />
    </v-stepper-content>

    <v-stepper-step :complete="configFormStep > 2" step="2">
      Deployment
      <small>Choose method of deploying WebADE config</small>
    </v-stepper-step>

    <v-stepper-content step="2">
      <Step2 />
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import Step1 from '@/components/webadeAccess/Step1.vue';
import Step2 from '@/components/webadeAccess/Step2.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'ConfigForm',
  components: {
    Step1,
    Step2
  },
  computed: {
    ...mapGetters('webadeAccess', [
      'configFormStep',
      'configFormSubmissionResult',
      'configSubmissionSuccess',
      'configSubmissionError',
    ])
  }
};
</script>

<style scoped>
.commonSvcBtn {
  min-height: 100px;
}
.underbutton {
  padding-left: 20px;
  margin-bottom: 15px;
}
</style>
