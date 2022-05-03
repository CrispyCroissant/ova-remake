<template>
  <section class="flex column flex-center full-width q-pa-xl">
    <h3 class="q-mb-lg text-h3 text-weight-light">Om oss</h3>
    <!-- <h4 class="q-mb-xl text-h5 text-weight-regular">
      Vi gör allt för att hjälpa dig komma vidare när du får problem
    </h4> -->
    <p :class="paragraphStyle">
      <strong>Öviks VägAssistance</strong> grundades 2019 och är redan ett av
      Örnsköldsviks mest aktiva bärgningsföretag. Vi hjälper många bilister
      varje dag och ser till att de kan komma vidare när de fått problem.
      Motorproblem? Låste in nycklarna? Slut på bränsle? Inga problem för oss,
      vi ordnar det.
    </p>
    <p :class="paragraphStyle">
      Utöver vår bärgningsverksamhet lägger vi även stort fokus på transport.
      Allt från bilar och motorcyklar till små stugor och bastutunnor. Om det
      ryms på ett flak så kan vi transportera det.
    </p>
    <p :class="paragraphStyle">
      Vi har även dygnet runt service vilket innebär att du kan kontakta oss när
      som helst på dygnet. Med vår expertis och erfarenhet kan du alltid känna
      dig trygg när du får hjälp av våra bärgare.
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
