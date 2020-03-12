<template>
  <v-container>
    <h1 class="text-center mb-10">GETOK Common Service Onboarding</h1>
    <v-card class="mx-auto" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title>How It Works</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="pa-2 py-4">
        <ul>
          <li>
            <strong>New User:</strong> Go to
            <router-link :to="{ name: 'RequestAccount' }">"Request Account"</router-link>and submit the form to add your application.
            <br />* Check your email for the confirmation, then you’re ready to go!
          </li>
          <li>
            <strong>Existing User:</strong> Manage your application from
            <router-link :to="{ name: 'MyApps' }">"My Applications"</router-link>or
            <router-link :to="{ name: 'RequestAccount' }">"Request Account"</router-link>for a new application
          </li>
          <li>
            <strong>Get Token for your application:</strong> follow the order of
            <strong>Dev - Test - Prod</strong>
          </li>
        </ul>
      </div>
    </v-card>

    <v-card class="mx-auto" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title>Invite Your Team member</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="pa-2 py-4">
        <ul>
          <li>You can invite your team to manage your application, each team member can get access to API and invite/remove team members.</li>
        </ul>
      </div>
    </v-card>

    <v-card class="mx-auto" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title>Common Service API</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="pa-2 py-4">
        <ul>
          <li
            v-for="item in KeycloakCommonServiceList"
            :key="item.name"
          >{{item.abbreviation.toUpperCase()}} - ({{item.name}})</li>
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

<style scoped>
.v-card {
  margin-bottom: 3rem;
}
ul li {
  margin-bottom: 0.5rem;
}
</style>
