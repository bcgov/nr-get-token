<template>
  <v-card>
    <v-container>
      <v-card-title>
        Registered Service Clients
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="pb-5"
        ></v-text-field>
      </v-card-title>

      <v-alert v-if="showAlert" :type="alertType" tile dense>{{alertMessage}}</v-alert>

      <v-data-table
        class="kc-table"
        :headers="headers"
        :items="serviceClients"
        :items-per-page="10"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"

        :expanded.sync="expanded"
        item-key="clientId"
        show-expand
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td></td>
          <td :colspan="headers.length - 1">More info {{ item.name }}</td>

        </template>

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
    </v-container>
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
        { text: '', value: 'data-table-expand' },
        { text: 'ID', align: 'start', value: 'clientId' },
        { text: 'DEV', value: 'dev' },
        { text: 'TEST', value: 'test' },
        { text: 'PROD', value: 'prod' },
      ],
      serviceClients: [],
      loading: true,
      showAlert: false,
      alertType: null,
      alertMessage: '',
      expanded: []
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
      keycloakService
        .getServiceClients()
        .then(response => {
          // reformat data to show in our data table of service clients
          const reduced = response.data.reduce((a, b) => {
            if (!a[b.clientId]) a[b.clientId] = []; //If this type wasn't previously stored
            a[b.clientId].push(b.environment);
            a[b.clientId].push(b.name);
            return a;
          }, {});

          const clients = Object.keys(reduced).map(k => {
            return {
              clientId: k,
              name:reduced[k].name,
              dev: reduced[k].includes('dev'),
              test: reduced[k].includes('test'),
              prod: reduced[k].includes('prod')
            };
          });

          if (clients.length == 0) {
            this.showTableAlert('info', 'No Service Clients found');
          }
          this.serviceClients = clients;
        })
        .catch(() => {
          this.showTableAlert('error', 'No response from server');
        });
    },
    showTableAlert(typ, msg) {
      this.showAlert = true;
      this.alertType = typ;
      this.alertMessage = msg;
      this.loading = false;
    },
    clicked(value) {
      this.expanded.push(value);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.kc-table >>> tr.v-data-table__expanded.v-data-table__expanded__row td {
	border-bottom: 0 !important;
}
.kc-table >>> tr.v-data-table__expanded.v-data-table__expanded__content {
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
}
</style>
