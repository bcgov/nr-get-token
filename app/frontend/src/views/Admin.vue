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
      <AccessGrant class="my-4" />
      <ServiceClients class="my-4" />
      <ApiTester />
    </BaseSecure>
  </v-container>
</template>

<script>
import AccessGrant from '@/components/admin/AccessGrant.vue';
import ApiTester from '@/components/admin/ApiTester.vue';
import HealthDialog from '@/components/admin/HealthDialog.vue';
import JWTDialog from '@/components/admin/JWTDialog.vue';
import ServiceClients from '@/components/admin/ServiceClients.vue';

export default {
  name: 'Admin',
  components: {
    AccessGrant,
    ApiTester,
    HealthDialog,
    JWTDialog,
    ServiceClients
  }
};
</script>
