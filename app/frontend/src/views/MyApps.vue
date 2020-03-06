<template>
  <v-container>
    <BaseSecure>
      <ApplicationList />
    </BaseSecure>
  </v-container>
</template>

<script>
import ApplicationList from '@/components/ApplicationList';

export default {
  name: 'MyApplications',
  components: {
    ApplicationList
  }
};
</script>
