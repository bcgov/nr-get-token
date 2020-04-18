<template>
  <v-container>
    <v-progress-linear v-if="searching" :indeterminate="true" class="mb-2"></v-progress-linear>
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
        <v-row>
          <v-col cols="12" md="2">
            <div v-if="hasReadAllWebade">
              <v-text-field
                v-model="acronym"
                :rules="acronymRules"
                label="Application Acronym"
                required
                :mandatory="true"
              ></v-text-field>
            </div>
            <div v-else>
              <v-select
                v-model="acronym"
                :items="acronyms"
                label="Application Acronym"
                required
                :mandatory="true"
              ></v-select>
            </div>
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="environment"
              required
              :mandatory="true"
              :rules="environmentRules"
              :items="webadeEnvironments"
              label="ISSS Environment"
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-btn color="success" @click="search">Search</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <div v-if="errorMessage">
      <v-alert :value="true" type="error"><p>{{errorMessage}}</p>
        <p>If you think you should not have recieved this error, please try logging out and back in.</p></v-alert>
    </div>

    <div v-if="webAdeConfig">
      <v-tabs vertical v-on:change="getDependencies">
        <v-tab class="justify-start">
          <v-icon left>description</v-icon>App Config
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>list</v-icon>Dependent Apps
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-textarea
                auto-grow
                readonly
                label="WebADE Application Configuration"
                v-model="webAdeConfig"
                class="jsonText"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div v-if="searching">
                <p>Building dependency list...</p>
              </div>
              <div v-else>
                <v-simple-table v-if="webAdeDependencies">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Application</th>
                        <th class="text-left">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dep in webAdeDependencies" :key="dep.applicationAcronym">
                        <td>{{ dep.applicationAcronym }}</td>
                        <td>
                          <p v-if="!dep.enabled" class="red--text"><strong>Disabled</strong></p>
                          <p><strong>Name:</strong> {{ dep.applicationName }}</p>
                          <p><strong>Description:</strong> {{ dep.applicationDescription}}</p>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <p
                  v-else
                >Could not find any other WebADE applications that are dependent on {{acronym}}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
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
      'errorMessage',
      'searching',
      'webAdeConfig',
      'webAdeDependencies'
    ])
  },
  methods: {
    async search() {
      if (this.$refs.form.validate()) {
        this.$store.commit('webadeVisualizer/setSearching', true);
        await this.$store.dispatch('webadeVisualizer/getWebAdeConfig', {
          webAdeEnv: this.environment,
          acronym: this.acronym
        });
        this.$store.commit('webadeVisualizer/setSearching', false);
      }
    },
    async getDependencies(tabNum) {
      // Only load the big dependency query once they go to the second tab
      // Only query for it if it hasn't been loaded already
      if (tabNum === 1 && !this.webAdeDependencies) {
        this.$store.commit('webadeVisualizer/setSearching', true);
        await this.$store.dispatch('webadeVisualizer/getWebAdeDependencies', {
          webAdeEnv: this.environment,
          acronym: this.acronym
        });
        this.$store.commit('webadeVisualizer/setSearching', false);
      } else {
        this.$store.commit('webadeVisualizer/setSearching', false);
      }
    }
  }
};
</script>
