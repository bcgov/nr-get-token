<template>
  <v-container>
    <BaseSecure>Request Account</BaseSecure>
    <RequestForm />
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
