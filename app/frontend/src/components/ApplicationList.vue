<template>
  <v-container>
    <h2>My Applications</h2>
    <p>*Submit the Request Account form to add a new application</p>
    <br />
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" md="4" lg="2">
          <BaseActionCard linkName="Secure">Add a New Application</BaseActionCard>
        </v-col>
        <v-col v-for="acr in acronyms" :key="acr.acronym" cols="12" md="4" lg="2">
          <BaseActionCard linkName="Application" :linkParams="acr">{{acr.acronym}}</BaseActionCard>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'ApplicationList',
  data: () => ({
    acronyms: [{ acronym: 'XXX' }, { acronym: 'YYY' }, { acronym: 'ZZZ' }]
  })
};
</script>
