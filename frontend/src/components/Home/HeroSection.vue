<template>
  <section>
    <q-img src="src/assets/hero.png" fit="cover" height="92vh">
      <div class="flex column flex-center absolute-full">
        <TransitionGroup appear enter-active-class="animated backInLeft slower">
          <h1 key="title" :class="bigHeadingStyle">Välkommen</h1>
          <h2 key="subtitle" :class="smallHeadingStyle">
            till Ö-viks lokala bärgare
          </h2>
        </TransitionGroup>
      </div>
    </q-img>
  </section>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const bigHeadingStyle = computed(() => {
  return $q.screen.lt.sm ? 'q-ma-none text-h2' : 'q-ma-none text-h1';
});
const smallHeadingStyle = computed(() => {
  return $q.screen.lt.sm
    ? 'text-h4 text-weight-light text-center'
    : 'text-h3 text-weight-light text-center';
});
</script>

<style scoped></style>
