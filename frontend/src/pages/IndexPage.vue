<template>
  <q-page>
    <HeroSection />
    <CTASection />
    <MottoSection />
    <ServicesSection />
  </q-page>
</template>

<script setup lang="ts">
import HeroSection from '../components/Home/HeroSection.vue';
import CTASection from '../components/Home/CTASection.vue';
import ServicesSection from '../components/Home/ServicesSection.vue';
import MottoSection from 'src/components/Home/MottoSection.vue';
</script>

<style scoped>
.big-y-pad {
  padding: 5rem 0;
}
</style>
