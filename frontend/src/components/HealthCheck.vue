<template>
  <div>
    <div class="text-xs-center py-5" v-if="!this.healthCheck">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else-if="this.healthCheck ==='error'" class="px-3 py-3">
      <v-alert :value="true" color="error" icon="warning" outline>Error connecting to GETOK API.</v-alert>
    </div>
    <div v-else>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <div>
              <h3 class="headline mb-0">WebADE API</h3>
              <v-layout row>
                <v-flex xs6></v-flex>
                <v-flex xs6></v-flex>
              </v-layout>
            </div>
          </v-flex>

          <v-flex xs12>
            <div>
              <h3 class="headline mb-0">Common Messaging API</h3>
              <div>Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam libris qualisque, utroque quaestio accommodare no qui. Et percipit laboramus usu, no invidunt verterem nominati mel. Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae adipisci. Ignota salutandi accusamus in sed, et per malis fuisset, qui id ludus appareat.</div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState(['healthCheck'])
};
</script>

<style>
</style>
