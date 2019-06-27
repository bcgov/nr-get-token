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
        <v-list subheader v-for="endpoint in healthCheck.endpoints" v-bind:key="endpoint.endpoint">
          <v-subheader>{{ endpoint.name }}</v-subheader>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Service Client access</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action v-html="getStatus(endpoint.authenticated)"></v-list-tile-action>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Has expected scope</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action v-html="getStatus(endpoint.authorized)"></v-list-tile-action>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Top level endpoint return</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action v-html="getStatus(endpoint.healthCheck)"></v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState('checks', ['healthCheck']),
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
.v-list__tile__content {
  padding-left: 15px;
}
</style>
