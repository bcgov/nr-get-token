<template>
  <v-container>
    <BaseSecure>
      <ApplicationList />
    </BaseSecure>
  </v-container>
</template>

<script>
import ApplicationList from '@/components/ApplicationList';
import user from '@/store/modules/user';

export default {
  name: 'MyApplications',
  beforeDestroy() {
    this.$store.unregisterModule('user');
  },
  created() {
    this.$store.registerModule('user', user);
  },
  components: {
    ApplicationList
  }
};
</script>
