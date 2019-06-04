<template>
  <v-container v-if="!isAuthenticated">
    <h1>Not Logged In</h1>
  </v-container>

  <v-container v-else>
    <v-layout wrap>
      <v-flex xs4>
        <v-img :src="require('@/assets/images/tokey.svg')" contain height="180" position="right"></v-img>
      </v-flex>
      <v-flex xs8>
        <v-img
          :src="require('@/assets/images/Get-Token_md.png')"
          class="my-3"
          contain
          height="150"
          position="left"
        ></v-img>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="sectionCard">
          <v-toolbar card color="grey lighten-3">
            <v-toolbar-title>Submit Application Configuration</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  small
                  color="primary"
                  v-on="on"
                  @click.stop="dialog = true"
                  @click="getHealthCheck"
                >
                  <v-icon>healing</v-icon>
                </v-btn>
              </template>
              <span>API Health Check</span>
            </v-tooltip>

            <v-dialog v-model="dialog" width="600">
              <v-card>
                <v-toolbar color="light-blue" dark>
                  <v-icon dark right class="mr-2">healing</v-icon>

                  <v-toolbar-title class="text-xs-center">API Health Check</v-toolbar-title>

                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn flat icon color="white" v-on="on" @click="getHealthCheck">
                        <v-icon>cached</v-icon>
                      </v-btn>
                    </template>
                    <span>Refresh</span>
                  </v-tooltip>
                </v-toolbar>

                <HealthCheck/>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="dialog = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <div>
            <v-alert
              :value="configSubmissionSuccess"
              type="success"
              transition="scale-transition"
            >{{configSubmissionSuccess}}</v-alert>
            <v-alert
              :value="configSubmissionError"
              type="error"
              transition="scale-transition"
            >{{configSubmissionError}}</v-alert>
          </div>
          <v-layout row wrap>
            <v-flex xs12 md5>
              <ConfigForm></ConfigForm>
            </v-flex>
            <v-flex xs12 md6 offset-md1>
              <ConfigGeneratedJson></ConfigGeneratedJson>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-card class="sectionCard">
          <v-toolbar card color="grey lighten-3">
            <v-toolbar-title>TEMP API Tester</v-toolbar-title>
          </v-toolbar>
          <ApiCheck></ApiCheck>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import ApiCheck from './ApiCheck';
import ConfigForm from './ConfigForm';
import ConfigGeneratedJson from './ConfigGeneratedJson';
import HealthCheck from './HealthCheck';

export default {
  name: 'home',
  components: {
    ConfigForm,
    ConfigGeneratedJson,
    ApiCheck,
    HealthCheck
  },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('configForm', [
      'configSubmissionSuccess',
      'configSubmissionError'
    ]),
  },
  methods: {
    getHealthCheck() {
      this.$store.dispatch('checks/getHealthCheckStatus');
    }
  }
};
</script>

<style>
.sectionCard {
  margin-bottom: 20px;
}

.jsonText textarea {
  font-family: 'Courier New', Courier, monospace;
}

.underRadioField {
  padding-left: 32px;
}
</style>
