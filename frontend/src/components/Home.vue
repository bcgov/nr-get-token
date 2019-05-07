<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs4>
        <v-img :src="require('@/assets/images/tokey.svg')" contain height="180" position="right"></v-img>
      </v-flex>
      <v-flex xs8>
        <v-img
          :src="require('@/assets/images/Get-Token_md.png')"
          class="my-3"
          contain
          height="150"
          position="left"
        ></v-img>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="sectionCard">
          <v-toolbar card color="grey lighten-3">
            <v-toolbar-title>Fetch GETOK Token</v-toolbar-title>
          </v-toolbar>
          <GetToken></GetToken>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card class="sectionCard">
          <v-toolbar card color="grey lighten-3">
            <v-toolbar-title>Submit Application Configuration</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-chip v-if="!token" color="red" text-color="white">
              <v-icon left>lock</v-icon>No Valid Token
            </v-chip>
            <v-chip v-if="token" color="green" text-color="white">
              <v-icon left>lock_open</v-icon>
              Token: {{token}}
            </v-chip>
          </v-toolbar>
          <div>
            <v-alert
              :value="configSubmissionSuccess"
              type="success"
              transition="scale-transition"
            >{{configSubmissionSuccess}}</v-alert>
            <v-alert
              :value="configSubmissionError"
              type="error"
              transition="scale-transition"
            >{{configSubmissionError}}</v-alert>
          </div>
          <v-layout row wrap v-if="token">
            <v-flex xs12 md5>
              <ConfigForm></ConfigForm>
            </v-flex>
            <v-flex xs12 md6 offset-md1>
              <ConfigGeneratedJson></ConfigGeneratedJson>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GetToken from "./GetToken";
import ConfigForm from "./ConfigForm";
import ConfigGeneratedJson from "./ConfigGeneratedJson";
import { mapGetters } from "vuex";

export default {
  name: "home",
  components: {
    GetToken,
    ConfigForm,
    ConfigGeneratedJson
  },
  computed: mapGetters([
    "token",
    "configSubmissionSuccess",
    "configSubmissionError"
  ])
};
</script>

<style>
.sectionCard {
  margin-bottom: 20px;
}

.jsonText textarea {
  font-family: "Courier New", Courier, monospace;
}

.underRadioField {
  padding-left: 32px;
}
</style>
