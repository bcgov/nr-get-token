<template>
  <v-container>
    <v-textarea
      auto-grow
      readonly
      label="Application Configuration"
      v-model="appConfigAsString"
      class="jsonText"
    ></v-textarea>
    <p class="text-xs-right">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat icon color="primary" v-on="on">
            <v-icon>cloud_download</v-icon>
          </v-btn>
        </template>
        <span>Download application configuration</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            flat
            icon
            color="primary"
            v-clipboard="() => appConfigAsString"
            v-clipboard:success="clipboardSuccessHandler"
            v-clipboard:error="clipboardErrorHandler"
            v-on="on"
          >
            <v-icon>file_copy</v-icon>
          </v-btn>
        </template>
        <span>Copy application configuration to clipboard</span>
      </v-tooltip>
    </p>

    <v-snackbar v-model="snackbar.on" right top :timeout="6000" :color="snackbar.color">
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
        color: "info"
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
