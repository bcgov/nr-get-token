import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import ConfigGeneratedJson from '@/components/ConfigGeneratedJson.vue';

describe('ConfigGeneratedJson.vue', () => {
  let getters;
  let store;
  let wrapper;

  beforeEach(() => {
    const localVue = createLocalVue();

    localVue.use(Vuetify);
    localVue.use(Vuex);

    getters = {
      isAuthenticated: () => 'false'
    };

    store = new Vuex.Store({
      getters
    });

    wrapper = mount(ConfigGeneratedJson, {
      localVue,
      store
    });
  });

  it('has the textbox with the appropriate label', () => {
    expect(wrapper.html()).toContain('WebADE Application Configuration');
  });

  it('adds the snackbar text ', () => {
    expect(wrapper.html()).not.toContain('Application Configuration copied to clipboard');
    wrapper.vm.clipboardSuccessHandler();
    expect(wrapper.html()).toContain('Application Configuration copied to clipboard');

    expect(wrapper.html()).not.toContain('Error attempting to copy to clipboard');
    wrapper.vm.clipboardErrorHandler();
    expect(wrapper.html()).toContain('Error attempting to copy to clipboard');
  });

  it('can run the downloadFile method to add the clipboard download', () => {
    expect(wrapper.html()).not.toContain('hiddenDownloadTextElement');
    wrapper.vm.downloadFile();

    // hard to test anything from this method above as it adds and removes it from the dom during the scope. So just test for coverage and that it doesn't blow up.
  });


});
