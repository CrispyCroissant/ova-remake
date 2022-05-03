<template>
  <section class="flex column big-y-pad bg-white items-center">
    <h4 class="q-mt-none text-subtitle-1">Våra tjänster</h4>
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-icon name="mdi-tow-truck" size="md" color="primary"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>Vägassistans</q-item-label>
          <q-item-label caption>
            Fordon upp till och med fyra ton
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-icon name="mdi-tanker-truck" size="md" color="primary"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>Transport</q-item-label>
          <q-item-label caption>Allt som ryms på ett flak</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-icon name="mdi-tire" size="md" color="primary"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>Däckförsäljning</q-item-label>
          <q-item-label caption>
            Däckhotell, däckskiftning, omläggning...
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.q-item {
  margin: 0.5rem 0;
}
</style>
