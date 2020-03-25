<template>
  <v-container>
    <template>
      <h4 class="pb-5">Registered Service Clients:</h4>
      <v-data-table
        :headers="headers"
        :items="serviceClients"
        :items-per-page="2"
      ></v-data-table>
    </template>
  </v-container>
</template>


<script>
import statsService from '@/services/statsService';

export default {
  name: 'Stats',
  data() {
    return {
      headers: [
        { text: 'Service Client', align: 'start', value: 'name' },
        { text: 'Created', value: 'created' },
        { text: 'DEV', value: 'dev' },
        { text: 'TEST', value: 'test' },
        { text: 'PROD', value: 'prod' }
      ],
      serviceClients: this.getData()
      /*
      [
        {
          name: 'ABC_ONE',
          created: 159,
          dev: 1,
          test: 0,
          prod: 0
        },
        {
          name: 'DEF_TWO',
          created: 237,
          dev: 1,
          test: 1,
          prod: 0
        },
        {
          name: 'HKI_THREE',
          created: 262,
          dev: 1,
          test: 0,
          prod: 0
        },
        {
          name: 'BED_FOUR',
          created: 305,
          dev: 1,
          test: 1,
          prod: 1
        }
      ]
      */
    };
  },

  methods: {
    // get table data from frontend service layer
    getData() {
      statsService
        .getServiceClients()
        .then(response => {
          if (response) {
            return response;
          }
        });
    }
  },

};
</script>
