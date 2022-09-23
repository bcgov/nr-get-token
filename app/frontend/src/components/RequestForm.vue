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
          <label class="pad-tooltip">Application Acronym</label>
          <AcronymTooltip />
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
          <label>Ministry</label>
          <v-text-field
            v-model="form.ministry"
            dense
            flat
            hide-details="auto"
            required
            :rules="ministryRules"
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
          <p>
            Describe your application and which common services you will be
            using. If you are using CHES, please confirm your project has <a @click="showChesNotice = true">approval from OCIO Messaging</a>
          </p>
          <label>Comments</label>
          <v-textarea
            v-model="form.comments"
            auto-grow
            dense
            flat
            hide-details="auto"
            placeholder="Describe your application and which common services you will be using"
            required
            :rules="applicationCommentRules"
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

    <!-- CHES OCIO Notice-->
    <BaseDialog
      v-bind:show="showChesNotice"
      @close-dialog="showChesNotice = false"
    >
      <template #icon>
        <v-icon large color="primary">info_outline</v-icon>
      </template>
      <template #text>
        <p class="mb-2">
          Please read the guide on
          <a
            target="_blank"
            href="https://github.com/bcgov/common-hosted-email-service/wiki/Best-Practices"
          >Best Practices for use of the CHES messaging API</a>.
        </p>
        <p class="mb-2">
          There is a change to our onboarding process for CHES. Before
          requesting your API credentials through GETOK, you must make an IStore
          request for a consultation with OCIO Messaging (the underlying SMTP
          service provider). Book your consultation through your service desk
          (Office Productivity > Consulting Services > Messaging and
          Collaboration - Consulting) or email
          <a href="mailto:mcs@gov.bc.ca">mcs@gov.bc.ca</a>.
        </p>
        <p>
          Requests to the CHES API must originate from an IP adress within the
          BC Government's SpanBC network. If your application is hosted outside
          of the SpanBC network OCIO may be able to find you an alternate
          solution. Failure to contact OCIO may affect your access to the CHES
          service.
        </p>
      </template>
    </BaseDialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

import AcronymTooltip from '@/components/AcronymTooltip.vue';
import emailService from '@/services/emailService';
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'RequestForm',
  components: {
    AcronymTooltip,
  },
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
      applicationCommentRules: [(v) => !!v || 'Comment is required'],
      ministryRules: [(v) => !!v || 'Ministry is required'],
      errorOccurred: false,
      form: {
        applicationAcronym: '',
        comments: '',
        from: '',
        idir: '',
        ministry: '',
      },
      fieldValidations: FieldValidations,
      registerSuccess: false,
      sending: false,
      valid: false,
      showChesNotice: false,
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
      this.form.ministry = '';
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
    this.showChesNotice = false;
  },
};
</script>

<style scoped>
.request-form {
  max-width: 30rem;
  margin: 0 auto;
}

.pad-tooltip {
  padding-right: 3px;
}
</style>
