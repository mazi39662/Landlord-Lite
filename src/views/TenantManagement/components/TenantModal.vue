<template>
  <ion-modal :is-open="showAddModal" @did-dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ viewOnly ? "Tenant Details" : "Add Tenant" }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label label-placement="floating">Name:</ion-label>
        <ion-input v-model="newTenant.name" :readonly="viewOnly" />
      </ion-item>

      <ion-item>
        <ion-label label-placement="floating">Email:</ion-label>
        <ion-input
          type="email"
          v-model="newTenant.email"
          :readonly="viewOnly"
        />
      </ion-item>

      <ion-item>
        <ion-label label-placement="floating">Phone:</ion-label>
        <ion-input type="tel" v-model="newTenant.phone" :readonly="viewOnly" />
      </ion-item>

      <ion-item>
        <ion-label label-placement="floating">Address:</ion-label>
        <ion-input v-model="newTenant.address" :readonly="viewOnly" />
      </ion-item>

      <ion-item>
        <ion-label>ID Image:</ion-label>
        <input
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          :disabled="viewOnly"
          style="padding: 10px 0"
        />
      </ion-item>

      <ion-item>
        <ion-label label-placement="floating">Reference ID:</ion-label>
        <ion-input v-model="newTenant.ref_id" :readonly="true" />
      </ion-item>

      <ion-item>
        <ion-label label-placement="floating">Unit:</ion-label>
        <ion-input v-model="newTenant.unit" :readonly="viewOnly" />
      </ion-item>

      <ion-item>
        <ion-label>Property</ion-label>
        <ion-select
          v-model="newTenant.property"
          placeholder="Select Property"
          :disabled="viewOnly"
        >
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
        <ion-label label-placement="floating">Unit Price:</ion-label>
        <ion-input
          type="number"
          v-model="newTenant.unit_price"
          :readonly="viewOnly"
        />
      </ion-item>

      <ion-item>
        <ion-label label-placement="floating">Number of People:</ion-label>
        <ion-input
          type="number"
          v-model="newTenant.num_people"
          :readonly="viewOnly"
        />
      </ion-item>

      <ion-item>
        <ion-label label-placement="floating">Due Date:</ion-label>
        <ion-input
          type="date"
          v-model="newTenant.due_date"
          :readonly="viewOnly"
        />
      </ion-item>

      <ion-item>
        <ion-label>Status:</ion-label>
        <ion-select
          v-model="newTenant.status"
          :disabled="viewOnly"
          interface="popover"
        >
          <ion-select-option value="Occupied">Occupied</ion-select-option>
          <ion-select-option value="Move Out">Moved Out</ion-select-option>
          <ion-select-option value="Available">Available</ion-select-option>
          <ion-select-option value="not_available"
            >Not Available</ion-select-option
          >
        </ion-select>
      </ion-item>

      <ion-button
        v-if="!viewOnly"
        expand="block"
        class="ion-margin-top"
        @click="saveTenant"
      >
        Save Tenant
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
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";

const props = defineProps<{
  isOpen: boolean;
  tenant: any;
  propertyNames: string[];
  viewOnly?: boolean;
}>();

const emit = defineEmits(["close", "save"]);

const showAddModal = ref(props.isOpen);

// Default tenant structure to avoid undefined errors
const defaultTenant = {
  name: "",
  email: "",
  phone: "",
  address: "",
  id_image: null,
  ref_id: "",
  unit: "",
  property: "",
  unit_price: 0,
  num_people: 1,
  due_date: "",
  status: "Occupied",
};

const newTenant = ref({ ...defaultTenant, ...(props.tenant || {}) });

// Watch for changes in props
watch(
  () => props.tenant,
  (newVal) => {
    newTenant.value = { ...defaultTenant, ...(newVal || {}) };
  },
  { immediate: true, deep: true }
);

watch(
  () => props.isOpen,
  (val) => {
    showAddModal.value = val;
  }
);

function closeModal() {
  showAddModal.value = false;
  emit("close");
}

function saveTenant() {
  emit("save", newTenant.value);
  showAddModal.value = false;
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    newTenant.value.id_image = input.files[0];
  }
}
</script>
