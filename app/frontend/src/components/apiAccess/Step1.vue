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
              <li>
                <ClientStatus :env="envs.DEV" :clientStatuses="clientStatus" />
              </li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" block depressed @click="nextStep(envs.DEV)">
              <span v-if="clientStatus.dev">Reset Password</span>
              <span v-else>Get Token for Dev</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <ul>
              <li>
                <ClientStatus :env="envs.TEST" :clientStatuses="clientStatus" />
              </li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="primary"
              block
              depressed
              :disabled="!clientStatus.dev"
              @click="nextStep(envs.TEST)"
            >
              <span v-if="clientStatus.test">Reset Password</span>
              <span v-else>Get Token for Test</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <ul>
              <li>
                <ClientStatus :env="envs.PROD" :clientStatuses="clientStatus" />
              </li>
            </ul>
          </v-col>
          <v-col cols="6">
            <v-btn
              class="primary"
              block
              depressed
              :disabled="!clientStatus.test"
              @click="nextStep(envs.PROD)"
            >
              <span v-if="clientStatus.prod">Reset Password</span>
              <span v-else>Get Token for Prod</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import ClientStatus from '@/components/apiAccess/ClientStatus.vue';
import { KcClientStatus, KcEnv } from '@/utils/constants';

export default {
  name: 'ApiAccessStep1',
  components: {
    ClientStatus
  },
  data() {
    return {
      KcClientStatus: KcClientStatus,
      envs: KcEnv
    };
  },
  computed: {
    ...mapGetters('apiAccess', ['clientStatus', 'clientStatusLoaded'])
  },
  methods: {
    ...mapMutations('apiAccess', ['setEnvironment', 'setStep']),
    nextStep(env) {
      this.setEnvironment(env);
      this.setStep(2);
    }
  }
};
</script>

