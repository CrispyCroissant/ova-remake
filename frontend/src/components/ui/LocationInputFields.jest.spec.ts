import {
  describe,
  it,
  test,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { mount, VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { createTestingPinia } from '@pinia/testing';
import LocationInputFields from './LocationInputFields.vue';
import { useFrontEndStore } from 'src/stores/frontendStore';

installQuasarPlugin();
enableAutoUnmount(afterEach);

describe('LocationInputFields', () => {
  let wrapper: VueWrapper;
  let fromInput: VueWrapper, toInput: VueWrapper, form: VueWrapper;

  beforeEach(() => {
    wrapper = mount(LocationInputFields, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    fromInput = wrapper.findComponent({ ref: 'fromInput' });
    toInput = wrapper.findComponent({ ref: 'toInput' });
    form = wrapper.findComponent({ ref: 'form' });
  });

  it('can be mounted', () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  test('from field is required', async () => {
    await toInput.setValue('test');
    await form.trigger('submit');

    const error = wrapper.find('.q-field--error');

    expect(error.exists()).toBe(true);
  });

  test('to field is required', async () => {
    await fromInput.setValue('test');
    await form.trigger('submit');

    const error = wrapper.find('.q-field--error');

    expect(error.exists()).toBe(true);
  });

  it("emits 'incStep' if the fields are valid", async () => {
    const store = useFrontEndStore();

    store.$patch({ order: { from: 't', to: 't' } });

    await wrapper.vm.$nextTick();

    await fromInput.setValue('1');
    await toInput.setValue('1');
    await form.trigger('submit');

    expect(wrapper.emitted().incStep).toBeTruthy();
  });

  it("does not emit 'incStep' if the fields are invalid", async () => {
    await form.trigger('submit');

    expect(wrapper.emitted().incStep).toBeFalsy();
  });

  it("calls on the store's fare fetching method on validation success", async () => {
    const store = useFrontEndStore();

    store.$patch({ order: { from: 'test', to: 'test' } });
    await wrapper.vm.$nextTick();
    await form.trigger('submit');

    expect(store.fetchFare).toBeCalled();
  });

  it('shows an error if the fare fetching method throws one', async () => {
    const store = useFrontEndStore();

    store.$patch({ order: { from: 'test', to: 'test' } });
    store.fetchFare = jest.fn().mockRejectedValueOnce(new Error());

    await wrapper.vm.$nextTick();
    await form.trigger('submit');

    const error = wrapper.find('.q-field--error');

    expect(error.exists()).toBe(true);
  });

  it("does not show an error if there's no error", () => {
    const error = wrapper.find('.q-field--error');
    expect(error.exists()).toBe(false);
  });

  it('the from input field has a loading prop', async () => {
    expect(fromInput.props('loading')).not.toBe(undefined);
  });

  it('the to input field has a loading prop', async () => {
    expect(toInput.props('loading')).not.toBe(undefined);
  });

  it('removes the loading notifications after fare has been fetched', async () => {
    await form.trigger('submit');

    expect(fromInput.props('loading')).toBe(false);
    expect(toInput.props('loading')).toBe(false);
  });

  // This emit will be used to show the results (on the home page only)
  it("emits 'fareFetched' when fare has been successfully fetched", async () => {
    const store = useFrontEndStore();

    store.$patch({ order: { from: 't', to: 't' } });

    await wrapper.vm.$nextTick();
    await form.trigger('submit');

    expect(wrapper.emitted().fareFetched).toBeTruthy();
  });
});
