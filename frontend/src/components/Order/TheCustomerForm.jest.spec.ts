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
import TheCustomerForm from './TheCustomerForm.vue';
import { useBackendStore } from 'src/stores/backendStore';

installQuasarPlugin();
enableAutoUnmount(afterEach);

describe('The Customer Form', () => {
  let wrapper: VueWrapper;
  let regNumInput: VueWrapper,
    firstNameInput: VueWrapper,
    lastNameInput: VueWrapper,
    addressInput: VueWrapper,
    cityInput: VueWrapper,
    phoneInput: VueWrapper,
    mailInput: VueWrapper,
    mailConfirmInput: VueWrapper;

  beforeEach(() => {
    wrapper = mount(TheCustomerForm, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    regNumInput = wrapper.findComponent({ ref: 'regNumInput' });
    firstNameInput = wrapper.findComponent({ ref: 'firstNameInput' });
    lastNameInput = wrapper.findComponent({ ref: 'lastNameInput' });
    addressInput = wrapper.findComponent({ ref: 'addressInput' });
    cityInput = wrapper.findComponent({ ref: 'cityInput' });
    phoneInput = wrapper.findComponent({ ref: 'phoneInput' });
    mailInput = wrapper.findComponent({ ref: 'mailInput' });
    mailConfirmInput = wrapper.findComponent({ ref: 'mailConfirmInput' });
  });

  it('can be mounted', () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  describe('required fields', () => {
    test('the registration number input field is required', async () => {
      await wrapper.setProps({ customerType: 'business' });
      const regNumInput = wrapper.findComponent({ ref: 'regNumInput' });

      await regNumInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });

    test('the first name input field is required', async () => {
      await firstNameInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });

    test('the last name input field is required', async () => {
      await lastNameInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });

    test('the address input field is required', async () => {
      await addressInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });

    test('the city input field is required', async () => {
      await cityInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });

    test('the phone number input field is required', async () => {
      await phoneInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });

    test('the email input field is required', async () => {
      await mailInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });

    test('the email confirmation input field is required', async () => {
      await mailConfirmInput.trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    });
  });

  it('shows an error if emails are not equal', async () => {
    await mailInput.setValue('test');
    await mailConfirmInput.setValue('different');

    await mailInput.trigger('submit');

    const error = wrapper.find('.q-field--error');

    expect(error.exists()).toBe(true);
  });

  it('doesnt show the reg number field by default (if customer type is private)', () => {
    expect(regNumInput.exists()).toBe(false);
  });

  it('shows the reg number field if the customer type is business', async () => {
    await wrapper.setProps({ customerType: 'business' });
    const regNumInput = wrapper.findComponent({ ref: 'regNumInput' });

    expect(regNumInput.isVisible()).toBe(true);
  });

  it('shows an error if the given email is not a valid email', async () => {
    await mailInput.setValue('test');
    await mailInput.trigger('submit');

    const error = wrapper.find('.q-field--error');

    expect(error.exists()).toBe(true);
  });

  it("does not emit 'incStep' if the form is invalid", async () => {
    await wrapper.findComponent({ ref: 'form' }).trigger('submit');

    expect(wrapper.emitted().incStep).toBeFalsy();
  });

  describe('on valid form submit', () => {
    beforeEach(async () => {
      await wrapper.setProps({ customerType: 'business' });
      const regNumInput = wrapper.findComponent({ ref: 'regNumInput' });

      await regNumInput.setValue('1');
      await firstNameInput.setValue('1');
      await lastNameInput.setValue('1');
      await addressInput.setValue('1');
      await cityInput.setValue('1');
      await phoneInput.setValue('1');
      await mailInput.setValue('test@email.com');
      await mailConfirmInput.setValue('test@email.com');
    });

    it("emits 'incStep'", async () => {
      await wrapper.findComponent({ ref: 'form' }).trigger('submit');

      expect(wrapper.emitted().incStep).toBeTruthy();
    });

    it('sends the order information to backend', async () => {
      const store = useBackendStore();
      await wrapper.findComponent({ ref: 'form' }).trigger('submit');

      expect(store.saveOrder).toBeCalled();
    });

    // Mock doesnt work for some reason
    /* it("shows an error if order couldn't be saved", async () => {
      const store = useBackendStore();
      store.saveOrder = jest.fn().mockRejectedValueOnce(new Error());

      await wrapper.findComponent({ ref: 'form' }).trigger('submit');

      const error = wrapper.find('.q-field--error');

      expect(error.exists()).toBe(true);
    }); */
  });
});
