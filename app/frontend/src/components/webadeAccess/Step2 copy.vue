<template>
  <v-form v-model="step2Valid">
    <v-row>
      <v-col cols="12" md="7">
        <v-select
          required
          :mandatory="true"
          :items="webadeEnvironments"
          label="Environment to Deploy to"
          :value="userAppCfg.clientEnvironment"
          v-on:change="updateAppCfgField('clientEnvironment', $event)"
        ></v-select>
      </v-col>
    </v-row>

    <v-radio-group
      :value="userAppCfg.deploymentMethod"
      v-on:change="updateAppCfgField('deploymentMethod', $event)"
      :mandatory="true"
    >
      <v-radio label="Manual commit to Bitbucket (deploy with Jenkins)" value="deploymentManual"></v-radio>
      <p v-if="userAppCfg.deploymentMethod === 'deploymentManual'" class="underRadioField">
        <a
          href="https://github.com/bcgov/nr-get-token/wiki/WebADE-Access"
          target="_blank"
        >Instructions for manual deployment</a>
      </p>
      <v-radio label="Direct Deploy" value="deploymentDirect"></v-radio>
    </v-radio-group>

    <v-btn text @click="back">Back</v-btn>

    <v-dialog
      v-model="confirmationDialog"
      persistent
      max-width="1200"
      v-if="userAppCfg.deploymentMethod === 'deploymentDirect'"
    >
      <template v-slot:activator="{ on }">
        <v-btn color="success" :disabled="!step2Valid" v-on="on" @click="getWebAdeConfig">Submit</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text>
          <p>
            This will overwrite any existing WebADE configuration for the
            <strong>{{ userAppCfg.applicationAcronym }}</strong> application.
          </p>
          <p>The following shows the differences between the current configuration and the configuration that will be created. Are you sure you want to proceed?</p>
          <pre id="webadeDiff"></pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmationDialog = false">CANCEL</v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="confirmationDialog = false; submitConfig()"
          >CONTINUE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="passwordDialog" persistent max-width="700">
      <SuccessDetails />
    </v-dialog>
    <v-snackbar v-model="snackbar.on" right top :timeout="6000" :color="snackbar.color">
      {{snackbar.text}}
      <v-btn color="white" text @click="snackbar.on = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-form>
</template>

<script>
import SuccessDetails from '@/components/webadeAccess/SuccessDetails.vue';

var jsdiff = require('diff');
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'WebadeStep2',
  components: {
    SuccessDetails
  },
  data() {
    return {
      confirmationDialog: false,
      passwordDialog: false,
      step2Valid: false,
      webadeEnvironments: ['INT', 'TEST', 'PROD'],
      userAppCfg: this.$store.state.webadeAccess.userAppCfg
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
  },
  methods: {
    ...mapMutations('webadeAccess', ['clearConfigSubmissionMsgs', 'setConfigFormStep']),
    back() {
      this.setConfigFormStep(1);
    },
    async submitConfig() {
      this.generatedToken = '';
      window.scrollTo(0, 0);
      this.clearConfigSubmissionMsgs();

      await this.$store.dispatch('webadeAccess/submitConfigForm');
      if (this.configSubmissionSuccess) {
        this.passwordDialog = true;
      }
    },
    async getWebAdeConfig() {
      await this.$store.dispatch('webadeAccess/getWebAdeConfig', {
        webAdeEnv: this.userAppCfg.clientEnvironment,
        acronym: this.userAppCfg.applicationAcronym
      });
      let diff = jsdiff.diffLines(
          this.existingWebAdeConfig,
          this.appConfigAsString
        ),
        display = document.getElementById('webadeDiff'),
        fragment = document.createDocumentFragment();

      diff.forEach(part => {
        // green for additions, red for deletions
        // grey for common parts
        let color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        let span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document.createTextNode(part.value));
        fragment.appendChild(span);
      });

      display.appendChild(fragment);
    },
    updateAppCfgField(field, value) {
      this.$store.commit('webadeAccess/updateUserAppCfg', {
        [field]: value
      });
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
