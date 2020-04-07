<template>
  <div>
    {{ env }}:
    <span :class="display.class">{{ display.text }}</span>
  </div>
</template>

<script>
import { KcClientStatus, KcEnv } from '@/utils/constants';
export default {
  name: 'ClientStatus',
  props: {
    // Environment to display
    env: {
      type: String,
      required: true
    },
    // The service client status object from the api call
    clientStatuses: {
      type: Object,
      required: true
    }
  },
  computed: {
    display() {
      let label = KcClientStatus.NOT;
      if (this.clientStatuses) {
        // If the client exists, mark as CREATED
        // If it doesn't, it's READY if the previous env has been created, otherwise NOT available
        if (this.env === KcEnv.DEV) {
          label = this.clientStatuses.dev ? KcClientStatus.CREATED : KcClientStatus.READY;
        } else if (this.env === KcEnv.TEST) {
          if (this.clientStatuses.test) {
            label = KcClientStatus.CREATED;
          } else {
            label = this.clientStatuses.dev ? KcClientStatus.READY : KcClientStatus.NOT;
          }
        } else if (this.env === KcEnv.PROD) {
          if (this.clientStatuses.prod) {
            label = KcClientStatus.CREATED;
          } else {
            label = this.clientStatuses.test ? KcClientStatus.READY : KcClientStatus.NOT;
          }
        }
      }
      return {
        class: label === KcClientStatus.CREATED || label === KcClientStatus.READY ? 'green--text' : '',
        text: label
      };
    },
  }
};
</script>

