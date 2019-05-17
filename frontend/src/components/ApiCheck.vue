<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 md5>
        <v-form @submit.prevent="testApi">
          <v-text-field v-model="testRoute" label="Endpoint" required></v-text-field>
          <v-btn color="success" @click="testApi">Test</v-btn>
        </v-form>
      </v-flex>
      <v-flex xs12 md6 offset-md1>
        <v-textarea
          v-model="apiCheckResponse"
          rows="1"
          placeholder="The response from the api test"
          auto-grow
          readonly
          label="Api Response"
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { ApiRoutes } from '@/utils/constants.js';
import { mapState } from 'vuex';

export default {
  data: function() {
    return {
      testRoute: ApiRoutes.HEALTH,
      apiResponse: ''
    };
  },
  computed: mapState(['apiCheckResponse']),
  methods: {
    testApi() {
      this.$store.dispatch('getApiCheck', this.testRoute);
    }
  }
};
</script>
