<template>
  <v-container>
    <h1 class="text-center my-8">GETOK Common Service Onboarding</h1>
    <v-card class="mx-auto mb-8" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title class="px-3">How It Workss</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="pa-6">
        <ul>
          <li class="my-2">
            <strong>New User:</strong> Go to
            <router-link :to="{ name: 'RequestAccount' }">"Request Account"</router-link>and submit the form to add your application.
            <br />* Check your email for the confirmation, then you’re ready to go!
          </li>
          <li class="my-2">
            <strong>Existing User:</strong> Manage your application from
            <router-link :to="{ name: 'MyApps' }">"My Applications"</router-link>or
            <router-link :to="{ name: 'RequestAccount' }">"Request Account"</router-link>for a new application
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
        <v-toolbar-title class="px-3">Invite Your Team member</v-toolbar-title>
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
          >Please read the <router-link :to="{ name: 'Documentation' }">documenation</router-link> for Common Service APIs. You can easily test all the API calls with the <a href="https://bcgov.github.io/common-service-showcase/assets/files/common_services_postman_collection.json" target="_blank">POSTMAN collection</a>. We also have the <a href="https://github.com/bcgov/nr-get-token/wiki" target="_blank">Wiki</a> with useful resources for any team interested in using Common Services. To read more go to <router-link :to="{ name: 'Documentation' }">"Documentation"</router-link>
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
