<template>
  <v-dialog v-if="showDialog" v-model="showDialog" width="500">
    <v-card>
      <div class="dialog-body">
        <v-card-title class primary-title>
          <slot name="title"></slot>
        </v-card-title>
        <v-card-text>
          <div class="dialog-icon">
            <slot name="icon">
              <v-icon medium>default-icon</v-icon>
            </slot>
          </div>
          <div class="dialog-text">
            <slot name="text">default text</slot>
          </div>
        </v-card-text>
      </div>
      <v-card-actions class="justify-center">
        <v-btn class="BC-Gov-PrimaryButton mb-5" text @click="showDialog = false">
          <slot name="button-text">OK</slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: ['show'],
  data: function() {
    return {
      showDialog: this.show
    };
  }
};
</script>

<style scoped>
.v-card__text {
  display: flex !important;
  padding: 20px;
}
.dialog-icon {
  margin-right: 10px;
  object-fit: contain;
  align-self: flex-start;
}
.dialog-text {
  flex: 1 1 auto;
}
</style>
