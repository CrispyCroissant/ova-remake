<template>
  <q-page style="background-color: #ebf0f4">
    <div class="flex flex-center window-height">
      <q-card :style="$q.screen.gt.sm ? 'width: 30rem' : 'width: 20rem'">
        <q-card-section class="flex justify-center q-pb-xl">
          <q-avatar
            :icon="icon"
            text-color="white"
            font-size="6rem"
            :color="color"
            size="8rem"
            class="absolute-center shadow-2"
            style="top: -0.5rem"
          ></q-avatar>
        </q-card-section>
        <q-card-section class="flex column flex-center q-py-lg">
          <p class="text-h5 text-weight-light q-mb-lg text-center">
            {{ title }}
          </p>
          <p class="text-body2 text-center">{{ desc }}</p>
          <p
            class="text-body2 text-center"
            v-if="type === StatusTypes.SUCCEEDED"
          >
            Ett kvitto kommer skickas till din e-postadress inom kort.
          </p>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg">
          <q-btn :color="color" style="width: 10rem" @click="goHome">Ok</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import { computed, ref } from '@vue/reactivity';
import { nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';

enum StatusTypes {
  SUCCEEDED = 'succeeded',
  PROCESSING = 'processing',
  REQUIRES_METHOD = 'requires_payment_method',
  CANCELED = 'canceled',
  UNKNOWN = 'unknown',
}

const hasInitialized = ref(false);
const type = ref<StatusTypes>(StatusTypes.PROCESSING);

const icon = computed(() => {
  switch (type.value) {
    case StatusTypes.SUCCEEDED:
      return 'mdi-check';
    case StatusTypes.PROCESSING:
      return 'mdi-clock-outline';
    case StatusTypes.REQUIRES_METHOD:
      return 'mdi-close';
    case StatusTypes.CANCELED:
      return 'mdi-exclamation';
    case StatusTypes.UNKNOWN:
      return 'mdi-help';
  }
});
const color = computed(() => {
  switch (type.value) {
    case StatusTypes.SUCCEEDED:
      return 'positive';
    case StatusTypes.PROCESSING:
      return 'grey';
    case StatusTypes.CANCELED:
      return 'warning';
    case StatusTypes.REQUIRES_METHOD:
    case StatusTypes.UNKNOWN:
      return 'negative';
  }
});
const title = computed(() => {
  switch (type.value) {
    case StatusTypes.SUCCEEDED:
      return 'Tack!';
    case StatusTypes.PROCESSING:
      return 'Beställning bearbetas...';
    case StatusTypes.CANCELED:
      return 'Avbruten';
    case StatusTypes.REQUIRES_METHOD:
    case StatusTypes.UNKNOWN:
      return 'Beställningen misslyckades!';
  }
});
const desc = computed(() => {
  switch (type.value) {
    case StatusTypes.SUCCEEDED:
      return 'Din beställning har tagits emot';
    case StatusTypes.PROCESSING:
      return 'Vi skickar ett mail när beställningen har gått igenom.';
    case StatusTypes.CANCELED:
      return 'Din beställning har avbrutits.';
    case StatusTypes.REQUIRES_METHOD:
    case StatusTypes.UNKNOWN:
      return 'Det uppstod ett okänt fel när din beställning bearbetades. Försök igen med en annan metod.';
  }
});

async function checkStatus(): Promise<void> {
  const stripe = await loadStripe(process.env.STRIPE_API_KEY as string);

  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret'
  );

  if (!clientSecret) {
    return;
  }

  if (stripe) {
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    if (paymentIntent) {
      switch (paymentIntent.status) {
        case StatusTypes.SUCCEEDED:
          type.value = StatusTypes.SUCCEEDED;
          break;
        case StatusTypes.PROCESSING:
          type.value = StatusTypes.PROCESSING;
          break;
        case StatusTypes.REQUIRES_METHOD:
          type.value = StatusTypes.REQUIRES_METHOD;
          break;
        case StatusTypes.CANCELED:
          type.value = StatusTypes.CANCELED;
        default:
          type.value = StatusTypes.UNKNOWN;
          break;
      }
    }
  }
  nextTick(() => {
    hasInitialized.value = true;
  });
}

const router = useRouter();

async function goHome(): Promise<void> {
  await router.push({ name: 'Home' });
}

onMounted(checkStatus);
</script>

<style scoped>
p {
  color: #636363;
}
</style>
