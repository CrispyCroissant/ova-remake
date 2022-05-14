<template>
  <div class="flex justify-center">
    <q-card style="max-width: 40rem; min-width: 15rem">
      <q-card-section class="q-pb-sm bg-primary">
        <p class="q-ma-none text-h6 text-white text-center">Pris</p>
      </q-card-section>

      <q-card-section class="q-pb-sm">
        <div class="flex column flex-center q-mt-sm">
          <p id="locs" class="q-mb-sm text-body2 text-center">
            {{ location(order.from) }} - {{ location(order.to) }}
          </p>
          <p
            id="total-dist"
            class="text-caption text-weight-light text-center q-mb-none"
          >
            {{ Math.round(order.distance / 1000) }} km
          </p>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="flex column flex-center">
          <p id="price" class="text-h5 text-primary q-mb-none">
            {{ store.priceTotalFormatted }}
          </p>
          <p id="price" class="text-caption text-weight-light text-grey">
            * inkl. moms
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

function location(location: string): string {
  const maxLength = 15;
  const formatted = formatLocation(location);

  if (formatted.length > maxLength) {
    const withoutAddress = formatted.substring(formatted.indexOf(',') + 1);

    if (withoutAddress.length > maxLength) {
      return formatted.substring(formatted.lastIndexOf(',') + 1);
    }

    return withoutAddress;
  }

  return formatted;
}
</script>

<style scoped></style>
