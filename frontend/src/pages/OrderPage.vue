<template>
  <q-page>
    <div class="q-pa-lg flex justify-center bg-primary text-white full-width">
      <h2 class="text-h3">Beställ transport</h2>
    </div>
    <div class="row justify-center full-height">
      <TheStepper />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TheStepper from '../components/Order/TheStepper.vue';
</script>

<style scoped></style>
