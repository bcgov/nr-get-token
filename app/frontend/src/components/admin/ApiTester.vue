<template>
  <v-card>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>API Tester</v-card-title>
    </v-toolbar>
    <v-form @submit.prevent="testApi">
      <v-container>
        <v-text-field
          v-model="form.path"
          hint="Enter the relative API path after /api/v1"
          label="Relative Path"
          required
        />
        <v-textarea
          v-if="response"
          v-model="response"
          auto-grow
          filled
          label="API Response"
          readonly
          rows="1"
        />
      </v-container>
      <v-card-actions>
        <v-btn class="BC-Gov-PrimaryButton light" text @click="resetForm">
          <v-icon left>mdi-refresh</v-icon>
          <span>Reset</span>
        </v-btn>
        <v-spacer />
        <v-btn class="BC-Gov-PrimaryButton" text :loading="loading" @click="testApi">
          <v-icon left>mdi-hexagon-multiple-outline</v-icon>
          <span>Test</span>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import testerService from '@/services/testerService';

export default {
  name: 'ApiTester',
  data() {
    return {
      form: {},
      loading: false,
      response: undefined
    };
  },
  methods: {
    resetForm() {
      this.form = {};
      this.response = undefined;
    },
    testApi() {
      this.loading = true;
      testerService
        .getTestResponse(this.form.path)
        .then(response => {
          this.response = JSON.stringify(response.data, null, 2);
        })
        .catch(error => {
          this.response = error;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
