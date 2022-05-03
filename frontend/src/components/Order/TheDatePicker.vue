<template>
  <div class="flex column flex-center">
    <p class="text-h6">Välj datum</p>
    <q-date
      v-model="order.date"
      :minimal="$q.screen.lt.sm"
      no-unset
      :options="options"
    ></q-date>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar, date } from 'quasar';
import { useFrontEndStore } from 'src/stores/frontendStore';
const { formatDate } = date;

const $q = useQuasar();

const { order } = storeToRefs(useFrontEndStore());
const today: string = formatDate(new Date(), 'YYYY/MM/DD');
order.value.date = today;

function options(date: string): boolean {
  return date >= today;
}
</script>

<style scoped></style>
