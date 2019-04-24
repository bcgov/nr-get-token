import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify';
import Footer from '@/components/Footer.vue'

describe('Footer.vue', () => {
  let wrapper;

  beforeEach(() => {
    const localVue = createLocalVue();

    localVue.use(Vuetify);

    wrapper = mount(Footer, {
      localVue: localVue

    });
  });

  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain('<a href="https://www.gov.bc.ca/" class="v-btn v-btn--flat theme--light" id="footer-home"><div class="v-btn__content">Home</div></a>')
  })
})
