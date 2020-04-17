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
        <v-tab>API ACCESS</v-tab>
        <v-tab>TEAM</v-tab>
        <v-tab v-if="showWebadeTab">WEBADE ACCESS</v-tab>

        <v-tab-item>
          <h2>{{acronym}}</h2>
          <ApiAccess :acronym="acronym" />
        </v-tab-item>

        <v-tab-item>
          <h2>{{acronym}}</h2>
          <Team :acronym="acronym" />
        </v-tab-item>

        <v-tab-item v-if="showWebAdeTab">
          <h2>{{acronym}}</h2>
          <WebadeAccess :acronym="acronym" />
        </v-tab-item>
      </v-tabs>
      acronym: {{JSON.stringify(acronymDetail)}}
    </BaseSecure>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

import ApiAccess from '@/components/apiAccess/ApiAccess.vue';
import Team from '@/components/Team.vue';
import WebadeAccess from '@/components/webadeAccess/WebadeAccess.vue';

import acronymService from '@/services/acronymService';
import apiAccess from '@/store/modules/apiAccess';
//import webadeAccess from '@/store/modules/webadeAccess';

export default {
  name: 'Application',
  components: {
    ApiAccess,
    Team,
    WebadeAccess
  },
  props: ['acronym'],
  data() {
    return {
      acronymDetail: null
    };
  },
  computed: {
    ...mapGetters('auth', ['hasWebadePermission']),
    // The user must explicitly be flagged to allow webade management (keycloak), and the acronym must be flagged to allow webade management (DB)
    showWebadeTab() {
      return !!this.hasWebadePermission && !!(this.acronymDetail && this.acronymDetail.permissionWebade === true);
    }
  },
  beforeDestroy() {
    this.$store.unregisterModule('apiAccess');
  },
  created() {
    this.$store.registerModule('apiAccess', apiAccess);

    // fetch the full acronym details to determine if this application has webade permission (with a user role check, see computed prop)
    acronymService
      .getAcronym(this.acronym)
      .then(response => {
        if(response && response.data) {
          this.acronymDetail = response.data.acronym;
        }
      })
      .catch((err) => {
        console.log(`An error occurred fetching acronym detail for ${this.acronym} from the database: ${err}`);  // eslint-disable-line no-console
      });
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
