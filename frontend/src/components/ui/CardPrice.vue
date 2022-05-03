<template>
  <div class="flex justify-center">
    <q-card style="max-width: 40rem; min-width: 15rem">
      <q-card-section class="q-pb-sm">
        <p class="q-ma-none text-h6 text-primary">Pris</p>
        <p id="total-dist" class="text-caption text-weight-light q-mb-none">
          {{ Math.round(order.distance / 1000) }} km
        </p>
      </q-card-section>

      <q-separator inset color="warning"></q-separator>

      <q-card-section
        class="q-pb-md"
        v-for="(trip, index) in order.trips"
        :key="trip.distance"
      >
        <div class="row justify-center">
          <q-breadcrumbs align="evenly" separator-color="primary">
            <template #separator>
              <q-icon name="mdi-arrow-right" size="1.2rem"></q-icon>
            </template>
            <q-breadcrumbs-el
              :label="from(trip.from, index)"
            ></q-breadcrumbs-el>
            <q-breadcrumbs-el :label="to(trip.to, index)"></q-breadcrumbs-el>
            <p class="trip-dist text-caption q-ml-md q-mb-none">
              {{ Math.round(trip.distance / 1000) }} km
            </p>
          </q-breadcrumbs>
        </div>
      </q-card-section>

      <q-separator inset color="warning"></q-separator>

      <q-card-section class="q-mt-sm">
        <div class="flex column flex-center">
          <p id="price" class="text-body1">
            <span class="text-primary">Totalt:</span>
            {{ store.priceTotalFormatted }}
          </p>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFrontEndStore } from 'src/stores/frontendStore';
import { formatLocation } from 'src/utils/utils';

const store = useFrontEndStore();
const { order } = storeToRefs(store);

const START_LOCATION = 'Vårt garage';

function from(location: string, index: number): string {
  return index === 0 ? START_LOCATION : formatLocation(location);
}
function to(location: string, index: number): string {
  return index === 2 ? START_LOCATION : formatLocation(location);
}
</script>

<style scoped></style>
