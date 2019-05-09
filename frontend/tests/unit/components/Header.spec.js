import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify';
import Header from '@/components/Header.vue'

describe('Header.vue', () => {
  let wrapper;

  beforeEach(() => {
    const localVue = createLocalVue();

    localVue.use(Vuetify);

    wrapper = mount(Header, {
      localVue: localVue
    });
  });

  it('has the bcgov link', () => {
    expect(wrapper.html()).toContain('<a href="https://www2.gov.bc.ca">')
  })

  it('has the app title', () => {
    expect(wrapper.html()).toContain('NATURAL RESOURCES GET TOKEN')
  })
})
