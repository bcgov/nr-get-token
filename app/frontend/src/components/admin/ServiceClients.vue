<template>
  <v-card>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Service Clients</v-card-title>
    </v-toolbar>
    <v-container>
      <!-- search input -->
      <div class="kc-search">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="pb-5"
        ></v-text-field>
      </div>

      <v-alert v-if="showAlert" :type="alertType" tile dense>{{alertMessage}}</v-alert>

      <!-- table header -->
      <v-data-table
        class="kc-table"
        :headers="headers"
        :items="serviceClients"
        :items-per-page="10"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
        :expanded.sync="expanded"
        item-key="acronym"
        show-expand
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <table class="kc-nested-table">
              <!-- environments -->
              <tr>
                <td width="40px"></td>
                <td>
                  <strong>created:</strong>
                </td>
                <td>{{ (item.environments.DEV) ? new Date(item.environments.DEV.created).toLocaleDateString() : '' }}</td>
                <td>{{ (item.environments.TEST) ? new Date(item.environments.TEST.created).toLocaleDateString() : '' }}</td>
                <td>{{ (item.environments.PROD) ? new Date(item.environments.PROD.created).toLocaleDateString() : '' }}</td>
              </tr>

              <!-- users -->
              <tr>
                <td width="25px"></td>
                <td>
                  <strong>users:</strong>
                </td>
                <td :colspan="headers.length - 2">
                  <template
                    v-for="user in item.users"
                  >{{ user.user.firstName + ' ' + user.user.lastName + ' - ' + user.user.email }}</template>
                </td>
              </tr>

              <!-- app details -->
              <tr class="last">
                <td></td>
                <td>
                  <strong>project name:</strong>
                </td>
                <td :colspan="3">{{ item.name }}</td>
              </tr>
            </table>
          </td>
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
        { text: 'Application', align: 'start', value: 'acronym' },
        { text: 'DEV', value: 'dev'},
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
          const data = response.data;
          const clients = Object.keys(data).map(k => {
            let client = data[k];
            return {
              acronym: client.acronym,
              name: client.name,
              dev: client.environments.DEV,
              test: client.environments.TEST,
              prod: client.environments.PROD,
              environments: client.environments,
              users: client.users
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
.kc-search {
  width: 100%;
  max-width: 20em;
  float: right;
}
.kc-table{
  clear: both;
}
.kc-table >>> tr.v-data-table__expanded.v-data-table__expanded__row td {
  border-bottom: 0 !important;
}
.kc-table >>> tr.v-data-table__expanded.v-data-table__expanded__content {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.kc-table tr.last td {
  border-bottom: 1px !important;
  padding-bottom: 10px;
}
.kc-nested-table {
  width: 100%;
}
.kc-nested-table td {
  height: auto;
  border-bottom: 0 !important;
  font-size: 90% !important;
  color: gray;
}
</style>
