<template>
  <section class="big-y-pad flex column justify-center">
    <div class="row justify-center">
      <h3 class="text-h5">Beräkna transportkostnad</h3>
    </div>
    <div class="row justify-center">
      <q-form
        autofocus
        @submit="
          validate();
          hasFare = false;
        "
      >
        <LocationInputFields
          ref="locations"
          withMargin
          @fareFetched="hasFare = true"
        />

        <Transition
          appear
          enter-active-class="animated backInLeft slow"
          leave-active-class="animated backOutRight slow"
        >
          <CardPrice ref="priceCard" v-if="hasFare" />
        </Transition>
        <div class="q-mt-lg flex justify-center">
          <div class="q-mr-sm">
            <q-btn ref="submitBtn" color="primary" rounded type="submit">
              Räkna
            </q-btn>
          </div>
          <div class="q-ml-sm" v-if="hasFare">
            <q-btn
              ref="orderBtn"
              color="positive"
              rounded
              @click="$router.push({ path: 'bestall' })"
            >
              Beställ
            </q-btn>
          </div>
        </div>
      </q-form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LocationInputFields from '../ui/LocationInputFields.vue';
import CardPrice from '../ui/CardPrice.vue';

const locations = ref<typeof LocationInputFields>();

async function validate(): Promise<void> {
  await locations.value?.validate();
}

const hasFare = ref(false);
</script>

<style scoped>
.big-y-pad {
  padding: 5rem 0;
}
.q-form {
  min-width: 25vw;
  max-width: 50vw;
}
</style>
