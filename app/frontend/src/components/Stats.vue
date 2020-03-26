<template>
  <v-container>
    <template>
      <h4 class="pb-5">Registered Service Clients:</h4>
      <v-data-table :headers="headers" :items="serviceClients" :items-per-page="2"></v-data-table>
    </template>
  </v-container>
</template>


<script>
import keycloakService from '@/services/keycloakService';

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
        }
      ]
      */
    };
  },

  methods: {
    // get table data from frontend service layer
    getData() {

      keycloakService.getServiceClients().then(response => {

        if (response) {

          console.log('hmmm');
          //build a simpler 'output' array of the data
          const output = [];

          response.data.forEach(function(sc) {
            // if array item doesnt exist
            if (output[sc.clientId] == undefined) {
              output[sc.clientId] = {};
            }

            // create or update item
            output[sc.clientId]['name'] = sc.clientId;
            output[sc.clientId]['created'] = '-';
            if (sc.realm === 'dev') output[sc.clientId]['dev'] = 1;
            if (sc.realm === 'test') output[sc.clientId]['test'] = 1;
            if (sc.realm === 'prod') output[sc.clientId]['prod'] = 1;
          });

          console.log(output);

          return output;
        }
      });


    }
  }
};

// // if clientId not in output array
// if (output.filter(i => i.name = sc.clientId).length == 0) {
//   // add all values to a new item in output array
//   output.push([
//     {
//       name: sc.clientId,
//       created: '-',
//       dev: sc.realm == 'dev' ? 1 : 0,
//       test: sc.realm == 'test' ? 1 : 0,
//       prod: sc.realm == 'prod' ? 1 : 0
//     }
//   ]);
// }
// // else update that item in array
// else {
//   var realm = sc.realm;
//   var match = output.find( i => i.name = sc.clientId );
//   match[realm] = 1;
</script>
