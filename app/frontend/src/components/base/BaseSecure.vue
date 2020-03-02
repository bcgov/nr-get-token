<template>
  <div v-if="$keycloak.ready && $keycloak.authenticated">
    <slot />
  </div>
  <div v-else class="text-center">
    <h1>You must be logged in to use this feature.</h1>
    <v-btn v-if="$keycloak.ready" color="secondary" class="login-btn" @click="login" large>
      <v-icon left>mdi-login</v-icon>
      <span>Login</span>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'BaseSecure',
  methods: {
    login() {
      if (this.$keycloak.ready) {
        window.location.replace(this.$keycloak.createLoginUrl());
      }
    }
  }
};
</script>
