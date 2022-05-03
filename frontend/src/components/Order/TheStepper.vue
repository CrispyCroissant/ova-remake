<template>
  <q-stepper
    v-model="step"
    done-color="positive"
    active-color="accent"
    animated
    :vertical="$q.screen.lt.sm"
  >
    <q-step
      :name="1"
      :done="step > 1"
      :header-nav="step > 1"
      title="Ange plats"
    >
      <div class="flex column items-center">
        <p class="text-subtitle1">Ange plats</p>
        <LocationInputFields ref="locationFields" @inc-step="step++" />
      </div>
      <q-stepper-navigation>
        <q-btn
          color="primary"
          label="Fortsätt"
          @click="validateLocations"
        ></q-btn>
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="2"
      :done="step > 2"
      :header-nav="step > 2"
      title="Se beräknat pris"
    >
      <CardPrice />
      <q-stepper-navigation>
        <q-btn color="grey" label="Backa" @click="step--"></q-btn>
        <q-btn
          class="q-ml-md"
          color="primary"
          label="Fortsätt"
          @click="step++"
        ></q-btn>
      </q-stepper-navigation>
    </q-step>

    <q-step :name="3" :done="step > 3" :header-nav="step > 3" title="Ange vikt">
      <div class="flex column flex-center q-mb-lg">
        <div class="flex column flex-center q-mb-md">
          <p class="text-h5 q-mb-sm">Bekräfta vikt</p>
          <p class="text-caption">* Transport får inte överstiga 4 ton</p>
        </div>
        <q-checkbox
          v-model="weightConfirmed"
          label="Transporten väger 4 ton eller mindre"
        ></q-checkbox>
      </div>
      <q-stepper-navigation>
        <q-btn color="grey" label="Backa" @click="step--"></q-btn>
        <q-btn
          v-if="weightConfirmed"
          class="q-ml-md"
          color="primary"
          label="Fortsätt"
          @click="step++"
        ></q-btn>
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="4"
      :done="step > 4"
      :header-nav="step > 4"
      title="Välj önskat datum för transport"
    >
      <TheDatePicker />
      <q-stepper-navigation>
        <q-btn color="grey" label="Backa" @click="step--"></q-btn>
        <q-btn
          class="q-ml-md"
          color="primary"
          label="Fortsätt"
          @click="step++"
        ></q-btn>
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="5"
      :done="step > 5"
      :header-nav="step > 5"
      title="Välj momssats"
    >
      <div class="flex column flex-center">
        <p class="text-subtitle1">Välj momssats</p>
        <q-option-group
          :options="options"
          type="radio"
          v-model="customerType"
        ></q-option-group>
      </div>
      <q-stepper-navigation>
        <q-btn color="grey" label="Backa" @click="step--"></q-btn>
        <q-btn
          class="q-ml-md"
          color="primary"
          label="Fortsätt"
          @click="step++"
        ></q-btn>
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="6"
      :done="step > 6"
      :header-nav="step > 6"
      title="Kundinformation"
    >
      <TheCustomerForm
        ref="customerForm"
        :customerType="customerType"
        @inc-step="step++"
      />
      <q-stepper-navigation>
        <q-btn color="grey" label="Backa" @click="step--"></q-btn>
        <q-btn
          class="q-ml-md"
          color="primary"
          label="Fortsätt"
          @click="validateCustomerForm"
        ></q-btn>
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="7"
      :done="step > 7"
      :header-nav="step > 7"
      title="Betala"
      :error="stripeError"
    >
      <div class="flex flex-center">
        <CardPrice :class="$q.screen.gt.sm ? 'q-mr-xl' : ''" />
        <TheStripeForm
          @mount-error="
            stripeError = true;
            step--;
          "
          @mount-success="stripeError = false"
          :class="$q.screen.gt.sm ? 'q-ml-xl' : ''"
        />
      </div>
      <q-stepper-navigation>
        <q-btn color="grey" label="Backa" @click="step--"></q-btn>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import CardPrice from '../ui/CardPrice.vue';
import TheDatePicker from './TheDatePicker.vue';
import LocationInputFields from '../ui/LocationInputFields.vue';
import TheCustomerForm from './TheCustomerForm.vue';
import TheStripeForm from './TheStripeForm.vue';

const $q = useQuasar();

const step = ref(1);

/* Tax rate options */
const customerType = ref('private');
const options = [
  { label: 'Privatperson', value: 'private' },
  { label: 'Företag', value: 'business' },
];

/* LocationInputFields related */
const locationFields = ref<typeof LocationInputFields>();
async function validateLocations(): Promise<void> {
  await locationFields.value?.validate();
}

/* Customer form */
const customerForm = ref<typeof TheCustomerForm>();
async function validateCustomerForm(): Promise<void> {
  await customerForm.value?.validate();
}

/* (Stripe) Payment form */
const stripeError = ref(false);

/* Weight checkbox */
const weightConfirmed = ref(false);
</script>

<style scoped></style>
