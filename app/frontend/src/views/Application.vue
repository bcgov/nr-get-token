<template>
  <v-container>
    <BaseSecure>My Applications > {{acronym}}</BaseSecure>
  </v-container>
</template>

<script>
export default {
  name: 'Application',
  props: ['acronym']
};
</script>
