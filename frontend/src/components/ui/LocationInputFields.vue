<template>
  <q-form
    ref="form"
    autofocus
    @submit="validate"
    @validation-success="fetchResults"
  >
    <q-select
      ref="fromInput"
      :class="props.withMargin ? 'q-my-md' : 'q-my-sm'"
      v-model="order.from"
      use-input
      fill-input
      outlined
      label="Från"
      hint="Ange en adress"
      hide-hint
      hide-dropdown-icon
      hide-selected
      :rules="[required]"
      :error="error"
      :loading="loading"
      @input-value="inputHandler"
      :options="locations"
      @filter="filterLocations"
    >
      <template #prepend>
        <q-icon name="place"></q-icon>
      </template>
      <template #option="scope">
        <q-item class="flex align-center" v-bind="scope.itemProps">
          <q-icon name="mdi-map-marker-outline" size="sm"></q-icon>
          <p class="text-caption q-ml-sm q-mb-none">
            {{ scope.opt }}
          </p>
        </q-item>
      </template>
    </q-select>
    <q-select
      ref="toInput"
      :class="props.withMargin ? 'q-my-md' : 'q-my-sm'"
      v-model="order.to"
      use-input
      fill-input
      outlined
      label="Till"
      hint="Ange en adress"
      hide-hint
      hide-dropdown-icon
      hide-selected
      :rules="[required]"
      :error="error"
      :loading="loading"
      @input-value="inputHandler"
      :options="locations"
      @filter="filterLocations"
    >
      <template #prepend>
        <q-icon name="place"></q-icon>
      </template>
      <template #option="scope">
        <q-item class="flex align-center" v-bind="scope.itemProps">
          <q-icon name="mdi-map-marker-outline" size="sm"></q-icon>
          <p class="text-caption q-ml-sm q-mb-none">
            {{ scope.opt }}
          </p>
        </q-item>
      </template>
    </q-select>
  </q-form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useFrontEndStore } from 'src/stores/frontendStore';
import { required } from 'src/utils/utils';
import { ref } from 'vue';
import { useAutoComplete } from 'src/composables/useAutocomplete';

const props = defineProps({
  withMargin: Boolean,
});
const emit = defineEmits(['incStep', 'fareFetched']);

const store = useFrontEndStore();
const { order } = storeToRefs(store);

const form = ref();
async function validate(): Promise<void> {
  await form.value.validate();
}

const $q = useQuasar();
const error = ref(false);
const loading = ref(false);

async function fetchResults(): Promise<void> {
  try {
    error.value = false;
    loading.value = true;
    await store.fetchFare();
    emit('fareFetched');
    emit('incStep');
    loading.value = false;
  } catch (err) {
    const backendError = err as Error;

    error.value = true;
    loading.value = false;

    // The ugly try catch is only for testing. Can't mock out $q.notify
    try {
      $q.notify({
        type: 'warning',
        message: backendError.message,
        position: 'bottom',
        actions: [
          {
            color: 'black',
            icon: 'mdi-close',
          },
        ],
      });
    } catch (e) {}
  }
}

const locations = ref<string[]>([]);

function inputHandler(input: string): void {
  getPredictions(input);
}
async function getPredictions(val: string): Promise<void> {

  if (val.length <= 1) {
    return;
  }
  const response = await useAutoComplete(val);

  response?.predictions.forEach((prediction) => {
    locations.value.push(prediction.description);
  });
}
function filterLocations(
  val: string,
  update: (arg0: () => void) => void
): void {
  update(() => {
    const needle = val.toLocaleLowerCase();

    locations.value = locations.value.filter(
      (val) => val.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

defineExpose({ validate });
</script>

<style scoped></style>
