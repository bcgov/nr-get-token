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
      <!-- table alert -->
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
        <!-- environments -->
        <template #[`item.dev`]="{item}">
          <div v-if="item.dev">
            <v-tooltip top>
              <template #activator="{ on }">
                <v-icon color="green" v-on="on">check</v-icon>
              </template>
              <span>Keycloak environment last modified: {{ formatEnvDate(item.environments.DEV) }}</span>
            </v-tooltip>
          </div>
        </template>
        <template #[`item.test`]="{item}">
          <div v-if="item.test">
            <v-tooltip top>
              <template #activator="{ on }">
                <v-icon color="green" v-on="on">check</v-icon>
              </template>
              <span>Keycloak environment last modified: {{ formatEnvDate(item.environments.TEST) }}</span>
            </v-tooltip>
          </div>
        </template>
        <template #[`item.prod`]="{item}">
          <div v-if="item.prod">
            <v-tooltip top>
              <template #activator="{ on }">
                <v-icon color="green" v-on="on">check</v-icon>
              </template>
              <span>Keycloak environment last modified: {{ formatEnvDate(item.environments.PROD) }}</span>
            </v-tooltip>
          </div>
        </template>

        <!-- expanded row -->
        <template #expanded-item="{ headers, item }">
          <td :class="[responsiveCell]"></td>
          <td :colspan="headers.length - 1" :class="[responsiveCell]">
            <div class="kc-expanded">
              <!-- app details -->
              <strong>Application Name: </strong>
              <span>{{ item.name }}</span>
            </div>

            <div class="kc-expanded">
              <!-- app details -->
              <strong>Ministry: </strong>
              <span>{{ item.acronymDetails.ministry }}</span>
            </div>

            <div class="kc-expanded">
              <!-- app details -->
              <strong>Contact: </strong>
              <span>{{ item.acronymDetails.contact }}</span>
            </div>

            <div class="kc-expanded">
              <!-- app details -->
              <strong>Acronym Created: </strong>
              <span>{{ formatDate(item.acronymDetails.createdAt) }}</span>
            </div>

            <div class="kc-expanded">
              <!-- users -->
              <strong>Users: </strong>
              <ul>
                <li
                  v-for="(user, index) in item.users"
                  :key="index"
                >{{ user.user.firstName + ' ' + user.user.lastName + ((item.users.length > (index + 1)) ? ',' : '') }}</li>
              </ul>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-container>
  </v-card>
</template>

<script>
import keycloakService from '@/services/keycloakService';

export default {
  name: 'Clients',
  computed: {
    responsiveCell () {
      return (this.$vuetify.breakpoint.name == 'xs') ? 'v-data-table__mobile-table-row' : '';
    }
  },
  data() {
    return {
      // vuetify data table
      search: '',
      headers: [
        { text: '', value: 'data-table-expand' },
        { text: 'Application', align: 'start', value: 'acronym' },
        { text: 'DEV', value: 'dev' },
        { text: 'TEST', value: 'test' },
        { text: 'PROD', value: 'prod' }
      ],
      serviceClients: [],
      loading: true,
      showAlert: false,
      alertType: null,
      alertMessage: '',
      expanded: []
    };
  },
  methods: {

    formatEnvDate(env) {
      return (env && env.created) ?  this.formatDate(env.created): 'N/A';
    },
    formatDate(date){
      return (date) ? new Date(date).toLocaleString() : 'N/A';
    },
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
              acronymDetails: client.acronymDetails,
              dev: client.environments.DEV,
              test: client.environments.TEST,
              prod: client.environments.PROD,
              environments: client.environments,
              users: client.users
            };
          });

          if (!clients.length) {
            // TODO: use a base alert component if one has been added to the project
            this.showTableAlert('info', 'No Service Clients found');
          }
          this.serviceClients = clients;
        })
        .catch(() => {
          // TODO: use a base alert component if one has been added to the project
          this.showTableAlert('error', 'No response from server');
        });
    },
    showTableAlert(typ, msg) {
      this.showAlert = true;
      this.alertType = typ;
      this.alertMessage = msg;
      this.loading = false;
    },
  },
  mounted() {
    this.getData();
  },
  watch: {
    // hide data table progress bar when serviceClients have been returned from backend
    serviceClients() {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.kc-search {
  width: 100%;
  max-width: 20em;
  float: right;
}
.kc-table {
  clear: both;
}
.kc-table >>> tr.v-data-table__expanded__row td {
  border-bottom: 0 !important;
}
.kc-table >>> tr.v-data-table__expanded__content {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.kc-table >>> tr.v-data-table__expanded__content td {
  padding-bottom: 1em;
}
div.kc-expanded {
  font-size: 85% !important;
  color: #494949 !important;
}
div.kc-expanded strong {
  font-weight: bolder;
  margin-right: .5em;
  display: inline-block;
}
div.kc-expanded ul {
  display: inline;
  padding: 0;
}
div.kc-expanded ul li {
  display: inline;
  margin-right: 1rem;
}
/* mobile view */
tr.v-data-table__expanded__content
  td.v-data-table__mobile-table-row:nth-child(1) {
  display: none !important;
}
tr.v-data-table__expanded__content
  td.v-data-table__mobile-table-row:not(:nth-child(1)) {
  padding: 0;
}
td.v-data-table__mobile-table-row div.kc-expanded {
  padding: 0.2rem 1rem;
}
</style>
