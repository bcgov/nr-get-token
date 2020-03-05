import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloCall.vue';

describe('HelloWorld.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(HelloWorld);
    expect(wrapper.text()).toMatch('???');
  });
});
