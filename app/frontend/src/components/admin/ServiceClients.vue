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
        <template v-slot:item.dev="{item}">
          <div v-if="item.dev">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon color="green" v-on="on">check</v-icon>
              </template>
              <span>updated: {{ formatEnvDate(item.environments.DEV) }}</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:item.test="{item}">
          <div v-if="item.test">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon color="green" v-on="on">check</v-icon>
              </template>
              <span>updated: {{ formatEnvDate(item.environments.TEST) }}</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:item.prod="{item}">
          <div v-if="item.prod">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon color="green" v-on="on">check</v-icon>
              </template>
              <span>Updated: {{ formatEnvDate(item.environments.PROD) }}</span>
            </v-tooltip>
          </div>
        </template>

        <!-- expanded row -->
        <template v-slot:expanded-item="{ headers, item }">
          <td :class="[responsiveCell]"></td>
          <td :colspan="headers.length - 1" :class="[responsiveCell]">
            <div class="kc-expanded">
              <!-- app details -->
              <strong>Name: </strong>
              <span>{{ item.name }}</span>
            </div>

            <div class="kc-expanded">
              <!-- app details -->
              <strong>Created: </strong>
              <span>{{ formatDate(item.acronymDetails.createdAt) }}</span>
            </div>

            <div class="kc-expanded">
              <!-- users -->
              <strong>Users: </strong>
              <ul>
                <li
                  v-for="user in item.users"
                  :key="user.user.userId"
                >{{ user.user.firstName + ' ' + user.user.lastName + ((item.users.length > 1) ? ',' : '') }}</li>
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
      return (env && env.created) ?  this.formatDate(env.created): '-';
    },
    formatDate(date){
      return new Date(date).toLocaleString();
    },
    // get table data from frontend service layer
    getData() {
      keycloakService
        .getServiceClients()
        .then(response => {
          const data = response.data;
          console.log(data);

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
.kc-table >>> tr.v-data-table__expanded__content td{
  padding-bottom: 1em;
}
div.kc-expanded{
  font-size: 85% !important;
  color: #494949 !important;
}
div.kc-expanded strong {
  font-weight: bolder;
  margin-right: 1em;
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
  padding: .2rem 1rem;
}

.kc-search >>> tr.v-data-table__expanded__content{
  /* border: 1px solid red !important; */
}
</style>
