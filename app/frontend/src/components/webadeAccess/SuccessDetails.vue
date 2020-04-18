<template>
  <v-dialog v-model="passwordDialog" persistent max-width="700">
    <v-card>
      <v-card-title class="headline success">
        <v-icon class="mr-2">check_circle</v-icon>
        <span>Application Configuration Updated</span>
      </v-card-title>
      <v-card-text>
        <br />
        <p>
          Your application configuration for
          <strong>{{userAppCfg.applicationAcronym}}</strong> has been updated in the WebADE system.
        </p>
        <h2>1. Service Client</h2>
        <p>A password for the service client created is shown below. Keep this password secure and do not lose it as you will be unable to fetch it again.</p>

        <v-checkbox
          v-model="passwordAgree"
          label="I agree to securely store this password in an OpenShift Secret."
        ></v-checkbox>

        <v-card color="green lighten-5" class="pl-3 pt-3 mb-3">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="displayClient" readonly label="Service Client"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="shownPassword" readonly label="Password"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4">
              <v-btn
                color="success"
                :disabled="!passwordAgree"
                @click="decryptPassword()"
              >DECRYPT PASSWORD</v-btn>
            </v-col>
            <v-col cols="6" sm="2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    icon
                    color="primary"
                    v-clipboard:copy="shownPassword"
                    v-clipboard:success="clipboardSuccessHandler"
                    v-clipboard:error="clipboardErrorHandler"
                    v-on="on"
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy password to clipboard</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card>

        <div v-if="passwordDecrypted">
          <h2>2. API Access Token</h2>
          <p>You can fetch a token with this new service client to test out in the API store or through any REST client</p>
          <v-row align="center">
            <v-col cols="12" sm="2">
              <v-btn small color="primary" dark @click="getToken()">Get Token</v-btn>
            </v-col>
            <v-col cols="12" sm="8" v-if="generatedToken">{{generatedToken}}</v-col>
            <v-col class="error" cols="12" sm="8" v-if="generatedTokenError">{{generatedTokenError}}</v-col>
            <v-col cols="6" sm="2" v-if="generatedToken">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    icon
                    color="primary"
                    v-clipboard:copy="generatedToken"
                    v-clipboard:success="clipboardSuccessHandler"
                    v-clipboard:error="clipboardErrorHandler"
                    v-on="on"
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy token to clipboard</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <br />

          <div v-if="userAppCfg.commonServices.length > 0">
            <h2>3. API Store Swagger</h2>
            <p>
              This token can be used to test out the common services you have specified by trying them out in the API Store.
              <br />Fill in the token above into the Access Token field at the top of the
              <strong>API Console</strong> tab for the common service(s) linked below:
            </p>
            <ul>
              <li v-for="item in apiLinks" v-bind:key="item.name">
                <strong>{{item.name}}</strong>
                <v-btn small color="primary" dark :href="item.apiDocLink" target="_blank">
                  See API docs
                  <v-icon right dark>open_in_new</v-icon>
                </v-btn>
                <br />Download Postman collection:
                <a
                  class="buttonLink"
                  :href="`/files/${item.postmanCollection}`"
                  :download="item.postmanCollection"
                  target="_blank"
                >
                  <v-btn text icon color="primary">
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="info darken-1"
          text
          :disabled="!passwordAgree || !passwordDecrypted"
          @click="passwordDialog = false"
        >FINISHED</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { CommonServiceList } from '@/utils/commonServices.js';
import { CommonServiceRoutes } from '@/utils/constants.js';

import axios from 'axios';
var jsdiff = require('diff');
import cryptico from 'cryptico-js';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      shownPassword: '••••••••',
      confirmationDialog: false,
      passwordDialog: false,
      passwordAgree: false,
      passwordDecrypted: false,
      step2Valid: false,
      webadeEnvironments: ['INT', 'TEST', 'PROD'],
      userAppCfg: this.$store.state.webadeAccess.userAppCfg,
      snackbar: {
        on: false,
        text: 'test',
        color: 'info'
      },
      generatedToken: '',
      generatedTokenError: ''
    };
  },
  computed: {
    ...mapGetters('webadeAccess', [
      'ephemeralPasswordRSAKey',
      'existingWebAdeConfig',
    ]),
    displayClient: function() {
      return this.configFormSubmissionResult
        ? this.configFormSubmissionResult.generatedServiceClient
        : '';
    },
    apiLinks: function() {
      // Return selected common services
      return this.userAppCfg.commonServices.map(item =>
        CommonServiceList.find(service => service.abbreviation === item)
      );
    }
  },
  methods: {
    async submitConfig() {
      this.generatedToken = '';
      window.scrollTo(0, 0);
      this.shownPassword = '••••••••';
      this.$store.commit('webadeAccess/clearConfigSubmissionMsgs');

      await this.$store.dispatch('webadeAccess/submitConfigForm');
      if (this.configSubmissionSuccess) {
        this.passwordDialog = true;
      }
    },
    async getToken() {
      this.generatedToken = '';
      this.generatedTokenError = '';
      try {
        let url = CommonServiceRoutes.TOKEN;
        if (this.userAppCfg.commonServices.length > 0) {
          url = url + this.userAppCfg.commonServices.map(i => i.toUpperCase());
        } else {
          url = url + 'WEBADE-REST';
        }
        const response = await axios.get(url, {
          auth: {
            username: this.displayClient,
            password: this.shownPassword
          }
        });
        const body = response.data;

        if (!body) {
          throw new Error('no body in the response');
        }
        if (body.error) {
          throw new Error(body.error);
        }

        this.generatedToken = body.access_token;
      } catch (e) {
        console.log('ERROR, caught error fetching from WebADE Token endpoint'); // eslint-disable-line no-console
        console.log(e); // eslint-disable-line no-console
        this.generatedTokenError =
          'Error fetching token. The service client can take a moment to register, you can try again in a few seconds.';
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
    },
    displayMessage(success, msg) {
      this.$store.commit(
        `webadeAccess/setConfigSubmission${success ? 'Success' : 'Error'}`,
        msg
      );
    },
    decryptPassword() {
      this.passwordDecrypted = true;
      const DecryptionResult = cryptico.decrypt(
        this.configFormSubmissionResult.generatedPassword,
        this.ephemeralPasswordRSAKey
      );
      this.shownPassword = DecryptionResult.plaintext;
    },
    clipboardSuccessHandler() {
      this.snackbar.on = true;
      this.snackbar.text = ' copied to clipboard';
      this.snackbar.color = 'info';
    },
    clipboardErrorHandler() {
      this.snackbar.on = true;
      this.snackbar.text = 'attempting to copy to clipboard';
      this.snackbar.color = 'error';
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
