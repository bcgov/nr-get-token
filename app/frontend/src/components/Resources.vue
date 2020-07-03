<template>
  <v-container>
    <h1 class="text-center my-8">Common Services Documentation</h1>
    <v-card class="mx-auto mb-8" max-width="800">
      <v-toolbar flat color="grey lighten-3">
        <v-toolbar-title class="px-3">Resources</v-toolbar-title>
      </v-toolbar>
      <v-simple-table>
        <template>
          <tbody>
            <tr>
              <td>POSTMAN Collection</td>
              <td>
                <p>Use the Common Service Postman Collection to verify your service client credentials and see the APIs in action.</p>
                <ul>
                  <li class="my-2">
                    Get your
                    <a
                      href="https://bcgov.github.io/common-service-showcase/#Onboarding"
                    >service client</a>.
                  </li>
                  <li>
                    Download and install
                    <a href="https://www.postman.com/">POSTMAN</a>.
                  </li>
                  <li class="my-2">
                    Download the
                    <a
                      href="https://bcgov.github.io/common-service-showcase/assets/files/common_services_postman_collection.json"
                    >collection</a>.
                  </li>
                  <li class="my-2">
                    Read the
                    <a
                      href="https://bcgov.github.io/common-service-showcase/assets/files/common_services_postman_readme.md"
                    >guide</a> to setup and run.
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>API Documentation</td>
              <td>
                <p>We do recommend that you read the API documentation before running the collection.</p>
                <ul>
                  <li class="my-2">
                    Common Hosted Email Service (
                    <a href="https://ches-master-9f0fbe-prod.pathfinder.gov.bc.ca/api/v1/docs">CHES</a>).
                  </li>
                  <li class="my-2">
                    Common Document Generation Service (
                    <a
                      href="https://cdogs-master-idcqvl-prod.pathfinder.gov.bc.ca/api/v2/docs#tag/DocGen"
                    >CDOGS</a>).
                  </li>
                </ul>
              </td>
            </tr>

            <tr>
              <td>Common Services Wiki</td>
              <td>
                <ul>
                  <li class="my-2">
                    <a
                      href="https://github.com/bcgov/nr-get-token/wiki"
                      target="_blank"
                    >https://github.com/bcgov/nr-get-token/wiki</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Resources'
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style.scss';

td {
  padding: 2rem;
  border-right: thin solid rgba(0, 0, 0, 0.12);
}
td:first-child {
  font-weight: 800;
  font-size: 120%;
}
@media #{map-get($display-breakpoints, 'sm-and-down')} {
  td {
    display: block;
    border: none !important;
  }
  td:nth-child(2) {
    height: auto;
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
    padding: 1em 2em;
  }
}
</style>
