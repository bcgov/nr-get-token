<template>
  <v-container>
    <v-progress-linear v-if="searching" :indeterminate="true" class="mb-2"></v-progress-linear>
    <div v-if="errorMessage">
      <v-alert :value="true" type="error">
        <p>{{errorMessage}}</p>
        <p>If you think you should not have recieved this error, please try logging out and back in.</p>
      </v-alert>
    </div>

    <div>
      <v-tabs vertical>
        <v-tab class="justify-start">
          <v-icon left>description</v-icon>Plain-text password alert
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                <v-icon>info</v-icon>This will search for preferences that meet the search criteria (ie, things labelled with "password", or "secret", or othewise specified) that have the
                <strong>sensitiveDataInd</strong> flag set to
                <strong>false</strong>.
                <br />Supply a Regular Expression for the search term if desired.
              </p>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="prefRegex"
                        :rules="regexRules"
                        label="Preference Name Search Criteria (Regex)"
                        required
                        :mandatory="true"
                      ></v-text-field>
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
              <br />
              <div v-if="searching">
                <p>Building list...</p>
              </div>
              <div v-else>
                <v-simple-table v-if="insecurePasswordsList">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">WebADE Project</th>
                        <th class="text-left">Details</th>
                        <th class="text-left">Preferences</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="app in insecurePasswordsList" :key="app.applicationAcronym">
                        <td>{{ app.applicationAcronym }}</td>
                        <td>
                          <p v-if="!app.enabled" class="red--text">
                            <strong>Disabled</strong>
                          </p>
                          <p>
                            <strong>Name:</strong>
                            {{ app.applicationName }}
                          </p>
                          <p>
                            <strong>Description:</strong>
                            {{ app.applicationDescription}}
                          </p>
                        </td>
                        <td>
                          <ul>
                            <li
                              v-for="pref in app.preferences"
                              :key="pref.name"
                            >{{pref.setName}} => {{ pref.name }}</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <p
                  v-if="insecurePasswordsList && insecurePasswordsList.length == 0"
                >No results could be found for this search.</p>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
  </v-container>
</template>

<script>
import ApiService from '@/common/apiService';

export default {
  data: function() {
    return {
      webadeEnvironments: ['INT', 'TEST', 'PROD'],
      searching: false,
      valid: false,
      prefRegex: 'secret|password',
      regexRules: [v => !!v || 'Enter a Regex to search on'],
      environment: '',
      environmentRules: [v => !!v || 'Environment is required'],
      insecurePasswordsList: null,
      errorMessage: ''
    };
  },
  methods: {
    async search() {
      if (this.$refs.form.validate()) {
        this.searching = true;
        this.insecurePasswordsList = null;
        try {
          const response = await ApiService.getInsecurePasswords(
            this.environment,
            this.prefRegex
          );
          if (response) {
            this.insecurePasswordsList = response;
          } else {
            this.errorMessage = 'Error occurred trying to fetch preferences.';
          }
        } catch (error) {
          this.errorMessage = 'Error occurred trying to fetch preferences.';
        }
        this.searching = false;
      }
    }
  }
};
</script>
