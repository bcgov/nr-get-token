<template>
  <v-card>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Grant Access</v-card-title>
    </v-toolbar>

    <v-skeleton-loader type="article, actions" :loading="loading">
      <v-form @submit.prevent="submit" ref="form" lazy-validation>
        <v-container>
          <p>
            After a user requests access to GETOK, you can grant them access to
            an Acronym here. There will be an email in the
            <em>NR Common Services</em> inbox with their access request details.
          </p>
          <p>
            If the Acronym does not exist in GETOK, the form below will add it.
            Or select an existing Acronym to grant access to the user.
          </p>
          <p>
            After access is granted the requestor will recieve an email and they
            can come back with their access and
            <strong>self-serve</strong> manage their service clients.
            <strong>
              You should not do anything manual in Keycloak as part of this
              process!
            </strong>
          </p>
          <v-row align="center">
            <v-col sm="6" lg="4" class="pt-2">
              <label>Application Acronym &nbsp;</label>
              <AcronymTooltip />
              <v-combobox
                v-model="selectedAcronym"
                dense
                flat
                hide-no-data
                hint="Select an existing acronym or add a new one"
                :items="acronyms"
                persistent-hint
                :disabled="readOnly"
                required
                :rules="acronymRules"
                single-line
                solo
                outlined
              />
            </v-col>
            <v-col sm="6" lg="4" class="pt-2">
              <label>Ministry</label>
              <v-text-field
                v-model="ministry"
                dense
                flat
                hint="Acronym of the ministry this new Acronym is under"
                persistent-hint
                :disabled="readOnly"
                required
                :rules="ministryRules"
                single-line
                solo
                outlined
              />
            </v-col>
            <v-col sm="6" lg="4" class="pt-2">
              <label>Contact</label>
              <v-text-field
                v-model="contact"
                dense
                flat
                hint="Generally the email of either the Product Owner or Technical Lead"
                persistent-hint
                :disabled="readOnly"
                required
                :rules="contactRules"
                single-line
                solo
                outlined
              />
            </v-col>
            <v-col sm="6" lg="4">
              <label>IDIR</label>
              <v-text-field
                v-model="idir"
                dense
                flat
                hint="The IDIR (ex: 'loneil') of the user requesting access"
                persistent-hint
                :disabled="readOnly"
                required
                :rules="idirRules"
                single-line
                solo
                outlined
              />
            </v-col>
            <v-col sm="6" lg="4">
              <label>Comment</label>
              <v-textarea
                v-model="comment"
                dense
                flat
                hint="Optional comment to include in the email to the requestor"
                persistent-hint
                :disabled="readOnly"
                rows="1"
                single-line
                solo
                outlined
              />
            </v-col>
          </v-row>

          <div v-if="accessGrantResult" class="my-6">
            <v-icon color="success">check_circle</v-icon>
            The user
            <strong>{{ accessGrantResult.user.username }}</strong>
            ({{ accessGrantResult.user.displayName }}) was registered to
            <strong>{{ this.selectedAcronym }}</strong> and an email was
            dispatched to <strong>{{ accessGrantResult.email }}</strong> <br />
            <small>
              Please close any open
              <a
                href="https://github.com/bcgov/nr-get-token/issues"
                target="_blank"
              >
                github issue</a
              >
              and note the access details including the date/time.
            </small>
          </div>
        </v-container>

        <v-card-actions>
          <v-btn outlined @click="resetForm">
            <v-icon left>mdi-refresh</v-icon>
            <span>Reset</span>
          </v-btn>
          <v-spacer />
          <v-btn color="primary" depressed :loading="loading" @click="submit">
            <v-icon left>add_circle</v-icon>
            <span>Grant Access</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-skeleton-loader>

    <BaseDialog
      :show="confirmDialog"
      :type="!grantInProgress ? 'CONTINUE' : ''"
      @close-dialog="confirmDialog = false"
      @continue-dialog="grantAccess()"
      width="700"
    >
      <template v-slot:icon>
        <v-icon v-if="!grantInProgress" large color="orange darken-2">
          warning
        </v-icon>
      </template>
      <template v-slot:text>
        <div v-if="grantInProgress" class="text-center">
          <v-progress-circular indeterminate color="primary" :size="120">
            Submitting
          </v-progress-circular>
        </div>
        <div v-else>
          <p v-if="isExistingAcronym">
            This will add the user <strong>{{ idir }}</strong> to the existing
            <strong>{{ selectedAcronym }}</strong> acronym.
          </p>
          <p v-else>
            This will create a new
            <strong>{{ selectedAcronym }}</strong> acronym and add the user
            <strong>{{ idir }}</strong> to it.
          </p>

          <p class="mb-3">
            <strong>
              Details of the email that will be sent to {{ idir }}:
            </strong>
            <br />
            (email will also be CC'd to
            <em>NR.CommonServiceShowcase@gov.bc.ca</em>)
          </p>
          <p class="email-preview">
            <strong>Application Acronym:</strong> {{ selectedAcronym }} <br />
            <strong>Ministry:</strong> {{ ministry }} <br />
            <strong>Contact:</strong> {{ contact }} <br />
            <strong>Requested by:</strong> {{ idir }} <br />
            <strong>Comments:</strong> {{ comment ? comment : 'N/A' }} <br />
            <strong>Status: </strong>
            <span class="green--text">
              {{ msgStatus }}
            </span>
            <br />
            <strong>Next Step:</strong> {{ msgNextSteps }} <br />
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
          An error occurred trying to grant access for {{ idir }} to
          {{ selectedAcronym }}
        </p>
        <p>{{ error }}</p>
      </template>
    </BaseDialog>
  </v-card>
</template>

<script>
import acronymService from '@/services/acronymService';
import AcronymTooltip from '@/components/AcronymTooltip.vue';
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'AccessGrant',
  components: {
    AcronymTooltip,
  },
  data() {
    return {
      acronymRules: [
        (v) => !!v || 'Acronym is required',
        (v) =>
          (v && v.length <= FieldValidations.ACRONYM_MAX_LENGTH) ||
          `Acronym must be ${FieldValidations.ACRONYM_MAX_LENGTH} characters or less`,
        (v) =>
          /^(?:[A-Z]{1,}[_]?)+[A-Z]{1,}$/g.test(v) ||
          'Incorrect format. Hover over ? for details.',
      ],
      ministryRules: [(v) => !!v || 'Ministry is required'],
      contactRules: [(v) => !!v || 'Contact is required'],
      idirRules: [(v) => !!v || 'IDIR is required'],

      accessGrantResult: null,
      acronyms: [],
      ministry: undefined,
      contact: undefined,
      comment: undefined,
      confirmDialog: false,
      error: undefined,
      errorDialog: false,
      grantInProgress: false,
      idir: undefined,
      loading: true,
      readOnly: false,
      selectedAcronym: undefined,
      test: undefined,
    };
  },
  computed: {
    msgNextSteps() {
      return this.isExistingAcronym
        ? 'Manage Your Application'
        : 'Finish Registration';
    },
    msgStatus() {
      return this.isExistingAcronym ? 'TEAM MEMBER ADDED' : 'APPROVED';
    },
    isExistingAcronym() {
      return this.acronyms && this.acronyms.includes(this.selectedAcronym);
    },
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
      this.accessGrantResult = null;
      this.readOnly = false;
    },
    async getAcronyms() {
      const res = await acronymService.getAllAcronyms();
      this.acronyms = res.data.map((a) => a.acronym).sort();
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.confirmDialog = true;
      }
    },
    async grantAccess() {
      this.accessGrantResult = null;
      this.error = undefined;
      this.grantInProgress = true;
      try {
        const res = await acronymService.registerUserToAcronym(
          this.selectedAcronym,
          this.idir,
          {
            ministry: this.ministry,
            contact: this.contact,
            comment: this.comment,
            status: this.msgStatus,
            nextSteps: this.msgNextSteps,
          }
        );
        this.accessGrantResult = res.data;
        this.readOnly = true;
      } catch (error) {
        this.error = error.response
          ? `${error.response.status}: ${JSON.stringify(error.response.data)}`
          : error;
        this.errorDialog = true;
      } finally {
        this.confirmDialog = false;
        // To give the animation enough time to fade so it doesn't juke a little
        setTimeout(() => (this.grantInProgress = false), 1000);
        this.getAcronyms();
      }
    },
  },
  async mounted() {
    await this.getAcronyms();
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.email-preview {
  padding: 1em;
  border: 1px solid #003366;
  line-height: 220%;
}
</style>
