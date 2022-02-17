<template>
  <v-card>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Grant Access</v-card-title>
    </v-toolbar>

    <v-skeleton-loader
      type="article, actions"
      :loading="loading"
    >
      <!-- <v-form @submit.prevent="testApi">
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
    </v-form> -->
      TBA
      <v-card-actions>
        <v-btn outlined @click="resetForm">
          <v-icon left>mdi-refresh</v-icon>
          <span>Reset</span>
        </v-btn>
        <v-spacer />
        <v-btn color="primary" depressed :loading="loading">
          <v-icon left>add_circle</v-icon>
          <span>Grant Access</span>
        </v-btn>
      </v-card-actions>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
export default {
  name: 'AccessGrant',
  data() {
    return {
      form: {},
      loading: true,
      response: undefined,
    };
  },
  methods: {
    resetForm() {
      this.form = {};
      this.response = undefined;
    },
    async getAcronyms() {},
    // testApi() {
    //   this.loading = true;
    //   testerService
    //     .getTestResponse(this.form.path)
    //     .then(response => {
    //       this.response = JSON.stringify(response.data, null, 2);
    //     })
    //     .catch(error => {
    //       this.response = error;
    //     })
    //     .finally(() => {
    //       this.loading = false;
    //     });
    // }
  },
  async mounted() {
    await this.getAcronyms();
    this.loading = false;
  },
};
</script>
