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

          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-if="userAppCfg.deploymentMethod === 'deploymentDirect'"
                label="Password"
                required
                :value="userAppCfg.userEnteredPassword"
                v-on:keyup.stop="updateAppCfgField('userEnteredPassword', $event.target.value)"
                class="underRadioField"
                :rules="passwordRules"
                :append-icon="showPw ? 'visibility' : 'visibility_off'"
                :type="showPw ? 'text' : 'password'"
                :counter="fieldValidations.PASSWORD_MAX_LENGTH"
                @click:append="showPw = !showPw"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-radio-group>

        <v-btn flat @click="appConfigStep = 1">Back</v-btn>

        <v-dialog
          v-model="dialog"
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
              <v-btn flat @click="dialog = false">CANCEL</v-btn>
              <v-btn color="green darken-1" flat @click="dialog = false; submitConfig()">CONTINUE</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import { mapGetters } from "vuex";
import { isValidJson } from "@/utils/utils.js";
import { FieldValidations } from "@/utils/constants.js";

export default {
  data() {
    return {
      dialog: false,
      fieldValidations: FieldValidations,
      appConfig: "",
      appConfigStep: 1,
      step1Valid: false,
      step2Valid: false,
      showPw: false,
      commonServices: [
        { text: "Common Messaging Service", value: "cmsg" },
        { text: "Document Management Service", value: "dms" },
        { text: "Document Generation Service", value: "dgen", disabled: true }
      ],
      userAppCfg: this.$store.state.userAppCfg,
      applicationAcronymRules: [
        v => !!v || "Acroynm is required",
        v =>
          v.length <= FieldValidations.ACRONYM_MAX_LENGTH ||
          `Acroynm must be ${
            FieldValidations.ACRONYM_MAX_LENGTH
          } characters or less`,
        v =>
          /^(?:[A-Z]{2,}[_]?)+[A-Z]{2,}$/g.test(v) ||
          "Incorrect format. Hover the ? for details."
      ],
      applicationNameRules: [
        v => !!v || "Name is required",
        v =>
          v.length <= FieldValidations.NAME_MAX_LENGTH ||
          `Name must be ${FieldValidations.NAME_MAX_LENGTH} characters or less`
      ],
      applicationDescriptionRules: [
        v => !!v || "Description is required",
        v =>
          v.length <= FieldValidations.DESCRIPTION_MAX_LENGTH ||
          `Description must be ${
            FieldValidations.DESCRIPTION_MAX_LENGTH
          } characters or less`
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v =>
          (v.length >= FieldValidations.PASSWORD_MIN_LENGTH &&
            v.length <= FieldValidations.PASSWORD_MAX_LENGTH) ||
          `Password must be between ${
            FieldValidations.PASSWORD_MIN_LENGTH
          } and ${FieldValidations.PASSWORD_MAX_LENGTH} characters`
      ]
    };
  },
  computed: {
    ...mapGetters(["token", "appConfigAsString"])
  },
  methods: {
    submitConfig() {
      this.$store.commit("clearConfigSubmissionMsgs");

      // this is temporary, only allow MSSC to be used at the moment
      if (this.userAppCfg.applicationAcronym !== "MSSC") {
        this.$store.commit(
          "setConfigSubmissionError",
          "Temp: Only the application acronym MSSC is supported for now."
        );
        return;
      }

      // check json validity
      if (!isValidJson(this.appConfigAsString)) {
        this.$store.commit(
          "setConfigSubmissionError",
          "Unable to submit, Application Configuration is not valid JSON."
        );
        return;
      }

      const url = `https://i1api.nrs.gov.bc.ca/webade-api/v1/applicationConfigurations`;

      const headers = new Headers();
      headers.set("Authorization", `Bearer ${this.token}`);
      headers.set("Content-Type", "application/json");

      fetch(url, {
        method: "POST",
        body: this.appConfigAsString,
        headers: headers
      })
        .then(res => res.json())
        .then(function(response) {
          console.log("Success:", JSON.stringify(response)); // eslint-disable-line no-console
          alert(`SUCCESS, application configuration updated in Integration`);
        })
        .catch(function(error) {
          console.error("Error:", error); // eslint-disable-line no-console
          alert("ERROR, see console");
        });
    },
    updateAppCfgField(field, value) {
      this.$store.commit("updateUserAppCfg", {
        [field]: value
      });
    }
  }
};
</script>
