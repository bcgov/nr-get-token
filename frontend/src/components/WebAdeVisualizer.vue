<template>
  <v-container>
    <v-progress-linear v-if="searching" :indeterminate="true"></v-progress-linear>
    <p
      v-if="!hasReadAllWebade"
    >You must be authorized for an application acronym to view its WebADE configuration details.</p>
    <p v-if="hasReadAllWebade">
      <v-icon>info</v-icon>You have been authorized to use the Configuration Viewer for all WebADE application acronyms.
      Client passwords, or preferences that are marked as secret are not returned by the WebADE REST API.
    </p>
    <p v-if="!hasReadAllWebade">
      You can apply for access to an acronym by contacting the GETOK team. (
      <a
        href="mailto:NR.CommonServiceShowcase@gov.bc.ca?subject=GETOK Access to <acronym> - <idir>"
      >
        <v-icon>email</v-icon>
      </a> )
    </p>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-layout>
          <v-flex xs12 md2>
            <v-text-field
              v-if="hasReadAllWebade"
              v-model="acronym"
              :rules="acronymRules"
              label="Application Acronym"
              required
              :mandatory="true"
            ></v-text-field>

            <v-select
              v-if="!hasReadAllWebade"
              v-model="acronym"
              :items="acronyms"
              label="Application Acronym"
              required
              :mandatory="true"
            ></v-select>
          </v-flex>

          <v-flex xs12 md2>
            <v-select
              v-model="environment"
              required
              :mandatory="true"
              :rules="environmentRules"
              :items="webadeEnvironments"
              label="ISSS Environment"
            ></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-btn color="success" @click="search">Search</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>

    <div v-if="resultFound">
      <v-textarea
        auto-grow
        readonly
        label="WebADE Application Configuration"
        v-model="webAdeConfig"
        class="jsonText"
      ></v-textarea>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: function() {
    return {
      webadeEnvironments: ['INT', 'TEST', 'PROD'],
      valid: false,
      acronym: '',
      acronymRules: [v => !!v || 'Acronym is required'],
      environment: '',
      environmentRules: [v => !!v || 'Environment is required']
    };
  },
  computed: {
    ...mapGetters('auth', ['acronyms', 'hasAcronyms', 'hasReadAllWebade']),
    ...mapGetters('webadeVisualizer', [
      'searching',
      'webAdeConfig',
      'resultFound'
    ])
  },
  methods: {
    async search() {
      if (this.$refs.form.validate()) {
        this.$store.commit('webadeVisualizer/setSearching', true);
        this.$store.commit('setResultFound', false);

        await this.$store.dispatch('webadeVisualizer/getWebAdeConfig', {
          webAdeEnv: this.environment,
          acronym: this.acronym
        });

        this.$store.commit('webadeVisualizer/setSearching', false);
      }
    }
  }
};
</script>
