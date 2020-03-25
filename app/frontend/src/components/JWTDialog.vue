<template>
  <div>
    <v-btn class="jwt-token-btn" color="primary" @click="jwtShow = true">
      <v-icon left>mdi-wrench</v-icon>
      <span>JWT Token</span>
    </v-btn>
    <BaseDialog :show="jwtShow" width="1200" @close-dialog="jwtShow = false">
      <template v-slot:title>
        <strong v-if="authenticated">User {{ fullName }} ({{ userName }}) is logged in.</strong>
        <strong v-else>User is not logged in.</strong>
      </template>
      <template v-slot:icon>

      </template>
      <template v-slot:text>
        <div v-if="authenticated">
          <v-tabs v-model="tab" light flat>
            <v-tab>JWT Contents</v-tab>
            <v-tab>Access Token</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <pre>{{ JSON.stringify(tokenParsed, null, 2) }}</pre>
            </v-tab-item>
            <v-tab-item>
              <p>{{ token }}</p>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <strong v-else>No JWT Token.</strong>
      </template>
      <template v-slot:button-text>Close</template>
    </BaseDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'JWTDialog',
  computed: {
    ...mapGetters('auth', [
      'authenticated',
      'fullName',
      'token',
      'tokenParsed',
      'userName'
    ])
  },
  data() {
    return {
      jwtShow: false,
      tab: null
    };
  }
};
</script>
