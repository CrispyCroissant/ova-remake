<template>
  <q-layout view="hHh lpR fff">
    <TheHeader />

    <q-page-container>
      <router-view />
    </q-page-container>

    <TheFooter />
  </q-layout>
</template>

<script lang="ts" setup>
import TheHeader from '../components/nav/TheHeader.vue';
import TheFooter from '../components/nav/TheFooter.vue';
</script>
