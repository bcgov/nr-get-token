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
        <v-tab>History</v-tab>

        <v-tab-item>
          <h2>{{acronym}}</h2>
          <ApiAccess :acronym="acronym" />
        </v-tab-item>

        <v-tab-item>
          <h2>{{acronym}}</h2>
          <Team :acronym="acronym" />
        </v-tab-item>

        <v-tab-item>
          <h2>{{acronym}}</h2>
          <History :acronym="acronym" />
        </v-tab-item>
      </v-tabs>
    </BaseSecure>
  </v-container>
</template>

<script>
import ApiAccess from '@/components/apiAccess/ApiAccess.vue';
import History from '@/components/History.vue';
import Team from '@/components/Team.vue';
import apiAccess from '@/store/modules/apiAccess';

export default {
  name: 'Application',
  components: {
    ApiAccess,
    History,
    Team
  },
  props: ['acronym'],
  beforeDestroy() {
    this.$store.unregisterModule('apiAccess');
  },
  created() {
    this.$store.registerModule('apiAccess', apiAccess);
  }
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
  .v-tabs-bar {
    @media (min-width: 960px) {
      margin-right: 8em;
    }
    @media (max-width: 959px) {
      margin-right: 2em;
    }
  }
  .v-tab {
    padding: 2em 7em 2em 2em;
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
