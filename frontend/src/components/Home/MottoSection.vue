<template>
  <section
    class="flex column flex-center full-width bg-primary text-white big-y-pad"
  >
    <div class="flex flex-center q-mb-md q-pr-">
      <q-icon left name="mdi-engine" size="md"></q-icon>
      <p class="q-ma-none text-h5">Motorproblem?</p>
    </div>
    <div class="flex flex-center q-my-md q-pr-lg">
      <q-icon left name="mdi-key-chain-variant" size="md"></q-icon>
      <p class="q-ma-none text-h5">Låst in nycklarna?</p>
    </div>
    <div class="flex flex-center q-mt-md q-pr-lg">
      <q-icon left name="mdi-car-wrench" size="lg"></q-icon>
      <p class="q-ma-none text-h4">Vi fixar det!</p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.big-y-pad {
  padding: 7rem 0;
}
</style>
