import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { mount, VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { useFrontEndStore } from 'src/stores/frontendStore';
import CardPrice from './CardPrice.vue';

installQuasarPlugin();
enableAutoUnmount(afterEach);

describe('CardPrice', () => {
  let wrapper: VueWrapper;
  let pinia = createTestingPinia();
  let store = useFrontEndStore();

  beforeEach(() => {
    pinia = createTestingPinia();
    store = useFrontEndStore();

    wrapper = mount(CardPrice, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('shows the total price for the transport', async () => {
    store.order.priceTotal = 1234;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#price').text()).toBe('1\xa0234\xa0kr');
  });

  it('shows the total transport distance', async () => {
    store.order.distance = 500000;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#total-dist').text()).toBe('500 km');
  });

  it('does not display any zip codes', async () => {
    store.order.from = '123 32 Place';
    store.order.to = '443 12 Place2';

    await wrapper.vm.$nextTick();

    const locations = wrapper.find('#locs');

    expect(locations.text()).toBe('Place - Place2');
  });

  it('shows a shorter location name if the full name is too long', async () => {
    store.order.from = 'aaaaaaaaaaaa, Place, Sverige';
    store.order.to = 'bbbbbbbbbbbb, Place2, Sverige';

    await wrapper.vm.$nextTick();

    const locations = wrapper.find('#locs');

    expect(locations.text()).toBe('Place - Place2');
  });
});
