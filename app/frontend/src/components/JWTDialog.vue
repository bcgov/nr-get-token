<template>
  <div>
    <v-btn class="primary" @click="jwtShow = true">
      <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-wrench</v-icon>
      <span v-if="$vuetify.breakpoint.smAndUp">JWT Token</span>
    </v-btn>
    <BaseDialog :show="jwtShow" width="1200" @close-dialog="jwtShow = false">
      <template v-slot:title>
        <strong v-if="authenticated">User {{ fullName }} ({{ userName }}) is logged in.</strong>
        <strong v-else>User is not logged in.</strong>
      </template>
      <template v-slot:icon>
        <v-icon large>mdi-wrench</v-icon>
      </template>
      <template v-slot:text>
        <div v-if="authenticated">
          <strong>JWT Token</strong>
          <p>{{ token }}</p>
          <strong>Contents</strong>
          <p>{{ tokenParsed }}</p>
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
      jwtShow: false
    };
  }
};
</script>
