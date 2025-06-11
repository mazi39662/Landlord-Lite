<template>
  <ion-modal :is-open="modalOpen" @did-dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Unit</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Property</ion-label>
        <ion-select v-model="unit.property" placeholder="Select Property">
          <ion-select-option
            v-for="(name, index) in propertyNames"
            :key="index"
            :value="name"
          >
            {{ name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input v-model="unit.name" label="Unit Name:" />
      </ion-item>

      <ion-item>
        <ion-input type="number" v-model="unit.price" label="Unit Price:" />
      </ion-item>

      <ion-item>
        <ion-select
          v-model="unit.status"
          placeholder="Select Status"
          label="Unit Status:"
        >
          <ion-select-option value="Available">Available</ion-select-option>
          <ion-select-option value="Occupied">Occupied</ion-select-option>
          <ion-select-option value="Not Available"
            >Not Available</ion-select-option
          >
        </ion-select>
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" @click="handleSave">
        Save Unit
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
} from "@ionic/vue";

const props = defineProps<{
  showUnitModal: boolean;
  newUnit: any;
  propertyNames: string[];
}>();

const emit = defineEmits(["update:showUnitModal", "save"]);

const modalOpen = ref(props.showUnitModal);
const unit = ref({ ...props.newUnit });

// Watch for prop changes
watch(
  () => props.showUnitModal,
  (val) => {
    modalOpen.value = val;
    if (val) {
      unit.value = { ...props.newUnit };
    }
  }
);

function handleSave() {
  emit("save", unit.value);
  closeModal();
}

function closeModal() {
  modalOpen.value = false;
  emit("update:showUnitModal", false);
}
</script>
