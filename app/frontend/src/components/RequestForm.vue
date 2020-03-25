<template>
  <v-container class="request-form">
    <h2 class="text-center mb-10">Request Account</h2>

    <p>Please submit the Acronym of the application you wish to add. You will get an email once it is confirmed.</p>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col>
          <label>IDIR</label>
          <v-text-field
            v-model="form.idir"
            dense
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
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">help_outline</v-icon>
            </template>
            The Application Acronym must comply with the following format:
            <ul>
              <li>UPPERCASE LETTERS ONLY</li>
              <li>Underscores may be placed between letters</li>
              <li>Must begin and end with a letter</li>
              <li>At least {{ fieldValidations.ACRONYM_MIN_LENGTH }} characters</li>
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
            <template v-slot:append-outer />
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
    <div class="justify-center pb-8">
      <v-btn class="request-form-cancel-btn BC-Gov-PrimaryButton light float-left" text @click="cancel()">Cancel</v-btn>
      <v-btn class="request-form-submit-btn BC-Gov-PrimaryButton float-right" text @click="postRegistrationForm()">Submit</v-btn>
    </div>

    <BaseDialog v-bind:show="errorOccurred" @close-dialog="errorOccurred = false">
      <template v-slot:icon>
        <v-icon large color="red">cancel</v-icon>
      </template>
      <template v-slot:text>
        <p>
          An error occurred while attempting to add your application.
          <br />You can also add your application by sending an email to
          <a
            href="mailto:NR.CommonServiceShowcase@gov.bc.ca?subject=GETOK Registration for <acronym> - <idir>"
          >NR.CommonServiceShowcase@gov.bc.ca</a>
        </p>
        <p>Please include your Acronym as well as your IDIR username in your email.</p>
      </template>
    </BaseDialog>

    <BaseDialog v-bind:show="registerSuccess" @close-dialog="registerSuccess = false">
      <template v-slot:icon>
        <v-icon large color="green">check_circle_outline</v-icon>
      </template>
      <template v-slot:text>
        <p>Your request has been sent successfully. You will get an email to {{ form.from }} when it is authorized.</p>
      </template>
    </BaseDialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

import emailService from '@/services/emailService';
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'RequestForm',
  computed: {
    ...mapGetters('auth', ['tokenParsed', 'userName'])
  },
  data() {
    return {
      applicationAcronymRules: [
        v => !!v || 'Acronym is required',
        v =>
          v.length <= FieldValidations.ACRONYM_MAX_LENGTH ||
          `Acronym must be ${FieldValidations.ACRONYM_MAX_LENGTH} characters or less`,
        v =>
          /^(?:[A-Z]{2,}[_]?)+[A-Z]{1,}$/g.test(v) ||
          'Incorrect format. Hover over ? for details.'
      ],
      errorOccurred: false,
      form: {
        applicationAcronym: '',
        comments: '',
        from: '',
        idir: ''
      },
      fieldValidations: FieldValidations,
      registerSuccess: false,
      valid: false
    };
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'About' });
    },
    postRegistrationForm() {
      this.resetState();
      if (this.$refs.form.validate()) {
        emailService
          .sendRegistrationEmail(this.form)
          .then(response => {
            if (response) {
              this.registerSuccess = true;
            }
          })
          .catch(() => {
            this.errorOccurred = true;
          });
      }
    },
    resetForm() {
      this.form.applicationAcronym = '';
      this.form.comments = '';
      this.form.from = this.tokenParsed.email;
      this.form.idir = this.userName;
    },
    resetState() {
      this.errorOccurred = false;
      this.registerSuccess = false;
    }
  },
  mounted() {
    this.resetState();
    this.resetForm();
  }
};
</script>

<style scoped>
.request-form {
  max-width: 30rem;
  margin: 0 auto;
}
</style>