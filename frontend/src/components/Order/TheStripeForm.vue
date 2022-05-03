<template>
  <form id="payment-form" @submit.prevent="handleSubmit">
    <div class="flex column flex-center q-pa-md">
      <h3 class="text-h5" v-if="!pageLoad">Betala</h3>
      <q-spinner v-if="pageLoad" size="xl" color="accent"></q-spinner>
      <div id="payment-element"></div>
      <q-btn
        class="q-mt-lg"
        color="primary"
        id="submit"
        type="submit"
        rounded
        :loading="loading"
        v-if="!pageLoad"
      >
        Betala
      </q-btn>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  loadStripe,
  Appearance,
  StripeElements,
  Stripe,
} from '@stripe/stripe-js';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useBackendStore } from 'src/stores/backendStore';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['mountError', 'mountSuccess']);

let stripe: Stripe | null;
const store = useBackendStore();
const $q = useQuasar();

const pageLoad = ref(true);
const loading = ref(false);
let elements: StripeElements;

async function handleSubmit() {
  loading.value = true;

  const { error } = await (stripe as Stripe).confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.href}/klar`,
    },
  });

  if (error.type === 'card_error' || error.type === 'validation_error') {
    $q.notify({
      type: 'negative',
      message: error.message,
      actions: [
        {
          color: 'white',
          icon: 'mdi-close',
        },
      ],
    });
  } else {
    $q.notify({
      type: 'negative',
      message: 'Ett oväntat fel uppstod.',
      actions: [
        {
          color: 'white',
          icon: 'mdi-close',
        },
      ],
    });
  }

  loading.value = false;
}

onMounted(async () => {
  stripe = await loadStripe(process.env.STRIPE_API_KEY as string);

  try {
    const apiCall = await axios.post(
      `${process.env.BACKEND_URL}/api/start-payment`,
      {
        orderId: store.orderId,
      }
    );

    const clientSecret = apiCall.data.clientSecret;

    const appearance: Appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#c62828',
      },
    };
    elements = stripe?.elements({ appearance, clientSecret }) as StripeElements;

    const paymentElement = elements?.create('payment');
    paymentElement.mount('#payment-element');
    paymentElement.on('ready', () => {
      pageLoad.value = false;
    });

    emit('mountSuccess');
  } catch (error) {
    try {
      $q.notify({
        type: 'negative',
        message: 'Kunde inte ladda betalningsankäten. Försök igen senare.',
        position: 'bottom',
        actions: [
          {
            color: 'white',
            icon: 'mdi-close',
          },
        ],
      });

      emit('mountError');
    } catch (e) {}
  }
});
</script>

<style scoped></style>
