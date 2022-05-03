<template>
  <section class="flex column big-y-pad bg-primary items-center text-white">
    <h4 class="q-mt-none text-subtitle-1">Om oss</h4>
    <p :class="paragraphStyle">
      <strong>Öviks VägAssistance</strong> grundades 2019 och är redan ett av
      Örnsköldsviks mest aktiva bärgningsföretag. Vi hjälper många bilister
      varje dag och ser till att de kan komma vidare när de fått problem.
      Motorproblem? Låste in nycklarna? Slut på bränsle? Inga problem för oss,
      vi ordnar det.
    </p>
    <p :class="paragraphStyle">
      Vi finns tillgänliga dygnet runt, året runt. Kunden är alltid i fokus och
      vi försöker alltid hitta lösningar för att hjälpa kunden, oberoende av
      tiden på dygnet.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const paragraphStyle = computed(() => {
  return $q.screen.lt.sm
    ? 'text-body1 big-half-width'
    : 'text-body1 half-width';
});
</script>

<style scoped>
.half-width {
  max-width: 50vw;
}
.big-half-width {
  max-width: 75vw;
}
</style>
