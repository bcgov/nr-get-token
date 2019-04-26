<template>
  <v-container>
    <v-textarea auto-grow readonly label="Application Configuration" v-model="appConfigAsString"></v-textarea>
    <p class="text-xs-right">
      <v-btn flat icon color="primary">
        <v-icon>cloud_download</v-icon>
      </v-btn>
      <v-btn
        flat
        icon
        color="primary"
        v-clipboard="() => this.appConfigAsString"
        v-clipboard:success="clipboardSuccessHandler"
        v-clipboard:error="clipboardErrorHandler"
      >
        <v-icon>file_copy</v-icon>
      </v-btn>
    </p>

    <v-snackbar
      v-model="snackbar.on"
      right="true"
      top="true"
      :timeout="6000"
      :color="snackbar.color"
    >
      {{snackbar.text}}
      <v-btn color="white" flat @click="snackbar.on = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Clipboard from "v-clipboard";

Vue.use(Clipboard);

export default {
  data() {
    return {
      snackbar: {
        on: false,
        text: "test",
        color: ""
      }
    };
  },
  computed: {
    ...mapGetters(["appConfigAsString"])
  },
  methods: {
    clipboardSuccessHandler() {
      this.snackbar.on = true;
      this.snackbar.text = "Application Configuration copied to clipboard";
      this.snackbar.color = "info";
    },

    clipboardErrorHandler() {
      this.snackbar.on = true;
      this.snackbar.text = "Error attempting to copy to clipboard";
      this.snackbar.color = "error";
    }
  }
};
</script>

<style>
.jsonBtn {
  cursor: pointer;
  margin-left: 20px;
}
</style>
