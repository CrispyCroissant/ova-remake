<template>
  <q-header class="q-py-md q-px-sm bg-white text-black">
    <q-toolbar>
      <div class="row full-width">
        <div :class="titleStyle">
          <router-link to="/">
            <img src="src/assets/logo.svg" height="35" />
          </router-link>
        </div>
        <div :class="tabStyle">
          <q-tabs active-color="primary" v-model="tab">
            <q-route-tab to="/" name="home" label="Hem" />
            <q-route-tab to="/bestall" name="order" label="Beställ" />
            <q-route-tab to="/om" name="about" label="Om oss" />
          </q-tabs>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const $q = useQuasar();
const tab = ref('home');

const titleStyle = computed(() => {
  return $q.screen.lt.sm ? 'col-12 flex justify-center' : 'col-6';
});
const tabStyle = computed(() => {
  return $q.screen.lt.sm
    ? 'q-mt-md col-12 flex justify-center'
    : 'col-6 flex justify-end';
});
</script>
