<template>
  <v-container class="request-form">
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col>
          <label>Application full name</label>
          <v-text-field
            v-model="appName"
            :counter="fieldValidations.NAME_MAX_LENGTH"
            dense
            outlined
            flat
            solo
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label>Application Description</label>
          <v-textarea
            v-model="appDescription"
            auto-grow
            :counter="fieldValidations.DESCRIPTION_MAX_LENGTH"
            dense
            flat
            outlined
            rows="5"
            solo
          />
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col>
          <label>Environment to Deploy to</label>
          <v-text-field
            v-model="environment"
            dense
            hide-details="auto"
            outlined
            flat
            readonly
            solo
          />
        </v-col>
      </v-row>
    </v-form>
    <div class="text-center mt-12">
      <v-btn class="BC-Gov-PrimaryButton light mr-4" text @click="setStep(1)">Back</v-btn>
      <v-btn class="BC-Gov-PrimaryButton" text @click="confirmDialog = true">Submit</v-btn>
    </div>

    <BaseDialog
      v-bind:show="confirmDialog"
      type="CONTINUE"
      @close-dialog="confirmDialog = false"
      @continue-dialog="confirmDialog = false; setStep(3)"
    >
      <template v-slot:icon>
        <v-icon large color="orange">warning</v-icon>
      </template>
      <template v-slot:text>
        <p>
          This will create your
          <strong>{{ environment}}</strong> service client for the
          <strong>{{ acronym}}</strong> application.
        </p>
        <p>Do you want to continue?</p>
      </template>
    </BaseDialog>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'ApiAccessStep2',
  data() {
    return {
      confirmDialog: false,
      fieldValidations: FieldValidations
    };
  },
  computed: {
    ...mapGetters('apiAccess', [
      'acronym',
      'appName',
      'appDescription',
      'environment'
    ])
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep'])
  }
};
</script>
