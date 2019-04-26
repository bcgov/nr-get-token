<template>
  <v-container>
    <v-textarea auto-grow readonly label="Application Configuration" v-model="appConfigAsString"></v-textarea>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["appConfigAsString"])
  }
};
</script>
