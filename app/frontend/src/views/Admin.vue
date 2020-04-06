<template>
  <v-container>
    <BaseSecure admin>
      <h1 class="my-8 text-center">Admin</h1>
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
import ApiTester from '@/components/admin/ApiTester.vue';
import Clients from '@/components/admin/Clients.vue';
import HealthDialog from '@/components/admin/HealthDialog.vue';
import JWTDialog from '@/components/admin/JWTDialog.vue';

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
