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
                  :loading="waiting"
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

export default {
  name: 'ApplicationList',
  data: () => ({
    // TEMP for testing skeletons
    waiting: true
  }),
  computed: {
    ...mapGetters('user', ['acronyms'])
  },
  methods: {
    ...mapActions('user', ['getUserAcronyms', 'fillInAcronymClientStatus']),
    setClientTexts(acronymObj) {
      return `${this.buildClientSpan('Dev', acronymObj.devStatus)}
              <br />${this.buildClientSpan('Test', acronymObj.testStatus)}
              <br />${this.buildClientSpan('Prod', acronymObj.prodStatus)}`;
    },
    buildClientSpan(envLabel, status) {
      const cls = status ? 'green--text' : '';
      const txt = status ? 'Available' : 'Not Available';
      return `${envLabel}: <span class="${cls}">${txt}</span>`;
    }
  },
  async mounted() {
    //TODO: consider moving getUserAcronyms to on login instead of this component
    await this.getUserAcronyms();

    this.waiting = true;
    await this.fillInAcronymClientStatus();
    this.waiting = false;
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
