<template>
  <v-form ref="form">
    <v-container>
      <v-layout>
        <v-flex xs12 md5>
          <v-form>
            <v-text-field :value="testRoute" label="Endpoint" readonly required></v-text-field>

            <v-btn color="success" @click="testApi">Test</v-btn>
          </v-form>
        </v-flex>
        <v-flex xs12 md6 offset-md1>
          <v-textarea
            v-model="apiResponse"
            rows="1"
            placeholder="The response from the api test"
            auto-grow
            readonly
            label="Api Response"
          ></v-textarea>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: function() {
    return {
      apiResponse: ""
    };
  },
  computed: {
    testRoute() {
      return this.$store.getters.rootApi + "/docs";
    }
  },
  methods: {
    async testApi() {
      this.apiResponse = await this.callApi();
    },
    async callApi() {
      try {
        const response = await fetch(this.testRoute, { method: "get" });

        const body = await response.json();

        return body;
      } catch (e) {
        debugger
        console.log(`ERROR, caught error fetching from API endpoint`); // eslint-disable-line no-console
        console.log(e); // eslint-disable-line no-console
        return "ERROR, see console";
      }
    }
  }
};
</script>
