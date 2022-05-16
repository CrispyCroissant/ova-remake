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
      <div class="row q-mb-lg">
        <q-input
          ref="regNumInput"
          v-model="customer.regNumber"
          label="Organisationsnummer"
          outlined
          hide-bottom-space
          :rules="[required]"
          no-error-icon
          v-if="showRegField"
          :error="hasError"
          class="full-width"
          dense
        ></q-input>
      </div>
      <div class="row justify-center q-my-md">
        <q-input
          ref="firstNameInput"
          v-model="customer.firstName"
          label="Förnamn"
          outlined
          hide-bottom-space
          no-error-icon
          :rules="[required]"
          class="full-width"
          :error="hasError"
          dense
        ></q-input>
      </div>
      <div class="row justify-center q-my-md">
        <q-input
          ref="lastNameInput"
          v-model="customer.lastName"
          label="Efternamn"
          outlined
          hide-bottom-space
          no-error-icon
          :rules="[required]"
          class="full-width"
          :error="hasError"
          dense
        ></q-input>
      </div>
      <div class="row justify-center q-mt-md q-mb-lg">
        <q-input
          ref="phoneInput"
          type="tel"
          v-model="customer.phone"
          label="Telefonnummer"
          outlined
          hide-bottom-space
          no-error-icon
          :rules="[required]"
          class="full-width"
          :error="hasError"
          dense
        ></q-input>
      </div>
      <div class="row justify-center q-my-md">
        <q-input
          ref="addressInput"
          v-model="customer.address"
          label="Adress"
          outlined
          hide-bottom-space
          no-error-icon
          :rules="[required]"
          :class="properWidth"
          :error="hasError"
          dense
        ></q-input>
        <q-input
          ref="cityInput"
          v-model="customer.city"
          label="Ort"
          outlined
          hide-bottom-space
          no-error-icon
          :rules="[required]"
          :class="properWidth"
          :error="hasError"
          dense
        ></q-input>
      </div>
      <div class="row justify-center q-my-md">
        <q-input
          ref="mailInput"
          type="email"
          v-model="customer.email"
          label="E-postadress"
          outlined
          hide-bottom-space
          no-error-icon
          :rules="[required, validEmail]"
          :class="properWidth"
          lazy-rules
          :error="hasError"
          dense
        ></q-input>
        <q-input
          ref="mailConfirmInput"
          type="email"
          v-model="emailConfirm"
          label="Bekräfta e-postadress"
          outlined
          hide-bottom-space
          no-error-icon
          :rules="[required, sameEmail]"
          :class="properWidth"
          :error="hasError"
          dense
        ></q-input>
      </div>
    </q-form>
    <q-spinner color="warning" size="xl" v-if="loading"></q-spinner>
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

const properWidth = computed(() => ($q.screen.lt.sm ? 'full-width' : ''));

defineExpose({ validate });
</script>

<style scoped></style>
