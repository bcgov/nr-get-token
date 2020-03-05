<template>
  <v-container class="hello-call text-center">
    <v-btn
      @click="getHello"
      color="primary"
      class="hello-call-btn"
      id="hello-call-btn"
      large
      :loading="loading"
    >
      <v-icon left>mdi-hexagon-multiple</v-icon>
      <span>Get Response</span>
    </v-btn>
    <p>{{ helloData }}</p>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      helloData: '???',
      loading: false
    };
  },
  methods: {
    async getHello() {
      try {
        this.loading = true;
        const response = await this.$httpApi.get('/hello');
        this.helloData = response.data;
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
        this.helloData = ':(';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>



