<template>
  <v-btn class="mr-2" color="success" @click="registrationDialog = true">
    Register a new app
    <v-dialog v-model="registrationDialog" persistent max-width="700">
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">email</v-icon>Register a New Application
        </v-card-title>
        <v-card-text>
          <p>
            Please enter an acronym for the application you are registering.
            <br />Use the optional Comments field to describe your project or indicate relavant branch / ministries.
            <br />This message is sent to the Common Service Showcase Team to authorize you for that application.
          </p>
          <v-form ref="form" v-model="valid" lazy-validation>
            <p class="mb-0">
              My Email:
              <strong>{{userInfo.emailAddress}}</strong>
              <br />My IDIR:
              <strong>{{userInfo.idir}}</strong>
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

    <!-- error dialog -->
     <Dialog v-bind:show="errorOccurred">
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
    </Dialog>

    <!-- success dialog -->
    <Dialog v-bind:show="registerSuccess">
      <template v-slot:icon>
        <v-icon large color="green">check_circle_outline</v-icon>
      </template>
      <template v-slot:text>
        <p>Your Registration was sent successfully. You will be sent an email to ${this.userInfo.emailAddress} when your application has been authorized.</p>
      </template>
    </Dialog>

  </v-btn>
</template>


<script>
import ApiService from '@/common/apiService';
import { FieldValidations } from '@/utils/constants.js';
import { mapGetters } from 'vuex';
import '@/assets/scss/style.scss';
import Dialog from './Dialog.vue';

export default {
  components: {
    Dialog
  },
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
      valid: false
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo'])
  },
  methods: {
    async cancel() {
      this.errorOccurred = false;
      this.registrationDialog = false;
      this.registerSuccess = false;
    },
    async postRegistrationForm() {
      this.errorOccurred = false;
      this.registerSuccess = false;
      if (this.$refs.form.validate()) {
        try {
          const response = await ApiService.sendRegistrationEmail({
            applicationAcronym: this.applicationAcronym,
            comments: this.comments,
            from: this.userInfo.emailAddress,
            idir: this.userInfo.idir
          });
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
