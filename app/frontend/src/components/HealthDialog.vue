<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on" @click="onHealthClick">
          <v-icon left>healing</v-icon>
          <span>Health Check</span>
        </v-btn>
      </template>
      <span>Check the health of related API endpoints</span>
    </v-tooltip>
    <BaseDialog :show="healthShow" @close-dialog="healthShow = false">
      <template v-slot:title>
        <strong>API Health Check</strong>
      </template>
      <template v-slot:text>
        <v-skeleton-loader
          type="list-item-three-line"
          :loading="!loaded"
          transition="scale-transition"
        >
          <div class="health-list">
            <v-list
              subheader
              v-for="endpoint in healthStatus.endpoints"
              v-bind:key="endpoint.endpoint"
            >
              <h4>{{ endpoint.name }}</h4>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Service Client is valid</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon
                    :color="getStatusColor(endpoint.authenticated)"
                  >{{ getStatusIcon(endpoint.authenticated) }}</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Has expected scope(s)</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon
                    :color="getStatusColor(endpoint.authorized)"
                  >{{ getStatusIcon(endpoint.authorized) }}</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Base endpoint reachable</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon
                    :color="getStatusColor(endpoint.healthCheck)"
                  >{{ getStatusIcon(endpoint.healthCheck) }}</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>
        </v-skeleton-loader>
      </template>
      <template v-slot:button-text>Close</template>
    </BaseDialog>
  </div>
</template>

<script>
import healthService from '@/services/healthService';

export default {
  name: 'HealthDialog',
  data() {
    return {
      healthShow: false,
      healthStatus: {},
      loaded: false
    };
  },
  methods: {
    getHealthCheck() {
      this.healthStatus = {};
      healthService
        .getHealthCheck()
        .then(response => {
          this.healthStatus = response.data;
        })
        .catch(() => {
          this.healthStatus = {};
        })
        .finally(() => {
          this.loaded = true;
        });
    },
    getStatusColor(status) {
      return status ? 'success' : 'error';
    },
    getStatusIcon(status) {
      return status ? 'mdi-thumb-up' : 'mdi-thumb-down';
    },
    onHealthClick() {
      this.healthShow = true;
      this.loaded = false;
      this.getHealthCheck();
    }
  }
};
</script>
