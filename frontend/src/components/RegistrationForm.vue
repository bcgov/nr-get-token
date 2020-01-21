<template>
  <v-btn class="mr-2" color="success" @click="registrationDialog = true">
    Register New App
    <v-dialog v-model="registrationDialog" persistent max-width="700">
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">email</v-icon>Register New App
        </v-card-title>
        <v-card-text>
          <v-alert :value="errorOccurred" tile type="error" transition="scale-transition">
            An error occurred while attempting to send registration message.
            <br />You can manually send a contact email to
            <a
              class="white--text"
              href="mailto:NR.CommonServiceShowcase@gov.bc.ca?subject=GETOK Registration for <acronym> - <idir>"
            >NR.CommonServiceShowcase@gov.bc.ca</a> (please supply acronym and IDIR in your email)
          </v-alert>
          <p>
            Please supply the acronym of the application you wish to register (along with any optional comments)
            and a communication will be passed along to authorize you for that application.
          </p>

          <v-form ref="form" v-model="valid" lazy-validation>
            <p class="mb-0">
              My Email:
              <strong>{{emailAddress}}</strong>
              <br />My IDIR:
              <strong>{{idir}}</strong>
            </p>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  :counter="fieldValidations.ACRONYM_MAX_LENGTH"
                  label="Application Acronym"
                  required
                  :rules="applicationAcronymRules"
                  v-model="applicationAcronym"
                >
                  <template v-slot:append-outer>
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
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-textarea v-model="comments" rows="1" auto-grow label="Comments"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel()">Cancel</v-btn>
          <v-btn color="success darken-1" text @click="postRegistrationForm()">SEND</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>


<script>
import ApiService from '@/common/apiService';
import { FieldValidations } from '@/utils/constants.js';

export default {
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
      emailAddress: 'lucas.oneil@gov.bc.ca',
      fieldValidations: FieldValidations,
      idir: 'loneil',
      registrationDialog: false,
      valid: false
    };
  },
  methods: {
    async cancel() {
      this.errorOccurred = false;
      this.registrationDialog = false;
    },
    async postRegistrationForm() {
      this.$store.commit('configForm/clearConfigSubmissionMsgs');
      this.errorOccurred = false;
      if (this.$refs.form.validate()) {
        try {
          const response = await ApiService.sendRegistrationEmail({
            applicationAcronym: this.applicationAcronym,
            comments: this.comments,
            from: this.emailAddress,
            idir: this.idir
          });
          if (response) {
            this.registrationDialog = false;
            this.$store.commit('configForm/setConfigSubmissionSuccess',
              `Registration request sent successfully. You will be emailed back at ${this.emailAddress} when authorized`
            );
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
