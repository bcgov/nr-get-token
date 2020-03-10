<template>
  <v-hover>
    <template v-slot="{ hover }">
      <router-link class="action-link" :to="{ name: linkName, params: linkParams }">
        <v-card tile :elevation="hover ? 12 : 2" class="action-card mx-auto">
          <v-system-bar />
          <div class="px-5 py-3">
            <slot />
          </div>
        </v-card>
      </router-link>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: 'BaseActionCard',
  props: {
    linkName: String,
    linkParams: Object
  }
};
</script>

<style scoped>
.action-card {
  height: 100%;
}

.v-system-bar {
  background-color: #38598a;
}

a {
  text-decoration: none;
}
</style>
