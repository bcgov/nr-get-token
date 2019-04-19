 <template>
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
          <v-btn id="submitAppConfig" disabled color="success" @click="handleSubmitAppConfig">Submit</v-btn>
          <input type="hidden" id="hiddenToken">
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "configForm",
  data() {
    return {
      hiddenToken: "",
      appConfig: ""
    };
  },

  methods: {
    handleSubmitAppConfig() {
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
          console.log("Success:", JSON.stringify(response)); // eslint-disable-line no-console
          alert(
            `SUCCESS, application configuration for ${
              config.applicationAcronym
            } updated in Integration`
          );
        })
        .catch(function(error) {
          console.error("Error:", error); // eslint-disable-line no-console
          alert("ERROR, see console");
        });
    }
  }
};
</script>