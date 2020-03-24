<template>
  <v-container>
    <BaseSecure>
      <div class="app-breadcrumb">
        <span>
          <router-link :to="{ name: 'MyApps' }">My Applications</router-link>
        </span>
        <span>></span>
        <span>{{acronym}}</span>
      </div>
      <v-tabs vertical class="mt-10 getok-tabs">
        <v-tab>API Access</v-tab>
        <v-tab>Users</v-tab>

        <v-tab-item>
          <v-card flat class="pl-12">
            <v-card-text>
              <p>Sed aliquam ultrices mauris. Donec posuere vulputate arcu. Morbi ac felis. Etiam feugiat lorem non metus. Sed a libero.</p>

              <p>Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit hendrerit rutrum.</p>

              <p
                class="mb-0"
              >Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Phasellus blandit leo ut odio.</p>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat class="pl-12">
            <v-card-text>
              <p class="mb-0">TBA.</p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </BaseSecure>
  </v-container>
</template>

<script>
export default {
  name: 'Application',
  props: ['acronym']
};
</script>

<style lang="scss">
/* Breadcrumb */
.app-breadcrumb {
  margin-top: 0.5em;
  span {
    padding-right: 1em;
  }
}

/* Tab (TODO: if this is used elsewhere in the program, make this style global) */
.getok-tabs {
  .v-tab {
    font-weight: bold;
    &:not(.v-tab--active) {
      background-color: #f2f2f2;
      color: #1a5a96 !important;
      &:hover {
        background-color: #dae8f4;
      }
    }
  }
  .v-tab--active {
    background-color: #1a5a96;
    color: white;
    &:hover {
      background-color: #dae8f4;
      color: #1a5a96;
    }
  }
  .v-tabs-slider {
    display: none;
  }
}
</style>
