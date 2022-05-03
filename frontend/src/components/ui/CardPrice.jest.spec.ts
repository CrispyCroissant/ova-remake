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

  it("shows the first 'from' and last 'to' in the trips as 'Vårt garage'", async () => {
    store.order.trips = [
      { from: 'Place1', to: 'Place2', distance: 100 },
      { from: 'Place3', to: 'Place4', distance: 200 },
      { from: 'Place5', to: 'Place6', distance: 300 },
    ];
    await wrapper.vm.$nextTick();

    const trips = wrapper.findAll('.q-breadcrumbs__el');

    expect(trips[0].text()).toBe('Vårt garage');
    expect(trips[1].text()).toBe('Place2');
    expect(trips[2].text()).toBe('Place3');
    expect(trips[3].text()).toBe('Place4');
    expect(trips[4].text()).toBe('Place5');
    expect(trips[5].text()).toBe('Vårt garage');
  });

  it('shows the distance for each trip', async () => {
    store.order.trips = [
      { from: 'Place1', to: 'Place2', distance: 150400 },
      { from: 'Place3', to: 'Place4', distance: 223400 },
      { from: 'Place5', to: 'Place6', distance: 331200 },
    ];
    await wrapper.vm.$nextTick();

    const distances = wrapper.findAll('.trip-dist');

    expect(distances[0].text()).toBe('150 km');
    expect(distances[1].text()).toBe('223 km');
    expect(distances[2].text()).toBe('331 km');
  });

  it('shows the total price for the transport', async () => {
    store.order.priceTotal = 1234;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#price').text()).toBe('Totalt: 1\xa0234\xa0kr');
  });

  it('shows the total transport distance', async () => {
    store.order.distance = 500000;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#total-dist').text()).toBe('500 km');
  });

  it('does not display any zip codes', async () => {
    store.order.trips = [
      { from: 'Place1', to: '893 31 Bjästa', distance: 1000 },
      { from: 'Place3', to: '103 21 Rovers', distance: 2000 },
    ];
    await wrapper.vm.$nextTick();

    const trips = wrapper.findAll('.q-breadcrumbs__el');

    expect(trips[0].text()).toBe('Vårt garage');
    expect(trips[1].text()).toBe('Bjästa');
    expect(trips[2].text()).toBe('Place3');
    expect(trips[3].text()).toBe('Rovers');
  });
});
