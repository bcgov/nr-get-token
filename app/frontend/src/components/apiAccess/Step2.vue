<template>
  <v-container>
    Contents to go here {{environment}}
    <br />
    <br />
    <br />
    <br />
    <div class="text-center">
      <v-btn class="BC-Gov-PrimaryButton light mr-4" text @click="setStep(1)">Back</v-btn>
      <v-btn class="BC-Gov-PrimaryButton" text @click="setStep(3)">Submit</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ApiAccessStep2',
  computed: {
    ...mapGetters('apiAccess', ['environment'])
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep'])
  }
};
</script>
