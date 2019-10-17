<template>
  <div>
    <div class="text-center py-5" v-if="!this.healthCheck">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else-if="this.healthCheck ==='error'" class="px-3 py-3">
      <v-alert :value="true" tile color="error" icon="warning" outline>Error connecting to GETOK API.</v-alert>
    </div>
    <div v-else>
      <v-container fluid>
        <v-list subheader v-for="endpoint in healthCheck.endpoints" v-bind:key="endpoint.endpoint">
          <v-subheader>{{ endpoint.name }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Service Client access</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action v-html="getStatus(endpoint.authenticated)"></v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Has expected scope</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action v-html="getStatus(endpoint.authorized)"></v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Top level endpoint return</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action v-html="getStatus(endpoint.healthCheck)"></v-list-item-action>
          </v-list-item>
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
