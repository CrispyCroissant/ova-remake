import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { mount, VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { createTestingPinia } from '@pinia/testing';
import CTASection from './CTASection.vue';
import LocationInputFields from '../ui/LocationInputFields.vue';

installQuasarPlugin();
enableAutoUnmount(afterEach);

describe('CTASection', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(CTASection, {
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          $router: {
            push: jest.fn(),
          },
        },
      },
    });
  });

  it('validates the form on submit', async () => {
    const submitBtn = wrapper.findComponent({ ref: 'submitBtn' });

    await submitBtn.trigger('submit');

    expect(wrapper.find('.q-field--error').exists()).toBe(true);
  });

  it('does not show a price card by default', () => {
    const priceCard = wrapper.findComponent({ ref: 'priceCard' });

    expect(priceCard.exists()).toBe(false);
  });

  it('shows the price card after successful form submit', async () => {
    const locationFields = wrapper.findComponent(LocationInputFields);
    locationFields.vm.$emit('fareFetched');

    await wrapper.vm.$nextTick();

    const priceCard = wrapper.findComponent({ ref: 'priceCard' });

    expect(priceCard.exists()).toBe(true);
  });

  it('redirects to the ordering page on button click', async () => {
    const locationFields = wrapper.findComponent(LocationInputFields);
    locationFields.vm.$emit('fareFetched');

    await wrapper.vm.$nextTick();

    const orderBtn = wrapper.findComponent({ ref: 'orderBtn' });

    await orderBtn.trigger('click');

    expect(wrapper.vm.$router.push).toBeCalledWith({ path: 'bestall' });
  });
});
