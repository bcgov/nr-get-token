<template>
  <v-container>
    Applications
    <br />
    <BaseActionCard linkName="Application" :linkParams="acronym">Test</BaseActionCard>
  </v-container>
</template>

<script>
export default {
  name: 'ApplicationList',
  data: () => ({
    acronym: { acronym: 'XXX' }
  })
};
</script>
