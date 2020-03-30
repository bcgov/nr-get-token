<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" lg="9">
        <v-stepper v-model="step" class="elevation-0">
          <v-stepper-header class="elevation-0 pt-4 mb-6">
            <v-stepper-step :complete="step > 1" step="1" />
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 2" step="2" />
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 3" step="3" />
            <v-divider></v-divider>
            <v-stepper-step step="4" />
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <Step1 />
            </v-stepper-content>

            <v-stepper-content step="2">
              <Step2 />
            </v-stepper-content>

            <v-stepper-content step="3">
              <Step3 />
            </v-stepper-content>

            <v-stepper-content step="4">
              <Step4 />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Step1 from '@/components/apiAccess/Step1.vue';
import Step2 from '@/components/apiAccess/Step2.vue';
import Step3 from '@/components/apiAccess/Step3.vue';
import Step4 from '@/components/apiAccess/Step4.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ApiAccess',
  components: {
    Step1,
    Step2,
    Step3,
    Step4
  },
  props: ['acronym'],
  computed: {
    ...mapGetters('apiAccess', ['step'])
  },
  methods: {
    ...mapMutations('apiAccess', ['setStep', 'setAcronym']),
    ...mapActions('apiAccess', [
      'setStep',
      'getAcronymClientStatus',
      'getAcronymDetails'
    ])
  },
  created() {
    this.setAcronym(this.acronym);
    this.getAcronymDetails();
    this.getAcronymClientStatus();
  }
};
</script>

<style scoped>
.v-stepper__content {
  padding-left: 0;
}
</style>
