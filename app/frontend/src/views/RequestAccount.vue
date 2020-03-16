<template>
  <v-container class="request-account">
    <BaseSecure>
      Request Account
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
