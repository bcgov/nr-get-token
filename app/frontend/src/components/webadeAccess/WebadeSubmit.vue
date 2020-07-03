<template>
  <div>
    <v-dialog
      v-model="confirmationDialog"
      persistent
      max-width="1200"
      v-if="userAppCfg.deploymentMethod === 'deploymentDirect'"
    >
      <template v-slot:activator="{ on }">
        <v-btn color="success" v-on="on" @click="getWebAdeConfig">Submit</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text>
          <p>
            This will overwrite any existing WebADE configuration for the
            <strong>{{ userAppCfg.applicationAcronym }}</strong> application
            in the ISSS
            <strong>{{ userAppCfg.clientEnvironment }}</strong> WebADE environment.
          </p>
          <p>The following shows the differences between the current configuration and the configuration that will be created. Are you sure you want to proceed?</p>
          <v-progress-linear v-if="diffLoading" color="primary" indeterminate></v-progress-linear>
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
      <SuccessDetails/>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
var jsdiff = require('diff');

export default {
  data() {
    return {
      confirmationDialog: false,
      passwordDialog: false
    };
  },
  computed: {
    ...mapGetters('webadeAccess', ['appConfigAsString', 'diffLoading', 'existingWebAdeConfig', 'userAppCfg'])
  },
  methods: {
    async getWebAdeConfig() {
      let display = document.getElementById('webadeDiff');
      if(display) display.innerHTML = '';
      await this.$store.dispatch('webadeAccess/getWebAdeConfig', {
        webAdeEnv: this.userAppCfg.clientEnvironment,
        acronym: this.userAppCfg.applicationAcronym
      });
      let diff = jsdiff.diffLines(
          this.existingWebAdeConfig,
          this.appConfigAsString
        ),
        fragment = document.createDocumentFragment();
      display = document.getElementById('webadeDiff');

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
    async submitConfig() {
      window.scrollTo(0, 0);
      this.$store.commit('webadeAccess/clearConfigSubmissionMsgs');

      await this.$store.dispatch('webadeAccess/submitConfigForm');
      if (this.configSubmissionSuccess) {
        this.passwordDialog = true;
      }
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
</style>
