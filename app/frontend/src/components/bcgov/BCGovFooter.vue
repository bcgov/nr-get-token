<template>
  <footer class="gov-footer v-footer">
    <v-btn text id="footer-home" href="https://www.gov.bc.ca/">
      <span>Home</span>
    </v-btn>
    <v-btn text id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">
      <span>About gov.bc.ca</span>
    </v-btn>
    <v-btn text id="footer-disclaimer" href="http://gov.bc.ca/disclaimer">
      <span>Disclaimer</span>
    </v-btn>
    <v-btn text id="footer-privacy" href="http://gov.bc.ca/privacy">
      <span>Privacy</span>
    </v-btn>
    <v-btn text id="footer-accessibility" href="http://gov.bc.ca/webaccessibility">
      <span>Accessibility</span>
    </v-btn>
    <v-btn text id="footer-copyright" href="http://gov.bc.ca/copyright">
      <span>Copyright</span>
    </v-btn>
    <v-btn text id="footer-contact" href="https://www2.gov.bc.ca/gov/content/home/contact-us">
      <span>Contact Us</span>
    </v-btn>
  </footer>
</template>

<script>
export default {
  name: 'BCGovFooter'
};
</script>

<style lang="scss" scoped>
.gov-footer {
  a {
    color: #ffffff;
    font-size: 1rem;
    &:focus {
      outline: none;
    }
  }

  .v-btn {
    color: #ffffff;
    font-size: 1rem;
    text-decoration: none;
    text-transform: none;
  }
  
  &.v-footer {
    background-color: #003366;
    border-top: 2px solid #fcba19;
    flex-shrink: 0;
    min-height: 2.5rem;
    min-width: 100%;
    padding-bottom: 0;
    padding-top: 0;
  }
}
</style>
