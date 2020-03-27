<template>
  <v-container>
    <BaseSecure admin>
      <h1 class="mb-10 text-center">Admin</h1>
      <v-container>
        <v-row>
          <HealthDialog class="mr-1" />
          <JWTDialog class="mx-1" />
        </v-row>
      </v-container>
      <ApiTester class="my-4" />
      <Clients />
    </BaseSecure>
  </v-container>
</template>

<script>
import ApiTester from '@/components/ApiTester.vue';
import Clients from '@/components/Clients.vue';
import HealthDialog from '@/components/HealthDialog.vue';
import JWTDialog from '@/components/JWTDialog.vue';

export default {
  name: 'Admin',
  components: {
    ApiTester,
    Clients,
    HealthDialog,
    JWTDialog
  }
};
</script>
