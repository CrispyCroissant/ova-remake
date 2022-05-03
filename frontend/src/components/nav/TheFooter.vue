<template>
  <q-footer elevated class="q-py-md bg-grey-2 text-black">
    <div class="flex row">
      <div class="col-6 col-sm-3 flex flex-center">
        <q-avatar
          class="q-mr-xs"
          size="lg"
          icon="mail"
          text-color="primary"
        ></q-avatar>
        <a class="q-ma-none text-caption" href="mailto: info@vagassistance.se">
          info@vagassistance.se
        </a>
      </div>
      <div class="col-6 col-sm-3 flex flex-center">
        <q-avatar
          class="q-mr-xs"
          size="lg"
          icon="phone"
          text-color="primary"
        ></q-avatar>
        <a class="q-ma-none text-caption" href="tel: 0706120348">
          070-612 03 48
        </a>
      </div>
      <div class="col-12 col-sm-3 flex flex-center">
        <q-avatar
          class="q-mr-xs"
          size="lg"
          icon="place"
          text-color="primary"
        ></q-avatar>
        <a
          class="q-ma-none text-caption"
          href="https://goo.gl/maps/3Y1dp7J7XYmPuAux8"
        >
          Spinettvägen 2, Bjästa
        </a>
      </div>
      <div class="col-12 col-sm-3 flex flex-center">
        <q-avatar
          class="q-mr-xs"
          size="lg"
          icon="copyright"
          text-color="primary"
        ></q-avatar>
        <p class="q-ma-none text-caption">
          {{ currentYear }} - Öviks VägAssistance AB
        </p>
      </div>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';

const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>

<style scoped>
:link,
:visited {
  text-decoration: none;
  color: inherit;
}
</style>
