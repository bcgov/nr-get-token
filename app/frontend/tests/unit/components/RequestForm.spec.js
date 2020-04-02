import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import RequestForm from '@/components/RequestForm.vue';
import emailService from '@/services/emailService';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('RequestForm.vue', () => {
  const sendRegEmailSpy = jest.spyOn(emailService, 'sendRegistrationEmail');
  let store;

  beforeEach(() => {
    sendRegEmailSpy.mockReset();
    store = new Vuex.Store();
  });

  it('renders with correct initial form state', () => {
    const email = 'email';
    const idir = 'user@idir';
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        tokenParsed: () => {
          return {
            email: email,
          };
        },
        userName: () => idir
      }
    });

    const wrapper = shallowMount(RequestForm, {
      store,
      localVue,
      stubs: ['BaseDialog']
    });

    expect(wrapper.text()).toContain('Please submit the Acronym of the application you wish to add. You will get an email once it is confirmed.');
    expect(wrapper.vm.form.from).toMatch(email);
    expect(wrapper.vm.form.idir).toMatch(idir);
  });

  it('success dialog can appear when sendRegistrationEmail succeeds', async () => {
    sendRegEmailSpy.mockResolvedValue({});
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        tokenParsed: () => {
          return {
            email: 'email',
          };
        },
        userName: () => 'user@idir'
      }
    });

    const wrapper = shallowMount(RequestForm, {
      store,
      localVue,
      stubs: ['BaseDialog']
    });
    wrapper.vm.$refs.form.validate = () => true;
    await wrapper.vm.postRegistrationForm();
    await localVue.nextTick();

    expect(wrapper.text()).toContain('Please submit the Acronym of the application you wish to add. You will get an email once it is confirmed.');
    expect(wrapper.vm.errorOccurred).toBeFalsy();
    expect(wrapper.vm.registerSuccess).toBeTruthy();
    expect(sendRegEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('error dialog can appear when sendRegistrationEmail fails', async () => {
    sendRegEmailSpy.mockRejectedValue({});
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        tokenParsed: () => {
          return {
            email: 'email',
          };
        },
        userName: () => 'user@idir'
      }
    });

    const wrapper = shallowMount(RequestForm, {
      store,
      localVue,
      stubs: ['BaseDialog']
    });
    wrapper.vm.$refs.form.validate = () => true;
    await wrapper.vm.postRegistrationForm();
    await localVue.nextTick();

    expect(wrapper.text()).toContain('Please submit the Acronym of the application you wish to add. You will get an email once it is confirmed.');
    expect(wrapper.vm.registerSuccess).toBeFalsy();
    expect(wrapper.vm.errorOccurred).toBeTruthy();
    expect(sendRegEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('cancel redirects to about page', async () => {
    const routerPushSpy = jest.fn();
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        tokenParsed: () => {
          return {
            email: 'email',
          };
        },
        userName: () => 'user@idir'
      }
    });

    const wrapper = shallowMount(RequestForm, {
      store,
      localVue,
      mocks: {
        $router: {
          push: routerPushSpy
        }
      },
      stubs: ['BaseDialog']
    });
    await wrapper.vm.cancel();
    await localVue.nextTick();

    expect(routerPushSpy).toHaveBeenCalledTimes(1);
    expect(routerPushSpy).toHaveBeenCalledWith({ name: 'About' });
  });
});
