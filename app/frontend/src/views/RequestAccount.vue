<template>
  <v-container class="request-account">
    <BaseSecure>
      <h1 class="text-center my-8">Request Account</h1>
      <RequestForm />
    </BaseSecure>
  </v-container>
</template>

<script>
import RequestForm from '@/components/RequestForm.vue';

export default {
  name: 'RequestAccount',
  components: {
    RequestForm
  }
};
</script>
