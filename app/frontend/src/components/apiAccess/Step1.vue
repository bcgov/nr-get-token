<template>
  <v-container class="pl-0">
    <h2 class="pb-8">API Access for Common Services</h2>
    <p>Your application has a service client with access to:</p>
    <ul>
      <li>Common Hosted Email Service</li>
      <li>Common Document Generation Service</li>
    </ul>
    <h2 class="mt-8 pb-2">Service Client Status</h2>
    <p>
      * Available each service client in order:
      <strong>DEV - TEST - PROD</strong>
    </p>

    <v-skeleton-loader
      type="list-item-three-line"
      :loading="!clientStatusLoaded"
      transition="scale-transition"
    >
      <v-container>
        <v-row>
          <v-col cols="6">
            <ul>
              <li>DEV: Available</li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" block @click="setStep(2)">Get Token for Dev</v-btn>
          </v-col>
          <v-col cols="6">
            <ul>
              <li>TEST: Available</li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" block @click="setStep(2)">Get Token for Test</v-btn>
          </v-col>
          <v-col cols="6">
            <ul>
              <li>PROD: Available</li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" block @click="setStep(2)">Get Token for Prod</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ApiAccessStep1',
  computed: {
    ...mapGetters('apiAccess', ['clientStatusLoaded'])
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep'])
  }
};
</script>

