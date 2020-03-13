<template>
  <v-container class="request-form">
    <h2 class="text-center mb-10">Request Account</h2>

    <p>Please submit the Acronym of the application you wish to add. You will get an email once it is confirmed.</p>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col>
          <label>IDIR</label>
          <v-text-field
            readonly
            hide-details="auto"
            solo
            single-line
            dense
            outlined
            flat
            :value="abc"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label>E-mail</label>
          <v-text-field
            readonly
            hide-details="auto"
            solo
            dense
            single-line
            outlined
            flat
            :value="def"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label>Application Acronym &nbsp;</label>
          <v-tooltip bottom>
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
            placeholder="For example: 'ABC_DEF'"
            required
            :rules="applicationAcronymRules"
            v-model="applicationAcronym"
            hide-details="auto"
            solo
            dense
            single-line
            outlined
            flat
          >
            <template v-slot:append-outer></template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label>Comments (optional)</label>
          <v-textarea
            v-model="comments"
            rows="3"
            auto-grow
            hide-details="auto"
            dense
            solo
            outlined
            flat
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>
    <div class="justify-center pb-8">
      <v-btn class="BC-Gov-PrimaryButton light float-left" text @click="cancel()">Cancel</v-btn>
      <v-btn class="BC-Gov-PrimaryButton float-right" text @click="postRegistrationForm()">Submit</v-btn>
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
        <p>Your Registration was sent successfully. You will be sent an email to {{ userInfo.emailAddress }} when your application has been authorized.</p>
      </template>
    </BaseDialog>
  </v-container>
</template>

<script>
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'RequestForm',
  data: function() {
    return {
      applicationAcronym: '',
      applicationAcronymRules: [
        v => !!v || 'Acronym is required',
        v =>
          v.length <= FieldValidations.ACRONYM_MAX_LENGTH ||
          `Acronym must be ${FieldValidations.ACRONYM_MAX_LENGTH} characters or less`,
        v =>
          /^(?:[A-Z]{2,}[_]?)+[A-Z]{1,}$/g.test(v) ||
          'Incorrect format. Hover over ? for details.'
      ],
      comments: '',
      errorOccurred: false,
      fieldValidations: FieldValidations,
      registrationDialog: false,
      registerSuccess: false,
      valid: false,
    };
  },
  methods: {
    async cancel() {
      this.errorOccurred = false;
      this.registrationDialog = false;
      this.registerSuccess = false;
      this.$router.push({ name: 'About'});
    },

    async postRegistrationForm() {
      this.errorOccurred = false;
      this.registerSuccess = false;
      if (this.$refs.form.validate()) {
        try {
          const response = true;
          if (response) {
            this.registrationDialog = false;
            this.registerSuccess = true;
          } else {
            this.errorOccurred = true;
          }
        } catch (error) {
          this.errorOccurred = true;
        }
      }
    }
  }
};
</script>

<style scoped>
.request-form {
  max-width: 450px;
  margin: 0 auto;
}
</style>
