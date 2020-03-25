<template>
  <v-container>
    <BaseSecure admin>
      <h1 class="mb-10 text-center">Admin</h1>
      <JWTDialog />
      <ApiTester class="my-4" />
    </BaseSecure>
  </v-container>
</template>

<script>
import ApiTester from '@/components/ApiTester.vue';
import JWTDialog from '@/components/JWTDialog.vue';

export default {
  name: 'Admin',
  components: {
    ApiTester,
    JWTDialog
  }
};
</script>
