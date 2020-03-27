<template>
  <v-card>
    <template>
      <v-card-title>
        Registered Service Clients
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-alert v-if="showAlert" :type="alertType" tile dense>{{alertMessage}}</v-alert>

      <v-data-table
        class="kc-table"
        dense
        :headers="headers"
        :items="serviceClients"
        :items-per-page="5"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:item.dev="{item}">
          <v-icon v-if="item.dev" color="green">check</v-icon>
        </template>

        <template v-slot:item.test="{item}">
          <v-icon v-if="item.test" color="green">check</v-icon>
        </template>

        <template v-slot:item.prod="{item}">
          <v-icon v-if="item.prod" color="green">check</v-icon>
        </template>
      </v-data-table>
    </template>
  </v-card>
</template>

<script>
import keycloakService from '@/services/keycloakService';

export default {
  name: 'Clients',
  data() {
    return {
      // vuetify data table
      search: '',
      headers: [
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'DEV', value: 'dev' },
        { text: 'TEST', value: 'test' },
        { text: 'PROD', value: 'prod' }
      ],
      serviceClients: [],
      loading: true,
      showAlert: false,
      alertType: null,
      alertMessage: ''
    };
  },
  watch: {
    // hide data table progress bar when serviceClients have been returned from backend
    serviceClients() {
      this.loading = false;
    }
  },
  methods: {
    // get table data from frontend service layer
    getData() {
      keycloakService.getServiceClients().then(response => {
        if (response) {
          // reformat data to show in our data table of service clients
          const reduced = response.data.reduce((a, b) => {
            if (!a[b.clientId]) a[b.clientId] = []; //If this type wasn't previously stored
            a[b.clientId].push(b.environment);
            return a;
          }, {});

          const clients = Object.keys(reduced).map(k => {
            return {
              name: k,
              dev: reduced[k].includes('dev'),
              test: reduced[k].includes('test'),
              prod: reduced[k].includes('prod')
            };
          });

          if (clients.length == 0) {
            this.showTableAlert('info', 'No Service Clients found');
          }
          console.log(clients);
          this.serviceClients = clients;

        } else {
          this.showTableAlert('error', 'No response from server');
        }
      });
    },
    showTableAlert(typ, msg) {
      this.showAlert = true;
      this.alertType = typ;
      this.alertMessage = msg;
      this.loading = false;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
