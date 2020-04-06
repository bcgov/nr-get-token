<template>
  <v-container>
    <h2 class="green--text text--darken-2 text-center mb-12">
      <v-icon large color="green darken-2">check_circle</v-icon>API Access Granted
    </h2>
    <p>
      Your service client for
      <strong>{{ acronym }}</strong> has been successfully updated in the
      <strong>{{ environment }}</strong>
      Keycloak realm {{generatedClient}}
    </p>

    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="8">
          <label>Service Client</label>
          <v-text-field
            v-model="generatedClient"
            dense
            hide-details="auto"
            outlined
            flat
            readonly
            solo
          />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="8">
          <label>Password</label>
          <v-text-field
            v-model="passwordShown"
            dense
            hide-details="auto"
            outlined
            flat
            readonly
            solo
          />
        </v-col>
        <v-col cols="1" class="pt-9">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" color="primary" icon large @click="decryptPassword">
                <v-icon>remove_red_eye</v-icon>
              </v-btn>
            </template>
            <span>Decrypt and show Password</span>
          </v-tooltip>
        </v-col>
        <v-col cols="1" class="pt-9 pl-6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                color="primary"
                icon
                large
                v-clipboard:copy="passwordShown"
                v-clipboard:success="clipboardSuccessHandler"
                v-clipboard:error="clipboardErrorHandler"
                :disabled="!passwordDecrypted"
              >
                <v-icon>file_copy</v-icon>
              </v-btn>
            </template>
            <span>Copy decrypted Password to clipboard</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="1">
        <v-icon large color="orange darken-2">warning</v-icon>
      </v-col>
      <v-col cols="11">
        <p>
          Click the
          <strong>"Show" icon</strong> and make sure to save the password securely as you will be unable to fetch it again.
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col cols="6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" class="mr-4" block outlined @click="goBack">
              <span>Back</span>
            </v-btn>
          </template>
          <span>Go back to create a new password</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        <v-btn
          color="primary"
          block
          depressed
          @click="confirmDialog = true"
          :disabled="!passwordDecrypted"
        >
          <span>Next</span>
        </v-btn>
      </v-col>
    </v-row>

    <BaseDialog
      :show="confirmDialog"
      type="CONTINUE"
      width="400"
      @close-dialog="confirmDialog = false"
      @continue-dialog="confirmDialog = false; setStep(4)"
    >
      <template v-slot:icon>
        <v-icon large color="orange darken-2">warning</v-icon>
      </template>
      <template v-slot:text>
        <p>Did you save the password?</p>
        <p>If you didn't save it, please cancel and keep the password safely before you continue</p>
      </template>
    </BaseDialog>

    <v-snackbar v-model="snackbar.on" right :timeout="6000" :color="snackbar.color">
      {{snackbar.text}}
      <v-btn color="white" icon text @click="snackbar.on = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import cryptico from 'cryptico-js';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import { mapGetters, mapMutations } from 'vuex';

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

export default {
  name: 'ApiAccessStep3',
  data() {
    return {
      confirmDialog: false,
      passwordDecrypted: false,
      passwordShown: '••••••••',
      snackbar: {
        on: false,
        text: 'test',
        color: 'info'
      }
    };
  },
  computed: {
    ...mapGetters('apiAccess', [
      'acronym',
      'environment',
      'ephemeralPasswordRSAKey',
      'generatedClient',
      'generatedPassword'
    ])
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep']),
    clipboardSuccessHandler() {
      this.snackbar.on = true;
      this.snackbar.text = 'Password copied to clipboard';
      this.snackbar.color = 'info';
    },
    clipboardErrorHandler() {
      this.snackbar.on = true;
      this.snackbar.text = 'Error while attempting to copy to clipboard';
      this.snackbar.color = 'error';
    },
    decryptPassword() {
      this.passwordDecrypted = true;
      const DecryptionResult = cryptico.decrypt(
        this.generatedPassword,
        this.ephemeralPasswordRSAKey
      );
      this.passwordShown = DecryptionResult.plaintext;
    },
    goBack() {
      this.passwordShown = '••••••••';
      this.passwordDecrypted = false;
      this.setStep(2);
    }
  }
};
</script>
