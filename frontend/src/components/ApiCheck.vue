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
import { ApiRoutes } from '@/utils/constants.js';

export default {
  data: function() {
    return {
      testRoute: ApiRoutes.STATUS,
      apiResponse: ''
    };
  },
  methods: {
    async testApi() {
      this.apiResponse = await this.callApi();
    },
    async callApi() {
      try {
        const response = await fetch(this.testRoute, {
          method: 'get'
        });
        const body = await response.text();

        return body;
      } catch (e) {
        console.log('ERROR, caught error fetching from API endpoint'); // eslint-disable-line no-console
        console.log(e); // eslint-disable-line no-console
        return 'ERROR, see console';
      }
    }
  }
};
</script>
