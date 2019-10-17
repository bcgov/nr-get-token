import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Footer from '@/components/Footer.vue';

describe('Footer.vue', () => {
  let wrapper;

  beforeEach(() => {
    const localVue = createLocalVue();

    localVue.use(Vuetify);

    wrapper = mount(Footer, {
      localVue: localVue
    });
  });

  it('renders', () => {
    expect(wrapper.html()).toContain('https://www.gov.bc.ca/');
  });
});
