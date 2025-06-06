<template>
  <ion-modal :is-open="isOpen" @did-dismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Manage Properties</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          v-model="form.name"
          label="Property Name"
          label-placement="floating"
          placeholder="Enter Property Name..."
        />
      </ion-item>
      <ion-item>
        <ion-input
          v-model="form.location"
          label="Location"
          label-placement="floating"
          placeholder="Enter Location"
        />
      </ion-item>
      <ion-item>
        <ion-input
          v-model="form.description"
          label="Description"
          label-placement="floating"
          placeholder="Enter Descrption"
        />
      </ion-item>
      <ion-item>
        <ion-input
          type="number"
          v-model.number="form.num_of_rooms"
          label="# of Rooms"
          label-placement="floating"
          placeholder="Enter # of Rooms"
        />
      </ion-item>

      <ion-button expand="block" @click="saveProperty">
        {{ form.id ? "Update Property" : "Add Property" }}
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/vue";
import { reactive, watch } from "vue";

interface Property {
  id: number | null;
  name: string;
  location: string;
  description?: string;
  num_of_rooms: number;
  created_at?: string;
  units?: any[];
}

const props = defineProps<{
  isOpen: boolean;
  properties: Property[];
  propertyToEdit: Property | null;
}>();

const emit = defineEmits(["close", "add", "update", "delete"]);

const form = reactive<Property>({
  id: null,
  name: "",
  location: "",
  description: "",
  num_of_rooms: 1,
  created_at: undefined,
  units: [],
});

watch(
  () => props.propertyToEdit,
  (newVal) => {
    if (newVal) {
      Object.assign(form, newVal);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function close() {
  resetForm();
  emit("close");
}

function resetForm() {
  form.id = null;
  form.name = "";
  form.location = "";
  form.description = "";
  form.num_of_rooms = 1;
  form.created_at = undefined;
  form.units = [];
}

function editProperty(property: Property) {
  Object.assign(form, property);
}

function deleteProperty(id: number) {
  if (confirm("Are you sure you want to delete this property?")) {
    emit("delete", id);
  }
}

function saveProperty() {
  if (!form.name || !form.location || !form.num_of_rooms) {
    alert("Please fill in all required fields");
    return;
  }

  if (form.id) {
    emit("update", { ...form });
  } else {
    emit("add", {
      ...form,
      id: Date.now(),
      created_at: new Date().toISOString(),
      units: [],
    });
  }
  resetForm();
}
</script>
