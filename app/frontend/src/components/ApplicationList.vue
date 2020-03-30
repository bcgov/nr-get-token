<template>
  <v-container>
    <h2>My Applications</h2>
    <p>*Submit the Request Account form to add a new application</p>
    <br />
    <v-container fluid class="px-0">
      <v-row dense>
        <v-col cols="12" md="4" xl="2" class="my-app-card">
          <BaseActionCard linkName="RequestAccount">
            <div class="new-app text-center">
              <h3>Add a New Application</h3>
              <v-icon large color="blue darken-4">mdi-plus-circle</v-icon>
            </div>
          </BaseActionCard>
        </v-col>
        <v-col
          v-for="acr in acronyms"
          :key="acr.acronym"
          cols="12"
          md="4"
          xl="2"
          class="my-app-card"
        >
          <BaseActionCard linkName="Application" :linkParams="acr">
            <div class="app-link">
              <h3>{{acr.acronym}}</h3>
              <div class="env-statuses">
                <v-skeleton-loader
                  type="list-item-three-line"
                  :loading="!moduleLoaded"
                  transition="scale-transition"
                >
                  <p v-html="setClientTexts(acr)" />
                </v-skeleton-loader>
              </div>
            </div>
          </BaseActionCard>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { KcEnv } from '@/utils/constants';
import { buildClientStatusSpan } from '@/utils/util.js';

export default {
  name: 'ApplicationList',
  created() {
    this.loadModule();
  },
  computed: {
    ...mapGetters('user', ['acronyms', 'moduleLoaded'])
  },
  methods: {
    ...mapActions('user', ['loadModule']),
    setClientTexts(acr) {
      return `${buildClientStatusSpan(KcEnv.DEV, acr.clientStatus && acr.clientStatus.dev)}<br />
              ${buildClientStatusSpan(KcEnv.TEST, acr.clientStatus && acr.clientStatus.test)}<br />
              ${buildClientStatusSpan(KcEnv.PROD, acr.clientStatus && acr.clientStatus.prod)}`;
    }
  }
};
</script>

<style scoped>
.my-app-card {
  padding-right: 2rem;
  margin-bottom: 2rem;
  min-height: 9rem;
}

.new-app h3 {
  color: grey;
  margin-bottom: 2.5rem;
  font-weight: 400;
}

.app-link h3 {
  color: #38598a;
  margin-bottom: 2rem;
  font-weight: 400;
}
</style>
