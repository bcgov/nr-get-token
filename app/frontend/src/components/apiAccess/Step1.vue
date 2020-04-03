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
              <li v-html="buildClientStatusSpan(env.DEV, clientStatus.dev)"></li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn class="BC-Gov-PrimaryButton" block text @click="nextStep(env.DEV)">
              <span>Get Token for Dev</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <ul>
              <li v-html="buildClientStatusSpan(env.TEST, clientStatus.test)"></li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn
              class="BC-Gov-PrimaryButton"
              block
              :disabled="!clientStatus.dev"
              text
              @click="nextStep(env.TEST)"
            >
              <span>Get Token for Test</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <ul>
              <li v-html="buildClientStatusSpan(env.PROD, clientStatus.prod)"></li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn
              class="BC-Gov-PrimaryButton"
              block
              :disabled="!clientStatus.test"
              text
              @click="nextStep(env.PROD)"
            >
              <span>Get Token for Prod</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import { KcClientStatus, KcEnv } from '@/utils/constants';
import { buildClientStatusSpan } from '@/utils/util.js';

export default {
  name: 'ApiAccessStep1',
  data() {
    return {
      KcClientStatus: KcClientStatus,
      env: KcEnv
    };
  },
  computed: {
    ...mapGetters('apiAccess', ['clientStatus', 'clientStatusLoaded'])
  },
  methods: {
    ...mapMutations('apiAccess', ['setEnvironment', 'setStep']),
    buildClientStatusSpan,
    nextStep(env) {
      this.setEnvironment(env);
      this.setStep(2);
    }
  }
};
</script>

