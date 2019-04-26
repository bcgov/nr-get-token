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
        v-on:keyup.stop="updateField('applicationAcronym', $event.target.value)"
      ></v-text-field>
      <v-text-field
        label="Application Name"
        required
        :value="userAppCfg.applicationName"
        v-on:keyup.stop="updateField('applicationName', $event.target.value)"
      ></v-text-field>
      <v-text-field
        label="Application Description"
        required
        :value="userAppCfg.applicationDescription"
        v-on:keyup.stop="updateField('applicationDescription', $event.target.value)"
      ></v-text-field>
      <v-select
        :items="commonServices"
        label="Common Service Required"
        multiple
        chips
        deletable-chips
      ></v-select>

      <v-btn color="primary" @click="appConfigStep = 2">Next</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="appConfigStep > 2" step="2">
      Deployment
      <small>Choose method of deploying WebADE config</small>
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
      <v-btn color="success" @click="appConfigStep = 3">Submit</v-btn>
      <v-btn flat @click="appConfigStep = 1">Back</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      appConfigStep: 1,
      commonServices: [
        { text: "Common Messaging Service", value: "cmsg" },
        { text: "Document Management Service", value: "dms" },
        { text: "Document Generation Service", value: "dgen", disabled: true }
      ],
      userAppCfg: this.$store.state.userAppCfg
    };
  },
  methods: {
    updateField(field, value) {
      this.$store.commit("updateUserAppCfg", {
        [field]: value
      });
    }
  }
};
</script>
