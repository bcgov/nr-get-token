<template>
  <v-form ref="form" v-model="valid">
    <v-container>
      <v-layout>
        <v-flex xs12 md5>
          <v-text-field
            v-model="serviceClient"
            label="Service Client"
            value="GETOK_SERVICE"
            readonly
            required
          ></v-text-field>

          <v-text-field v-model="password" type="password" label="Password" required></v-text-field>

          <v-btn :disabled="!valid" color="success" @click="handleSubmit">Submit</v-btn>
        </v-flex>
        <v-flex xs12 md6 offset-md1>
          <v-textarea
            id="tokenResponse"
            rows="10"
            placeholder="This field will be filled by the token"
            auto-grow
            readonly
            label="Token Response"
          ></v-textarea>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      serviceClient: "GETOK_SERVICE",
      password: "",
      tokenResponse: ""
    };
  },

  methods: {
    handleSubmit() {
      const url = `https://i1api.nrs.gov.bc.ca/oauth2/v1/oauth/token?disableDeveloperFilter=true&grant_type=client_credentials&scope=WEBADE-REST.*`;

      const headers = new Headers();
      headers.set(
        "Authorization",
        "Basic " + window.btoa("GETOK_SERVICE" + ":" + this.password)
      );

      fetch(url, {
        method: "get",
        headers: headers
      })
        .then(resp => resp.json())
        .then(function(data) {
          // TODO: This is all hard JS. Should be moved to proper Vue
          const tokenResponseField = document.querySelector("#tokenResponse");
          const hiddenTokenField = document.querySelector("#hiddenToken");
          tokenResponseField.value = JSON.stringify(data, null, 2);
          if (data.access_token) {
            hiddenTokenField.value = data.access_token;
            const appSubmit = document.querySelector("#submitAppConfig");
            appSubmit.disabled = false;
            appSubmit.classList.remove("v-btn--disabled", "success--text");
            appSubmit.classList.add("success");
          }
        })
        .catch(function(error) {
          console.log(`ERROR, caught error fetching from ${url}`); // eslint-disable-line no-console
          console.log(error); // eslint-disable-line no-console
        });
    }
  }
};
</script>



<style>
</style>
