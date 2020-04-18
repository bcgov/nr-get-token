<template>
  <v-form v-model="step1Valid">
    Application Acronym:
    <strong>{{ userAppCfg.applicationAcronym }}</strong>
    <v-row>
      <v-col cols="12" md="9">
        <v-text-field
          label="Application Name"
          required
          v-model="applicationName"
          :counter="fieldValidations.NAME_MAX_LENGTH"
          :rules="applicationNameRules"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-text-field
      label="Application Description"
      required
      v-model="applicationDescription"
      :counter="fieldValidations.DESCRIPTION_MAX_LENGTH"
      :rules="applicationDescriptionRules"
    ></v-text-field>
    <v-select
      :items="csList"
      label="Common Service(s) Required"
      multiple
      chips
      deletable-chips
      v-model="commonServices"
    ></v-select>

    <v-btn color="primary" @click="next" :disabled="!step1Valid">Next</v-btn>
  </v-form>
</template>

<script>
import { CommonServiceTypes, CommonServiceList} from '@/utils/commonServices.js';
import { FieldValidations } from '@/utils/constants.js';

import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      fieldValidations: FieldValidations,
      step1Valid: false,
      applicationNameRules: [
        v => !!v || 'Name is required',
        v =>
          v.length <= FieldValidations.NAME_MAX_LENGTH ||
          `Name must be ${FieldValidations.NAME_MAX_LENGTH} characters or less`
      ],
      applicationDescriptionRules: [
        v => !!v || 'Description is required',
        v => {
          const max = FieldValidations.DESCRIPTION_MAX_LENGTH;
          return (
            v.length <= max || `Description must be ${max} characters or less`
          );
        }
      ]
    };
  },
  computed: {
    ...mapGetters('webadeAccess', ['showWebadeNrosDmsOption', 'userAppCfg']),
    applicationName: {
      get() { return this.userAppCfg.applicationName; },
      set(value) { this.updateUserAppCfg({['applicationName']: value}); }
    },
    applicationDescription: {
      get() { return this.userAppCfg.applicationDescription; },
      set(value) { this.updateUserAppCfg({['applicationDescription']: value}); }
    },
    commonServices: {
      get() { return this.userAppCfg.commonServices; },
      set(value) { this.updateUserAppCfg({['commonServices']: value}); }
    },
    csList: function() {
      return CommonServiceList.filter(
        serv =>
          serv.type === CommonServiceTypes.WEBADE &&
          (serv.abbreviation !== 'nros-dms' || this.showWebadeNrosDmsOption)
      ).map(serv => ({
        text: serv.name,
        value: serv.abbreviation,
        disabled: serv.disabled
      }));
    }
  },
  methods: {
    ...mapMutations('webadeAccess', ['setConfigFormStep', 'updateUserAppCfg']),
    next() {
      this.setConfigFormStep(2);
    }
  }
};
</script>

<style scoped>
.commonSvcBtn {
  min-height: 100px;
}
.underbutton {
  padding-left: 20px;
  margin-bottom: 15px;
}
</style>
