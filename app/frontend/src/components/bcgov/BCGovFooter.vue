<template>
  <footer class="gov-footer v-footer">
    <v-btn text id="footer-home" href="https://www.gov.bc.ca/">Home</v-btn>
    <v-btn
      text
      id="footer-about"
      href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca"
    >About gov.bc.ca</v-btn>
    <v-btn text id="footer-disclaimer" href="http://gov.bc.ca/disclaimer">Disclaimer</v-btn>
    <v-btn text id="footer-privacy" href="http://gov.bc.ca/privacy">Privacy</v-btn>
    <v-btn text id="footer-accessibility" href="http://gov.bc.ca/webaccessibility">Accessibility</v-btn>
    <v-btn text id="footer-copyright" href="http://gov.bc.ca/copyright">Copyright</v-btn>
    <v-btn
      text
      id="footer-contact"
      href="https://www2.gov.bc.ca/gov/content/home/contact-us"
    >Contact Us</v-btn>
  </footer>
</template>

<script>
export default {
  name: 'BCGovFooter'
};
</script>

<style scoped>
.gov-footer.v-footer {
  bottom: 0;
  background-color: #003366;
  border-top: 2px solid #fcba19;
  min-height: 2.5rem;
  min-width: 100%;
  padding-bottom: 0;
  padding-top: 0;
  position: absolute;
}

.gov-footer .v-btn {
  color: #ffffff;
  text-decoration: none;
  text-transform: none;
  font-size: 0.8rem;
}

.v-btn--active.gov-footer:before,
.v-btn.gov-footer:focus:before,
.v-btn.gov-footer:hover:before {
  background: none;
}

.gov-footer a {
  font-size: 0.8rem;
  font-weight: normal;
  color: #ffffff;
}

.gov-footer a:hover {
  color: #ffffff;
  text-decoration: underline;
}

.gov-footer a:focus {
  outline: none;
}
</style>
