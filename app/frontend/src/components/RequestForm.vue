<template>
  <v-container class="request-form">
    <p>
      Please submit the Acronym of the application you wish to add. You will get
      an email once it is confirmed.
    </p>

    <v-form ref="form" v-model="valid">
      <v-row>
        <v-col>
          <label>IDIR</label>
          <v-text-field
            v-model="form.idir"
            dense
            disabled
            hide-details="auto"
            outlined
            flat
            readonly
            single-line
            solo
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label>E-mail</label>
          <v-text-field
            v-model="form.from"
            dense
            disabled
            flat
            hide-details="auto"
            outlined
            readonly
            single-line
            solo
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label>Application Acronym &nbsp;</label>
          <v-tooltip right>
            <template #activator="{ on }">
              <v-icon v-on="on">help_outline</v-icon>
            </template>
            The Application Acronym must comply with the following format:
            <ul>
              <li>UPPERCASE LETTERS ONLY</li>
              <li>Underscores may be placed between letters</li>
              <li>Must begin and end with a letter</li>
              <li>
                At least {{ fieldValidations.ACRONYM_MIN_LENGTH }} characters
              </li>
              <li>
                Examples:
                <em>ABCD</em>,
                <em>ABCD_WXYZ</em>
              </li>
            </ul>
          </v-tooltip>
          <v-text-field
            v-model="form.applicationAcronym"
            dense
            flat
            hide-details="auto"
            placeholder="For example: 'ABC_DEF'"
            required
            :rules="applicationAcronymRules"
            single-line
            solo
            outlined
          >
            <template #append-outer />
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label>Comments (optional)</label>
          <v-textarea
            v-model="form.comments"
            auto-grow
            dense
            flat
            hide-details="auto"
            outlined
            rows="3"
            solo
          />
        </v-col>
      </v-row>
    </v-form>

    <v-row class="mt-8">
      <v-col cols="6">
        <v-btn class="mr-4" block outlined @click="cancel()">
          <span>Cancel</span>
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          color="primary"
          block
          depressed
          :disabled="!valid"
          @click="postRegistrationForm()"
        >
          <span>Submit</span>
        </v-btn>
      </v-col>
    </v-row>

    <BaseDialog
      v-bind:show="errorOccurred"
      @close-dialog="errorOccurred = false"
    >
      <template #icon>
        <v-icon large color="red">cancel</v-icon>
      </template>
      <template #text>
        <p>
          An error occurred while attempting to add your application.
          <br />You can also add your application by sending an email to
          <a
            href="mailto:NR.CommonServiceShowcase@gov.bc.ca?subject=GETOK Registration for <acronym> - <idir>"
          >
            NR.CommonServiceShowcase@gov.bc.ca
          </a>
        </p>
        <p>
          Please include your Acronym as well as your IDIR username in your
          email.
        </p>
      </template>
    </BaseDialog>

    <BaseDialog
      v-bind:show="registerSuccess"
      @close-dialog="registerSuccess = false"
    >
      <template #icon>
        <v-icon large color="green">check_circle_outline</v-icon>
      </template>
      <template #text>
        <p>
          Your request has been sent successfully. You will get an email to
          {{ form.from }} when it is authorized.
        </p>
      </template>
    </BaseDialog>

    <v-dialog v-model="sending" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Sending request
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

import emailService from '@/services/emailService';
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'RequestForm',
  computed: {
    ...mapGetters('auth', ['tokenParsed', 'userName']),
  },
  data() {
    return {
      applicationAcronymRules: [
        (v) => !!v || 'Acronym is required',
        (v) =>
          v.length <= FieldValidations.ACRONYM_MAX_LENGTH ||
          `Acronym must be ${FieldValidations.ACRONYM_MAX_LENGTH} characters or less`,
        (v) =>
          /^(?:[A-Z]{1,}[_]?)+[A-Z]{1,}$/g.test(v) ||
          'Incorrect format. Hover over ? for details.',
      ],
      errorOccurred: false,
      form: {
        applicationAcronym: '',
        comments: '',
        from: '',
        idir: '',
      },
      fieldValidations: FieldValidations,
      registerSuccess: false,
      sending: false,
      valid: false,
    };
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'About' });
    },
    postRegistrationForm() {
      this.resetState();
      this.sending = true;
      if (this.valid) {
        emailService
          .sendRegistrationEmail(this.form)
          .then((response) => {
            if (response) {
              this.registerSuccess = true;
            }
          })
          .catch(() => {
            this.errorOccurred = true;
          })
          .finally(() => {
            this.sending = false;
          });
      }
    },
    resetForm() {
      this.form.applicationAcronym = '';
      this.form.comments = '';
      this.form.from = this.tokenParsed.email;
      this.form.idir = this.userName;
      this.valid = false;
    },
    resetState() {
      this.errorOccurred = false;
      this.registerSuccess = false;
    },
  },
  mounted() {
    this.resetState();
    this.resetForm();
  },
};
</script>

<style scoped>
.request-form {
  max-width: 30rem;
  margin: 0 auto;
}
</style>
