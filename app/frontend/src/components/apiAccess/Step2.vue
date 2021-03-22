<template>
  <v-container>
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
            :rules="appNameRules"
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
            :counter="fieldValidations.DESCRIPTION_MAX_LENGTH_KC"
            dense
            flat
            outlined
            rows="5"
            :rules="appDescriptionRules"
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
            disabled
            hide-details="auto"
            outlined
            flat
            readonly
            solo
          />
        </v-col>
      </v-row>
    </v-form>

    <v-row class="mt-12">
      <v-col cols="6">
        <v-btn class="mr-4" block outlined @click="setStep(1)">
          <span>Back</span>
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="primary" block depressed @click="submit">
          <span>Submit</span>
        </v-btn>
      </v-col>
    </v-row>

    <BaseDialog
      :show="confirmDialog"
      :type="!submissionInProgress ? 'CONTINUE' : ''"
      @close-dialog="confirmDialog = false"
      @continue-dialog="sendFormToApi()"
      width="700"
    >
      <template v-slot:icon>
        <v-icon v-if="!submissionInProgress" large color="orange darken-2">warning</v-icon>
      </template>
      <template v-slot:text>
        <div v-if="submissionInProgress" class="text-center">
          <v-progress-circular indeterminate color="primary" :size="120">Submitting</v-progress-circular>
        </div>
        <div v-else>
          <p>
            This will create your
            <strong>{{ environment }}</strong> service client for the
            <strong>{{ acronym }}</strong> application.
          </p>
          <p>
            <strong>Disclaimer and statement of responsibility for users of Common Services:</strong>
            <ul>
              <li>It is your responsibility to comply with Privacy laws governing the collection, use and disclosure of personally identifiable information.</li>
              <li>Access to this Common Services does not inherently grant permission to collect, use or disclose any personally identifiable information.</li>
              <li>It is your responsibility to obtain consent to collect information as required by law.</li>
              <li>Before using Common Services you are required to discuss the intention of your application with your
                <a href="https://www2.gov.bc.ca/gov/content/governments/services-for-government/information-management-technology/privacy/resources/privacy-officers" target="_blank">
                  Ministry Privacy Officer <v-icon small color="primary">open_in_new</v-icon>
                </a>
                and to complete assessments as required.
              </li>
            </ul>
          </p>
          <p>Do you want to continue?</p>
        </div>
      </template>
    </BaseDialog>

    <BaseDialog :show="errorDialog" @close-dialog="errorDialog = false">
      <template v-slot:icon>
        <v-icon large color="red">cancel</v-icon>
      </template>
      <template v-slot:text>
        <p>
          An error occurred while attempting to create a service client for
          <strong>{{ acronym }}</strong>.
          <br />Please try again later (you can try logging out or refreshing the page). If the error persists please
          <a
            href="mailto:NR.CommonServiceShowcase@gov.bc.ca?subject=Error during service client creation"
          >contact us</a>.
        </p>
        <p>Include your application name as well as your IDIR username in your email.</p>
      </template>
    </BaseDialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'ApiAccessStep2',
  data() {
    return {
      appNameRules: [
        v => !!v || 'Name is required',
        v =>
          v.length <= FieldValidations.NAME_MAX_LENGTH ||
          `Name must be ${FieldValidations.NAME_MAX_LENGTH} characters or less`
      ],
      appDescriptionRules: [
        v => !!v || 'Description is required',
        v =>
          v.length <= FieldValidations.DESCRIPTION_MAX_LENGTH_KC ||
          `Description must be ${FieldValidations.DESCRIPTION_MAX_LENGTH_KC} characters or less`
      ],
      confirmDialog: false,
      errorDialog: false,
      fieldValidations: FieldValidations,
      submissionInProgress: false
    };
  },
  computed: {
    ...mapGetters('apiAccess', ['acronym', 'environment']),
    appName: {
      get() {
        return this.$store.state.apiAccess.appName;
      },
      set(val) {
        this.$store.commit('apiAccess/setAppName', val);
      }
    },
    appDescription: {
      get() {
        return this.$store.state.apiAccess.appDescription;
      },
      set(val) {
        this.$store.commit('apiAccess/setAppDescription', val);
      }
    }
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep']),
    ...mapActions('apiAccess', ['submitConfigForm']),
    submit() {
      if (this.$refs.form.validate()) {
        this.confirmDialog = true;
      }
    },
    async sendFormToApi() {
      this.submissionInProgress = true;
      const success = await this.submitConfigForm();
      this.confirmDialog = false;
      if (success) {
        this.setStep(3);
      } else {
        this.errorDialog = true;
      }

      // To give the animation enough time to fade so it doesn't juke a little
      setTimeout(() => (this.submissionInProgress = false), 1000);
    }
  }
};
</script>
