<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="5">
        <v-form @submit.prevent="testApi">
          <v-text-field v-model="testRoute" label="Endpoint" required></v-text-field>
          <v-btn color="success" @click="testApi">Test</v-btn>
        </v-form>
      </v-col>
      <v-col cols="12" md="6" offset-md="1">
        <v-textarea
          v-model="apiCheckResponse"
          rows="1"
          placeholder="The response from the api test"
          auto-grow
          readonly
          label="Api Response"
        ></v-textarea>
      </v-col>
    </v-row>
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
  computed: mapState('checks', ['apiCheckResponse']),
  methods: {
    testApi() {
      this.$store.dispatch('checks/getApiCheck', this.testRoute);
    }
  }
};
</script>
