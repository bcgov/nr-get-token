<template>
  <v-container>
    <h2>API Access for Common Services</h2>Contents to go here
    <br />
    <br />
    <br />
    <br />
    <v-btn color="primary" @click="setStep(2)">Get Token for Dev</v-btn>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ApiAccessStep1',
  methods: {
    ...mapMutations('apiAccess', ['setStep'])
  }
};
</script>
