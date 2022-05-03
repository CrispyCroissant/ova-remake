<template>
  <div class="flex column flex-center">
    <p class="text-h6">Din information</p>
    <q-form
      ref="form"
      autofocus
      style="min-width: 15rem; max-width: 30rem"
      @submit="validate"
      @validation-success="sendOrder"
    >
      <div class="row justify-center">
        <q-input
          ref="regNumInput"
          v-model="customer.regNumber"
          label="Organisationsnummer"
          filled
          :rules="[required]"
          no-error-icon
          v-if="showRegField"
          :error="hasError"
        ></q-input>
      </div>
      <div class="row justify-center">
        <q-input
          ref="firstNameInput"
          v-model="customer.firstName"
          label="Förnamn"
          filled
          no-error-icon
          :rules="[required]"
          class="q-my-sm"
          :error="hasError"
        ></q-input>
        <q-input
          ref="lastNameInput"
          v-model="customer.lastName"
          label="Efternamn"
          filled
          no-error-icon
          :rules="[required]"
          class="q-my-sm"
          :error="hasError"
        ></q-input>
      </div>
      <div class="row justify-center">
        <q-input
          ref="addressInput"
          v-model="customer.address"
          label="Adress"
          filled
          no-error-icon
          :rules="[required]"
          class="q-my-sm"
          :error="hasError"
        ></q-input>
        <q-input
          ref="cityInput"
          v-model="customer.city"
          label="Ort"
          filled
          no-error-icon
          :rules="[required]"
          class="q-my-sm"
          :error="hasError"
        ></q-input>
      </div>
      <div class="row justify-center">
        <q-input
          ref="mailInput"
          v-model="customer.email"
          label="E-postadress"
          filled
          no-error-icon
          :rules="[required, validEmail]"
          class="q-my-sm"
          lazy-rules
          :error="hasError"
        ></q-input>
        <q-input
          ref="mailConfirmInput"
          v-model="emailConfirm"
          label="Bekräfta e-postadress"
          filled
          no-error-icon
          :rules="[required, sameEmail]"
          class="q-my-sm"
          :error="hasError"
        ></q-input>
      </div>
      <div class="row justify-center">
        <q-input
          ref="phoneInput"
          v-model="customer.phone"
          label="Telefonnummer"
          filled
          no-error-icon
          :rules="[required]"
          class="q-my-sm"
          :error="hasError"
        ></q-input>
      </div>
    </q-form>
    <q-spinner color="accent" size="xl" v-if="loading"></q-spinner>
  </div>
</template>

<script setup lang="ts">
import { useFrontEndStore } from 'src/stores/frontendStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from '@vue/reactivity';
import { required, validEmail, sameEmail } from 'src/utils/utils';
import { useBackendStore } from 'src/stores/backendStore';
import { useQuasar } from 'quasar';

const emit = defineEmits(['incStep']);
const props = defineProps({ customerType: String });

const frontendStore = useFrontEndStore();
const backendStore = useBackendStore();

const { customer } = storeToRefs(frontendStore);
const emailConfirm = ref('');

const showRegField = computed(() => props.customerType === 'business');

const form = ref();
async function validate(): Promise<void> {
  await form.value.validate();
}

const $q = useQuasar();
const hasError = ref(false);
const loading = ref(false);
async function sendOrder() {
  try {
    loading.value = true;
    hasError.value = false;

    await backendStore.saveOrder();
    emit('incStep');

    loading.value = false;
  } catch (err: unknown) {
    const error = err as Error;
    loading.value = false;
    hasError.value = true;

    // The ugly try catch is only for testing. Can't mock out $q.notify
    try {
      $q.notify({
        type: 'warning',
        message: error.message,
        position: 'bottom',
        actions: [
          {
            color: 'black',
            icon: 'mdi-close',
          },
        ],
      });
    } catch (e) {}
  }
}

defineExpose({ validate });
</script>

<style scoped></style>
