<template>
  <v-dialog
    :max-width="width"
    persistent
    v-model="show"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
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
        <v-btn class="BC-Gov-PrimaryButton mb-5" text @click="closeDialog">
          <slot name="button-text">OK</slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import '@/assets/scss/style.scss';

export default {
  name: 'BaseDialog',
  props: {
    show: {
      default: false,
      type: Boolean
    },
    width: {
      default: '500',
      type: String
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    }
  }
};
</script>

<style scoped>
.v-card__text {
  display: flex !important;
  padding: 1.5rem;
}
.dialog-icon {
  margin-right: 1rem;
  object-fit: contain;
  align-self: flex-start;
}
.dialog-text {
  flex: 1 1 auto;
  width: 90%;
}
</style>
