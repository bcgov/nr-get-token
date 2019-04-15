<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-img :src="require('@/assets/images/Get-Token_md.png')" class="my-3" contain height="150"></v-img>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs112>
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
          </v-toolbar>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <v-form>
                  <v-textarea
                    rows="1"
                    placeholder="Enter configuration JSON here"
                    auto-grow
                    label="WebADE Application Config"
                    v-model="appConfig"
                  ></v-textarea>
                  <v-btn
                    id="submitAppConfig"
                    disabled
                    color="success"
                    @click="handleSubmitAppConfig"
                  >Submit</v-btn>
                  <input type="hidden" id="hiddenToken">
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GetToken from "./GetToken";

export default {
  name: "home",
  components: {
    GetToken
  },
  data() {
    return {
      hiddenToken: "",
      appConfig: ""
    };
  },

  methods: {
    handleSubmitAppConfig() {
      const token = document.querySelector("#hiddenToken").value;

      const url = `https://i1api.nrs.gov.bc.ca/webade-api/v1/applicationConfigurations`;

      const headers = new Headers();
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");

      const config = JSON.parse(this.appConfig);

      fetch(url, {
        method: "POST",
        body: this.appConfig,
        headers: headers
      })
        .then(res => res.json())
        .then(function(response) {
          console.log("Success:", JSON.stringify(response));
          alert(`SUCCESS, application configuration for ${config.applicationAcronym} updated in Integration`)
        })
        .catch(function(error) {
          console.error("Error:", error);
          alert("ERROR, see console");
        });
    }
  }
};
</script>

<style>
.sectionCard {
  margin-bottom: 20px;
}
</style>
