<template>
  <v-container>
    <div class="mx-auto mb-8 alert info pa-4" style="max-width: 800px;">
      <h3 style="color: white !important">Attention GETOK users!</h3>
      <p class="mt-4" style="color: white !important">Access to our hosted services is migrating to the API Services Portal at
        <a style="color: white !important; text-decoration: underline !important; font-weight: bold" target=" _blank" href="https://api.gov.bc.ca/">api.gov.bc.ca</a>
        <br>After December 2022, your credentials obtained through GETOK will no longer work.<br>For more guidance on this transition, please read
        <a style="color: white !important; text-decoration: underline !important; font-weight: bold" target=" _blank" href="https://github.com/bcgov/common-service-showcase/wiki/CSB-2022-005">more details on our Wiki.</a>
      </p>
    </div>
    <h1 class="text-center my-8">GETOK Common Service Onboarding</h1>
    <v-card class="mx-auto mb-8" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title class="px-3">How It Works</v-toolbar-title>
      </v-toolbar>
      <div class="pa-6">
        <ul>
          <li class="my-2">
            <strong>Existing Users:</strong> Manage your application from
            <router-link :to="{ name: 'MyApps' }">"My Applications"</router-link>
          </li>
          <li class="my-2">
            <strong>Get Token for your application:</strong>
            follow the order of
            <strong>Dev - Test - Prod</strong>
          </li>
        </ul>
      </div>
    </v-card>

    <v-card class="mx-auto mb-8" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title class="px-3">Invite Your Team Members</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="pa-6">
        <ul>
          <li
            class="my-2"
          >You can invite your team to manage your application, each team member can get access to API and invite/remove team members.</li>
        </ul>
      </div>
    </v-card>

    <v-card class="mx-auto mb-8" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title class="px-3">Common Service API</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="pa-6">
        <ul>
          <li
            class="my-2"
            v-for="item in KeycloakCommonServiceList"
            :key="item.name"
          >{{ item.abbreviation.toUpperCase() }} - ({{ item.name }})</li>
        </ul>
      </div>
    </v-card>

    <v-card class="mx-auto" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title class="px-3">Documentation</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="pa-6">
        <ul>
          <li
            class="my-2"
          >Please read the <a href="https://bcgov.github.io/common-service-showcase/onboarding/aps.html">documentation</a> for Common Service APIs. You can easily test all the API calls with the <a href="https://bcgov.github.io/common-service-showcase/assets/files/common_services_postman_collection.json" target="_blank">POSTMAN collection</a>. We also have the <a href="https://github.com/bcgov/nr-get-token/wiki" target="_blank">Wiki</a> with useful resources for any team interested in using Common Services. To read more go to <a href="https://bcgov.github.io/common-service-showcase/onboarding/aps.html">"Documentation".</a>
          </li>
        </ul>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import {
  CommonServiceList,
  CommonServiceTypes
} from '@/utils/commonServices.js';

export default {
  name: 'Welcome',
  data() {
    return {
      KeycloakCommonServiceList: CommonServiceList.filter(
        x => x.type === CommonServiceTypes.KEYCLOAK
      )
    };
  }
};
</script>
