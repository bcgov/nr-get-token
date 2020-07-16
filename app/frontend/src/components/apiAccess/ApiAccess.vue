<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-stepper v-model="step" class="elevation-0" alt-labels>
          <v-row no-gutters>
            <v-col cols="12" lg="9" xl="5">
              <v-stepper-header class="elevation-0 pt-4 mb-6">
                <v-stepper-step :complete="step > 1" step="1">Choose Environment</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="step > 2" step="2">Create Client</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="step > 3" step="3">Store Password</v-stepper-step>
              </v-stepper-header>
            </v-col>
          </v-row>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-row no-gutters>
                <v-col cols="12" lg="9" xl="5">
                  <Step1 />
                </v-col>
                <v-col cols="12" lg="9" xl="5" offset="1">
                  <ResourcesSidebar />
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-row no-gutters>
                <v-col cols="12" lg="9" xl="5">
                  <Step2 />
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-row no-gutters>
                <v-col cols="12" lg="9" xl="5">
                  <Step3 />
                </v-col>
              </v-row>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ResourcesSidebar from '@/components/apiAccess/ResourcesSidebar.vue';
import Step1 from '@/components/apiAccess/Step1.vue';
import Step2 from '@/components/apiAccess/Step2.vue';
import Step3 from '@/components/apiAccess/Step3.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ApiAccess',
  components: {
    ResourcesSidebar,
    Step1,
    Step2,
    Step3
  },
  props: ['acronym'],
  computed: {
    ...mapGetters('apiAccess', ['step'])
  },
  methods: {
    ...mapMutations('apiAccess', ['setAcronym', 'setStep']),
    ...mapActions('apiAccess', [
      'getAcronymClientStatus',
      'getAcronymDetails',
      'setStep'
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
