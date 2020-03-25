<template>
  <v-container>
    <h2>API Access for Common Services</h2>Contents to go here
    <br />
    <br />
    <br />
    <br />
    <div class="text-center">
      <v-btn class="BC-Gov-PrimaryButton" text @click="finish()">Finish</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ApiAccessStep4',
  methods: {
    finish() {
      this.$router.push({ name: 'MyApps' });
    }
  }
};
</script>
