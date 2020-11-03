<template>
  <div>
    <h2 class="mb-2">Resources</h2>
    <hr />
    <h3 class="mb-3">API Docs</h3>
    <ul class="no-bullet">
      <li class="my-2">
        <a
          href="https://ches.pathfinder.gov.bc.ca/api/v1/docs"
        >Common Hosted Email Service</a>
      </li>
      <li class="my-2">
        <a
          href="https://cdogs.pathfinder.gov.bc.ca/api/v2/docs"
        >Common Document Generation Service</a>
      </li>
    </ul>
    <hr class="mt-3" />

    <a
      class="buttonLink"
      href="https://bcgov.github.io/common-service-showcase/assets/files/common_services_postman_collection.json"
      target="_blank"
    >
      <strong>Postman Collection</strong>
      <v-btn color="primary" icon large>
        <v-icon>cloud_download</v-icon>
      </v-btn>
    </a>
    <hr class="mt-2" />
    <h3 class="mb-2">Note</h3>
    <p>
      This service client can be used to make REST API calls and an example Postman collection is provided.
      Fetch a new token using the service client and password against the authorization endpoint (see postman collection)
      and use that token in your bearer header.
    </p>
  </div>
</template>

<script>
import { CommonServiceList, CommonServiceTypes } from '@/utils/commonServices.js';

export default {
  name: 'ResourcesSidebar',
  computed: {
    KeycloakCommonServiceList() {
      return CommonServiceList.filter(x => x.type === CommonServiceTypes.KEYCLOAK);
    }
  }
};
</script>

<style>
ul.no-bullet {
  padding-left: 0;
  list-style-type: none;
}
</style>
