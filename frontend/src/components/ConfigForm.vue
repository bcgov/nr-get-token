<template>
  <v-stepper v-model="appConfigStep" vertical class="elevation-0">
    <v-stepper-step :complete="appConfigStep > 1" step="1">
      Set up Application
      <small>Pick application and service client details</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-text-field
        label="Application Acronym"
        required
        :value="userAppCfg.applicationAcronym"
        v-on:keyup.stop="updateAppCfgField('applicationAcronym', $event.target.value)"
      ></v-text-field>
      <v-text-field
        label="Application Name"
        required
        :value="userAppCfg.applicationName"
        v-on:keyup.stop="updateAppCfgField('applicationName', $event.target.value)"
      ></v-text-field>
      <v-text-field
        label="Application Description"
        required
        :value="userAppCfg.applicationDescription"
        v-on:keyup.stop="updateAppCfgField('applicationDescription', $event.target.value)"
      ></v-text-field>
      <v-select
        :items="commonServices"
        label="Common Service Required"
        multiple
        chips
        deletable-chips
        :value="userAppCfg.commonServices"
        v-on:change="updateAppCfgField('commonServices', $event)"
      ></v-select>

      <v-btn color="primary" @click="appConfigStep = 2">Next</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="appConfigStep > 2" step="2">
      Deployment
      <small>Choose method of deploying WebADE config</small>
    </v-stepper-step>

    <v-stepper-content step="2">
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
        <v-text-field
          v-if="userAppCfg.deploymentMethod === 'deploymentDirect'"
          label="Password"
          required
          :value="userAppCfg.userEnteredPassword"
          v-on:keyup.stop="updateAppCfgField('userEnteredPassword', $event.target.value)"
          class="underRadioField"
        ></v-text-field>
      </v-radio-group>

      <v-btn
        v-if="userAppCfg.deploymentMethod === 'deploymentDirect'"
        color="success"
        @click="submitConfig"
      >Submit</v-btn>
      <v-btn flat @click="appConfigStep = 1">Back</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      appConfig: "",
      appConfigStep: 1,
      commonServices: [
        { text: "Common Messaging Service", value: "cmsg" },
        { text: "Document Management Service", value: "dms" },
        { text: "Document Generation Service", value: "dgen", disabled: true }
      ],
      userAppCfg: this.$store.state.userAppCfg
    };
  },
  computed: {
    ...mapGetters(["token", "appConfigAsString"])
  },
  methods: {
    submitConfig() {
      if (this.userAppCfg.applicationAcronym !== "MSSC") {
        this.$store.commit(
          "setConfigSubmissionError",
          "Temp: Only the application acronym MSSC is supported for now."
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
          alert(
            `SUCCESS, application configuration for ${
              this.userAppCfg.applicationAcronym
            } updated in Integration`
          );
        })
        .catch(function(error) {
          console.error("Error:", error); // eslint-disable-line no-console
          alert("ERROR, see console");
        });
    },
    submitConfigErr() {},
    updateAppCfgField(field, value) {
      this.$store.commit("updateUserAppCfg", {
        [field]: value
      });
    }
  }
};
</script>
