<template>
  <v-app id="app">
    <Header></Header>
    <Home></Home>
    <Footer></Footer>
  </v-app>
</template>

<script>
  import Header from './components/Header'
  import Home from './components/Home';
  import Footer from './components/Footer'

  export default {
    name: 'app',
    components: {
      Header,
      Home,
      Footer
    }
  }
</script>

<style>
  .v-card--flat{
    background-color: transparent !important;
  }
</style>
