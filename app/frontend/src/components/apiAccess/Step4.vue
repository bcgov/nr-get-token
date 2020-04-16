<template>
  <v-container>
    <h2 class="green--text text--darken-2 text-center mb-12">
      <v-icon large color="green darken-2">check_circle</v-icon>API Documentation and Usage
    </h2>
    <p class="mb-12">
      This service client can be used to make REST API calls and an example Postman collection is provided.
      <br />Fetch a new token using the service client and password against the token endpoint (see postman collection) and use that token in your bearer header.
    </p>

    <div>
      <ul>
        <li v-for="item in KeycloakCommonServiceList" v-bind:key="item.name" class="mb-5">
          {{item.name}}
          <br />
          <v-row>
            <v-col cols="6">
              <a :href="item.apiDocLink" target="_blank">
                <strong>API DOCS</strong>
                <v-btn color="primary" icon large>
                  <v-icon>open_in_new</v-icon>
                </v-btn>
              </a>
            </v-col>
            <v-col cols="6">
              <a
                class="buttonLink"
                :href="`../../files/${item.postmanCollection}`"
                :download="item.postmanCollection"
                target="_blank"
              >
                <strong>Postman Collection</strong>
                <v-btn color="primary" icon large>
                  <v-icon>cloud_download</v-icon>
                </v-btn>
              </a>
            </v-col>
          </v-row>
        </li>
      </ul>
    </div>

    <v-row class="mt-12">
      <v-col cols="6" offset="3">
        <v-btn color="primary" block depressed @click="finish">
          <span>Finish</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import {
  CommonServiceList,
  CommonServiceTypes
} from '@/utils/commonServices.js';

export default {
  name: 'ApiAccessStep4',
  data() {
    return {
      KeycloakCommonServiceList: CommonServiceList.filter(
        x => x.type === CommonServiceTypes.KEYCLOAK
      )
    };
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep']),
    finish() {
      this.$router.push({ name: 'MyApps' });
      this.setStep(1);
    }
  }
};
</script>
