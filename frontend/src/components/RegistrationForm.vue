<template>
  <v-btn class="mr-2" color="success" @click="registrationDialog = true">
    Register a new application
    <v-dialog v-model="registrationDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline underline">
          <v-icon class="mr-2">email</v-icon>Request Permission
        </v-card-title>
        <v-card-text>
          <p>
            Please submit an Acronym for the application you wish to add.
            <br />You will get an email once permissions have been set up.
          </p>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col>
                <label>My Email</label>
                <v-text-field
                  readonly
                  :value="userInfo.emailAddress"
                  hide-details="auto"
                  solo
                  dense
                  single-line
                  outlined
                  flat
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label>My IDIR</label>
                <v-text-field
                  readonly
                  :value="userInfo.idir"
                  hide-details="auto"
                  solo
                  single-line
                  dense
                  outlined
                  flat
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
        </v-card-text>
        <v-card-actions class="justify-center pb-8">
          <v-btn outlined @click="cancel()">Cancel</v-btn>
          <v-btn color="primary" depressed @click="postRegistrationForm()">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Dialog v-bind:show="errorOccurred" @close-dialog="errorOccurred = false">
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

    <Dialog v-bind:show="registerSuccess" @close-dialog="registerSuccess = false">
      <template v-slot:icon>
        <v-icon large color="green">check_circle_outline</v-icon>
      </template>
      <template v-slot:text>
        <p>Your Registration was sent successfully. You will be sent an email to {{ userInfo.emailAddress }} when your application has been authorized.</p>
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
