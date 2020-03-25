<template>
  <v-container>
    <BaseSecure>
      <div class="app-breadcrumb">
        <span>
          <router-link :to="{ name: 'MyApps' }">My Applications</router-link>
        </span>
        <span>></span>
        <span>{{acronym}}</span>
      </div>
      <v-tabs vertical class="mt-10 getok-tabs">
        <v-tab>API Access</v-tab>
        <v-tab>Team</v-tab>

        <v-tab-item>
          <v-card flat class="pl-12">
            <h2>{{acronym}}</h2>
            <ApiAccess />
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat class="pl-12">
            <h2>{{acronym}}</h2>
            <v-card-text>
              <p class="mb-0">TBA. Users tab coming soon</p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </BaseSecure>
  </v-container>
</template>

<script>
import ApiAccess from '@/components/apiAccess/ApiAccess.vue';

export default {
  name: 'Application',
  components: {
    ApiAccess
  },
  props: ['acronym']
};
</script>

<style lang="scss">
/* Breadcrumb */
.app-breadcrumb {
  margin-top: 0.5em;
  span {
    padding-right: 1em;
  }
}

/* Tab (TODO: if this is used elsewhere in the program, make this style global) */
.getok-tabs {
  .v-tab {
    font-weight: bold;
    justify-content: left;
    &:not(.v-tab--active) {
      background-color: #f2f2f2;
      color: #1a5a96 !important;
      &:hover {
        background-color: #dae8f4;
      }
    }
  }
  .v-tab--active {
    background-color: #1a5a96;
    color: white;
    &:hover {
      background-color: #dae8f4;
      color: #1a5a96;
    }
  }
  .v-tabs-slider {
    display: none;
  }
}
</style>
