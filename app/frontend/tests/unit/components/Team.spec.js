import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import Team from '@/components/Team.vue';
import acronymService from '@/services/acronymService';

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('RequestForm.vue', () => {
  const usersSpy = jest.spyOn(acronymService, 'getUsers');

  beforeEach(() => {
    usersSpy.mockReset();
  });

  it('renders with correct initial form state', () => {
    const wrapper = shallowMount(Team, {
      localVue,
      stubs: ['BaseDialog']
    });

    expect(wrapper.text()).toContain('Team members');
    expect(wrapper.vm.usersLoaded).toEqual(false);
    expect(wrapper.vm.errorLoadingUsers).toEqual(false);
  });

  // it('renders correctly after mount with empty users', () => {
  //   usersSpy.mockResolvedValue({ data: [] });

  //   const wrapper = shallowMount(Team, {
  //     localVue,
  //     stubs: ['BaseDialog']
  //   });

  //   expect(wrapper.vm.usersLoaded).toEqual(true);
  //   expect(wrapper.vm.usersLoaded).toEqual([]);
  //   expect(wrapper.vm.errorLoadingUsers).toEqual(false);
  // });
});
