<template>
  <div
    class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 20vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Inget här...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="black"
        unelevated
        to="/"
        label="Gå tillbaka"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorNotFound',
});
</script>
