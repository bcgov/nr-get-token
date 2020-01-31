<template>
  <header class="gov-header">
    <v-toolbar>
      <!-- Navbar content -->
      <a href="https://www2.gov.bc.ca">
        <img
          src="@/assets/images/17_gov3_bc_logo.svg"
          width="152"
          height="55"
          alt="B.C. Government Logo"
        >
      </a>

      <v-toolbar-title>
        <v-btn class="title hidden-sm-and-down" color="text" text>Common Service Get Token</v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="isAuthenticated">
        <v-btn v-if="devMode" text id="nav-profile" :href="authRoutes.TOKEN">Token</v-btn>
        <v-btn text id="nav-logout" @click="clearStorage" :href="authRoutes.LOGOUT">Logout</v-btn>
      </div>
    </v-toolbar>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { AuthRoutes } from '@/utils/constants.js';

export default {
  data() {
    return {
      authRoutes: AuthRoutes,
      appTitle: process.env.VUE_APP_TITLE
    };
  },
  computed: {
    ...mapGetters(['devMode']),
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    clearStorage() {
      this.$store.commit('auth/setJwtToken');
      this.$store.commit('auth/setRefreshToken');
    }
  }
};
</script>


<style scoped>
.gov-header .title {
  color: #fff;
  text-decoration: none;
}

.gov-header .v-toolbar {
  background-color: rgb(0, 51, 102);
  border-bottom: 2px solid rgb(252, 186, 25);
}

.gov-header .v-btn,
.v-btn--active.title:before,
.v-btn.title:focus:before,
.v-btn.title:hover:before {
  color: #fff;
  background: none;
}

.secondary_color {
  background-color: var(--v-secondary-base);
}
</style>
