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
          <v-icon v-if="item.dev === 1" color="green">check</v-icon>
        </template>

        <template v-slot:item.test="{item}">
          <v-icon v-if="item.test === 1" color="green">check</v-icon>
        </template>

        <template v-slot:item.prod="{item}">
          <v-icon v-if="item.prod === 1" color="green">check</v-icon>
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
      loading: true
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

          // reformat serviceClients data into array of objects that will work for the data table
          var output = [];
          var tmpArray = [];
          response.data.forEach(sc => {
            // if object doesnt exist in tmpArray
            if (tmpArray[sc.clientId] == undefined) {
              //create empty object
              tmpArray[sc.clientId] = {};
            }
            // update object
            tmpArray[sc.clientId].name = sc.clientId;
            if (sc.realm === 'dev') tmpArray[sc.clientId].dev = 1;
            if (sc.realm === 'test') tmpArray[sc.clientId].test = 1;
            if (sc.realm === 'prod') tmpArray[sc.clientId].prod = 1;
          });
          //convert back to numeric array
          for (var items in tmpArray) {
            output.push(tmpArray[items]);
          }
        }
        this.serviceClients = output;
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
