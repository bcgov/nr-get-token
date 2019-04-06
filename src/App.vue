<template>
  <v-app id="app">
    <v-content>
      <h1>Natural Resources Get Token</h1>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
  import Footer from './components/Footer'

  export default {
    name: 'app',
    components: {
      Footer
    }
  }
</script>

<style>
  .v-card--flat{
    background-color: transparent !important;
  }
</style>
