<template>
  <v-footer absolute padless class="footer">
    <v-container class="py-0">
      <v-row >
        <v-btn text id='footer-home' href="https://www.gov.bc.ca/">Home</v-btn>
        <v-btn text id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">About gov.bc.ca</v-btn>
        <v-btn text id="footer-disclaimer" href="http://gov.bc.ca/disclaimer">Disclaimer</v-btn>
        <v-btn text id="footer-privacy" href="http://gov.bc.ca/privacy">Privacy</v-btn>
        <v-btn text id="footer-accessibility" href="http://gov.bc.ca/webaccessibility">Accessibility</v-btn>
        <v-btn text id="footer-copyright" href="http://gov.bc.ca/copyright">Copyright</v-btn>
        <v-btn text href="https://www2.gov.bc.ca/gov/content/home/contact-us">Contact Us</v-btn>
        <v-btn text href="https://bcgov.github.io/common-service-showcase" target="_blank">Common Service Showcase</v-btn>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {};
</script>

<style>
  .footer .container {
    background-color: rgb(0, 51, 102);
    border-top: 2px solid rgb(252, 186, 25);
    min-height: 45px;
    min-width: 100%;
  }

  .footer .v-btn {
    color: #fff;
    text-decoration: none;
    text-transform: capitalize;
    font-size: 80%;
    font-weight: 300;
  }
  .v-btn--active.footer:before,
  .v-btn.footer:focus:before,
  .v-btn.footer:hover:before {
    background: none;
  }
</style>
