<template>
  <div>
    <div class="text-xs-center py-5" v-if="!this.healthCheck">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else-if="this.healthCheck ==='error'" class="px-3 py-3">
      <v-alert :value="true" color="error" icon="warning" outline>Error connecting to GETOK API.</v-alert>
    </div>
    <div v-else>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <div>
              <h3 class="headline mb-0">WebADE API</h3>
              {{healthCheck.endpoints[0].endpoint}}
              <v-layout row>
                <v-flex xs6>Service Client access</v-flex>
                <v-flex xs6>
                  <span v-html="this.getStatus(healthCheck.endpoints[0].authenticated)"></span>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs6>Has expected scope</v-flex>
                <v-flex xs6>
                  <span v-html="this.getStatus(healthCheck.endpoints[0].authorized)"></span>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs6>Top level endpoint return</v-flex>
                <v-flex xs6>
                  <span v-html="this.getStatus(healthCheck.endpoints[0].healthCheck)"></span>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>

          <v-flex xs12>
            <div>
              <h3 class="headline mb-0">Common Messaging API</h3>
              {{healthCheck.endpoints[1].endpoint}}
              <v-layout row>
                <v-flex xs6>Service Client access</v-flex>
                <v-flex xs6>
                  <span v-html="this.getStatus(healthCheck.endpoints[1].authenticated)"></span>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs6>Has expected scope</v-flex>
                <v-flex xs6>
                  <span v-html="this.getStatus(healthCheck.endpoints[1].authorized)"></span>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs6>Top level endpoint return</v-flex>
                <v-flex xs6>
                  <span v-html="this.getStatus(healthCheck.endpoints[1].healthCheck)"></span>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState(['healthCheck']),
  methods: {
    getStatus(status) {
      return status
        ? '<i aria-hidden="true" class="v-icon material-icons theme--light success--text">thumb_up</i>'
        : '<i aria-hidden="true" class="v-icon material-icons theme--light error--text">thumb_down</i>';
    }
  }
};
</script>

<style>
</style>
