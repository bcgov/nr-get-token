<template>
  <v-btn class="mr-2" color="success" @click="registrationDialog = true">
    Register New App
    <v-dialog v-model="registrationDialog" persistent max-width="700">
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">email</v-icon>Register New App
        </v-card-title>
        <v-card-text>
          <p>
            Please supply the acronym of the application you wish to register (along with any optional comments)
            and a communication will be passed along to authorize you for that application.
          </p>
          <p class="mb-0">
            My Email:
            <strong>lucas.oneil@gov.bc.ca</strong>
            <br>
            My IDIR:
            <strong>loneil</strong>
          </p>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="applicationAcronym" label="Application Acronym"></v-text-field>
            </v-col>
          </v-row>

          <v-textarea v-model="comments" rows="1" auto-grow label="Comments"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info darken-1" text @click="registrationDialog = false">FINISHED</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>


<script>
import ApiService from '@/common/apiService';

export default {
  data: function() {
    return {
      registrationDialog: false,
      applicationAcronym: '',
      comments: '',
      errorMessage: ''
    };
  },
  methods: {
    async postRegistrationForm() {
      if (this.$refs.form.validate()) {
        try {
          const response = await ApiService.sendRegistrationEmail({
            applicationAcronym: this.applicationAcronym,
            comments: this.comments,
            from: 'lucas.oneil@gov.bc.ca',
            idir: 'loneil'
          });
          if (response) {
            this.insecurePasswordsList = response;
          } else {
            this.errorMessage = 'Error occurred trying to fetch preferences.';
          }
        } catch (error) {
          this.errorMessage = 'Error occurred trying to fetch preferences.';
        }
        this.searching = false;
      }
    }
  }
};
</script>
