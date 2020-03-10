<template>
  <v-container>
    <h2>My Applications</h2>
    <p>*Submit the Request Account form to add a new application</p>
    <br />
    <v-container fluid class="px-0">
      <v-row dense>
        <v-col cols="12" md="4" xl="2" class="my-app-card">
          <BaseActionCard linkName="Secure">
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
              <p class="env-statuses">
                Dev: aaa
                <br />Test: bbb
                <br />Prod: ccc
              </p>
            </div>
          </BaseActionCard>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'ApplicationList',
  data: () => ({
    acronyms: [
      { acronym: 'PEN_RETRIEVAL' },
      { acronym: 'GETOK' },
      { acronym: 'MSSC' }
    ]
  })
};
</script>

<style scoped>
.my-app-card {
  padding-right: 2rem;
  margin-bottom: 2rem;
  min-height: 8rem;
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
.app-link .env-statuses {
  margin-bottom: 0;
}
</style>
