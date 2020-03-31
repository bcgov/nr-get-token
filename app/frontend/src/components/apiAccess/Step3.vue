<template>
  <v-container>
    <h2 class="green--text text--darken-2 text-center mb-12">
      <v-icon large color="green darken-2">check_circle</v-icon>API Access Granted
    </h2>
    <p>
      Your service client for
      <strong>{{ acronym }}</strong> has been successfully updated in the
      <strong>{{ environment }}</strong> Keycloak realm
    </p>

    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="8">
          <label>Service Client</label>
          <v-text-field
            v-model="configFormSubmissionResult.generatedServiceClient"
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
            v-model="configFormSubmissionResult.generatedPassword"
            dense
            hide-details="auto"
            outlined
            flat
            readonly
            solo
          />
        </v-col>
        <v-col cols="1" class="pt-9">
          <v-btn text large icon class="BC-Gov-IconButton">
            <v-icon>remove_red_eye</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1" class="pt-9 pl-6">
          <v-btn text large icon class="BC-Gov-IconButton">
            <v-icon>file_copy</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <p class="mb-12">
      Click the
      <strong>"Show" icon</strong> and make sure to save the password securely as you will be unable to fetch it again.
    </p>

    <v-row class="mt-12">
      <v-col cols="6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" class="BC-Gov-PrimaryButton light mr-4" block text @click="setStep(2)">Back</v-btn>
          </template>
          <span>Go back to create a new password</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        <v-btn class="BC-Gov-PrimaryButton" block text @click="setStep(4)">Next</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ApiAccessStep3',
  computed: {
    ...mapGetters('apiAccess', [
      'acronym',
      'configFormSubmissionResult',
      'environment'
    ])
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep'])
  }
};
</script>
