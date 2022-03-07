<template>
  <v-card>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Grant Access</v-card-title>
    </v-toolbar>

    <v-skeleton-loader type="article, actions" :loading="loading">
      <v-form @submit.prevent="grantAccess" ref="form" lazy-validation>
        <v-container>
          <v-row>
            <v-col sm="6" lg="4">
              <label>Application Acronym &nbsp;</label>
              <AcronymTooltip />
              <v-combobox
                v-model="selectedAcronym"
                dense
                flat
                hide-no-data
                hint="Select an existing acronym or add a new one"
                :items="acronyms"
                persistent-hint
                required
                :rules="acronymRules"
                single-line
                solo
                outlined
              />
            </v-col>
            <v-col sm="6" lg="4">
              <v-text-field
                class="pt-6"
                dense
                flat
                hint="The IDIR (ex: 'loneil') of the user requesting access"
                label="IDIR"
                persistent-hint
                required
                :rules="idirRules"
                single-line
                solo
                outlined
              />
            </v-col>
          </v-row>
        </v-container>

        {{ selectedAcronym }}
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
      </v-form>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import acronymService from '@/services/acronymService';
import AcronymTooltip from '@/components/AcronymTooltip.vue';
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'AccessGrant',
  components: {
    AcronymTooltip,
  },
  data() {
    return {
      acronymRules: [
        (v) => !!v || 'Acronym is required',
        (v) =>
          v.length <= FieldValidations.ACRONYM_MAX_LENGTH ||
          `Acronym must be ${FieldValidations.ACRONYM_MAX_LENGTH} characters or less`,
        (v) =>
          /^(?:[A-Z]{1,}[_]?)+[A-Z]{1,}$/g.test(v) ||
          'Incorrect format. Hover over ? for details.',
      ],
      idirRules: [(v) => !!v || 'IDIR is required'],
      acronyms: [],
      form: {},
      loading: true,
      response: undefined,
      selectedAcronym: undefined,
      test: undefined,
    };
  },
  methods: {
    resetForm() {
      this.form = {};
      this.response = undefined;
    },
    async getAcronyms() {
      const res = await acronymService.getAllAcronyms();
      this.acronyms = res.data.map((a) => a.acronym).sort();
    },
    async grantAccess() {},
    // testApi() {
    //   this.loading = true;
    //   testerService
    //     .getTestResponse(this.form.path)
    //     .then((response) => {
    //       this.response = JSON.stringify(response.data, null, 2);
    //     })
    //     .catch((error) => {
    //       this.response = error;
    //     })
    //     .finally(() => {
    //       this.loading = false;
    //     });
    // },
  },
  async mounted() {
    await this.getAcronyms();
    this.loading = false;
  },
};
</script>
