<template>
  <v-container>
    Contents to go here
    <br />
    <br />
    <br />
    <br />
    <div class="text-center">
      <v-btn class="BC-Gov-PrimaryButton light mr-4" text @click="setStep(2)">Back</v-btn>
      <v-btn class="BC-Gov-PrimaryButton" text @click="setStep(4)">Next</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ApiAccessStep3',
  methods: {
    ...mapMutations('apiAccess', ['setStep'])
  }
};
</script>
