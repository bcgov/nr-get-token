<template>
  <v-container>
    <BaseSecure admin>
      <h1 class="mb-10 text-center">Admin</h1>
      <JWTDialog />
    </BaseSecure>
  </v-container>
</template>

<script>
import JWTDialog from '@/components/JWTDialog.vue';

export default {
  name: 'Admin',
  components: {
    JWTDialog
  }
};
</script>
