import { createLocalVue, shallowMount } from '@vue/test-utils';
import router from '@/router';
import RequestForm from '@/components/RequestForm.vue';

const localVue = createLocalVue();

localVue.use(router);





describe('RequestForm.vue', () => {

  console.log (localVue.options.components);

  it('renders', () => {
    const wrapper = shallowMount(RequestForm, { localVue });


    expect(wrapper.text()).toMatch('Request Account');
  });
});

