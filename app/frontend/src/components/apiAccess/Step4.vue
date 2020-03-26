<template>
  <v-container>
    <h2>API Access for Common Services</h2>Contents to go here
    <br />
    <br />
    <br />
    <br />
    <div class="text-center">
      <v-btn class="BC-Gov-PrimaryButton" text @click="finish">Finish</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ApiAccessStep4',
  methods: {
    ...mapMutations('apiAccess', ['setStep']),
    finish() {
      this.$router.push({ name: 'MyApps' });
      this.setStep(1);
    }
  }
};
</script>
