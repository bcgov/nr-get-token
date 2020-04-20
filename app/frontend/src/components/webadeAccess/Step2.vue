<template>
  <v-form>
    <v-row>
      <v-col cols="12" md="7">
        <v-select
          required
          :mandatory="true"
          :items="webadeEnvironments"
          label="Environment to Deploy to"
          v-model="clientEnvironment"
        ></v-select>
      </v-col>
    </v-row>

    <v-radio-group
      v-model="deploymentMethod"
      :mandatory="true"
    >
      <v-radio label="Manual commit to Bitbucket (deploy with Jenkins)" value="deploymentManual"></v-radio>
      <p v-if="deploymentMethod === 'deploymentManual'" class="underRadioField">
        <a
          href="https://github.com/bcgov/nr-get-token/wiki/WebADE-Access"
          target="_blank"
        >Instructions for manual deployment</a>
      </p>
      <v-radio label="Direct Deploy" value="deploymentDirect"></v-radio>
    </v-radio-group>

    <v-btn text @click="back">Back</v-btn>

    <WebadeSubmit/>

  </v-form>
</template>

<script>
//import SuccessDetails from '@/components/webadeAccess/SuccessDetails.vue';
import WebadeSubmit from '@/components/webadeAccess/WebadeSubmit.vue';

import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'WebadeStep2',
  components: {
    WebadeSubmit
  },
  data() {
    return {
      webadeEnvironments: ['INT', 'TEST', 'PROD'],
    };
  },
  computed: {
    ...mapGetters('webadeAccess', [
      'existingWebAdeConfig',
      'userAppCfg',
    ]),
    clientEnvironment: {
      get() { return this.userAppCfg.clientEnvironment; },
      set(value) { this.updateUserAppCfg({['clientEnvironment']: value}); }
    },
    deploymentMethod: {
      get() { return this.userAppCfg.deploymentMethod; },
      set(value) { this.updateUserAppCfg({['deploymentMethod']: value}); }
    },
  },
  methods: {
    ...mapMutations('webadeAccess', ['clearConfigSubmissionMsgs', 'setConfigFormStep', 'updateUserAppCfg']),
    back() {
      this.setConfigFormStep(1);
    }
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
.underRadioField {
  padding-left: 32px;
}
</style>
