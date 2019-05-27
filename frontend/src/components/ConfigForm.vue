<template>
  <v-stepper v-model="appConfigStep" vertical class="elevation-0">
    <v-stepper-step :complete="appConfigStep > 1" step="1">
      Set up Application
      <small>Pick application and service client details</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-form v-model="step1Valid">
        <v-layout row wrap>
          <v-flex xs12 md7>
            <v-text-field
              label="Application Acronym"
              required
              :value="userAppCfg.applicationAcronym"
              v-on:keyup.stop="updateAppCfgField('applicationAcronym', $event.target.value)"
              :counter="fieldValidations.ACRONYM_MAX_LENGTH"
              :rules="applicationAcronymRules"
            >
              <template v-slot:append-outer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">help_outline</v-icon>
                  </template>
                  The Application Acronym must comply with the following format:
                  <ul>
                    <li>UPPERCASE LETTERS ONLY</li>
                    <li>Underscores may be placed between letters</li>
                    <li>Must begin and end with a letter</li>
                    <li>At least {{ fieldValidations.ACRONYM_MIN_LENGTH }} characters</li>
                    <li>
                      Examples:
                      <em>ABCD</em>,
                      <em>ABCD_WXYZ</em>
                    </li>
                  </ul>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 md9>
            <v-text-field
              label="Application Name"
              required
              :value="userAppCfg.applicationName"
              v-on:keyup.stop="updateAppCfgField('applicationName', $event.target.value)"
              :counter="fieldValidations.NAME_MAX_LENGTH"
              :rules="applicationNameRules"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-text-field
          label="Application Description"
          required
          :value="userAppCfg.applicationDescription"
          v-on:keyup.stop="updateAppCfgField('applicationDescription', $event.target.value)"
          :counter="fieldValidations.DESCRIPTION_MAX_LENGTH"
          :rules="applicationDescriptionRules"
        ></v-text-field>
        <v-select
          :items="commonServices"
          label="Common Service(s) Required"
          multiple
          chips
          deletable-chips
          :value="userAppCfg.commonServices"
          v-on:change="updateAppCfgField('commonServices', $event)"
        ></v-select>

        <v-btn color="primary" @click="appConfigStep = 2" :disabled="!step1Valid">Next</v-btn>
      </v-form>
    </v-stepper-content>

    <v-stepper-step :complete="appConfigStep > 2" step="2">
      Deployment
      <small>Choose method of deploying WebADE config</small>
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-form v-model="step2Valid">
        <v-radio-group
          :value="userAppCfg.deploymentMethod"
          v-on:change="updateAppCfgField('deploymentMethod', $event)"
          :mandatory="true"
        >
          <v-radio
            label="Manual commit to Bitbucket (deploy with Jenkins)"
            value="deploymentManual"
          ></v-radio>
          <p v-if="userAppCfg.deploymentMethod === 'deploymentManual'" class="underRadioField">
            <a
              href="https://github.com/bcgov/nr-get-token/wiki/WebADE-Access"
              target="_blank"
            >Instructions for manual deployment</a>
          </p>
          <v-radio label="Direct Deploy" value="deploymentDirect"></v-radio>
        </v-radio-group>

        <v-btn flat @click="appConfigStep = 1">Back</v-btn>

        <v-dialog
          v-model="confirmationDialog"
          persistent
          max-width="400"
          v-if="userAppCfg.deploymentMethod === 'deploymentDirect'"
        >
          <template v-slot:activator="{ on }">
            <v-btn color="success" :disabled="!step2Valid" v-on="on">Submit</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">Are you sure?</v-card-title>
            <v-card-text>
              This will overwrite any existing WebADE configuration for the
              <strong>{{ userAppCfg.applicationAcronym }}</strong> application. Are you sure you want to proceed?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="confirmationDialog = false">CANCEL</v-btn>
              <v-btn
                color="green darken-1"
                flat
                @click="confirmationDialog = false; submitConfig()"
              >CONTINUE</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="passwordDialog" persistent max-width="600">
          <v-card>
            <v-card-title class="headline">Application Submitted</v-card-title>
            <v-card-text>Updated. Password is {{generatedPassword}}</v-card-text>
            <v-card-actions>
              <v-btn color="green darken-1" flat @click="passwordDialog = false">FINISHED</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import { mapGetters } from 'vuex';
import { FieldValidations, ApiRoutes } from '@/utils/constants.js';
import cryptico from 'cryptico-js';

export default {
  data() {
    return {
      apiEndpoint: ApiRoutes.APPCONFIG,
      confirmationDialog: false,
      passwordDialog: false,
      fieldValidations: FieldValidations,
      appConfig: '',
      appConfigStep: 1,
      step1Valid: false,
      step2Valid: false,
      commonServices: [
        { text: 'Common Messaging Service', value: 'cmsg' },
        { text: 'Document Management Service', value: 'dms' },
        { text: 'Document Generation Service', value: 'dgen', disabled: true }
      ],
      userAppCfg: this.$store.state.userAppCfg,
      applicationAcronymRules: [
        v => !!v || 'Acroynm is required',
        v =>
          v.length <= FieldValidations.ACRONYM_MAX_LENGTH ||
          `Acroynm must be ${
            FieldValidations.ACRONYM_MAX_LENGTH
          } characters or less`,
        v =>
          /^(?:[A-Z]{2,}[_]?)+[A-Z]{2,}$/g.test(v) ||
          'Incorrect format. Hover the ? for details.'
      ],
      applicationNameRules: [
        v => !!v || 'Name is required',
        v =>
          v.length <= FieldValidations.NAME_MAX_LENGTH ||
          `Name must be ${FieldValidations.NAME_MAX_LENGTH} characters or less`
      ],
      applicationDescriptionRules: [
        v => !!v || 'Description is required',
        v =>
          v.length <= FieldValidations.DESCRIPTION_MAX_LENGTH ||
          `Description must be ${
            FieldValidations.DESCRIPTION_MAX_LENGTH
          } characters or less`
      ]
    };
  },
  computed: {
    ...mapGetters(['appConfigAsString', 'generatedPassword'])
  },
  methods: {
    async submitConfig() {
      this.$store.commit('clearConfigSubmissionMsgs');

      // this is temporary, only allow MSSC to be used at the moment
      if (
        this.userAppCfg.applicationAcronym !== 'MSSC' &&
        this.userAppCfg.applicationAcronym !== 'DOMO'
      ) {
        this.displayMessage(
          false,
          'Temp: Only the application acronym MSSC is supported for now.'
        );
        return;
      }

      // The passphrase used to repeatably generate this RSA key.
      const ephemeralRSAKey = cryptico.generateRSAKey('The Moon is a Harsh Mistress.', 1024);
      this.$store.commit('setEphemeralPasswordRSAKey', ephemeralRSAKey);

      const url = this.apiEndpoint;
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');

      const body = {
        configForm: this.userAppCfg,
        passwordPublicKey: cryptico.publicKeyString(ephemeralRSAKey)
      };
      try {
        const response = await fetch(url, {
          method: 'post',
          headers: headers,
          body: JSON.stringify(body)
        });
        if (response.ok) {
          const resBody = await response.json();
          this.displayMessage(
            true,
            `SUCCESS, application configuration for ${
              this.userAppCfg.applicationAcronym
            } updated in Integration.`
          );
          this.$store.commit('setGeneratedPassword', resBody.generatedPassword);
          this.passwordDialog = true;
        } else {
          this.displayMessage(
            false,
            'An error occurred while attempting to update the application configuration in WebADE.'
          );
        }
      } catch (error) {
        this.displayMessage(
          false,
          'An error occurred while attempting to update the application configuration in WebADE.'
        );
      }
    },
    updateAppCfgField(field, value) {
      this.$store.commit('updateUserAppCfg', {
        [field]: value
      });
    },
    displayMessage(success, msg) {
      this.$store.commit(
        `setConfigSubmission${success ? 'Success' : 'Error'}`,
        msg
      );
    }
  }
};
</script>
