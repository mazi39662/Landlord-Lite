<template>
  <ion-modal :is-open="showEditModal" @didDismiss="handleClose">
    <ion-header>
      <ion-toolbar>
        <ion-title>Unit</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Basic Unit Fields -->
      <ion-item>
        <ion-input v-model="unit.name" label="Unit:" />
      </ion-item>
      <ion-item>
        <ion-input v-model="unit.property" label="Property:" />
      </ion-item>
      <ion-item>
        <ion-input type="number" v-model="unit.price" label="Price:" />
      </ion-item>
      <ion-item>
        <ion-label>Unit Status</ion-label>
        <ion-select v-model="unit.status" placeholder="Select Status">
          <ion-select-option value="Available">Available</ion-select-option>
          <ion-select-option value="Occupied">Occupied</ion-select-option>
          <ion-select-option value="Not Available"
            >Not Available</ion-select-option
          >
        </ion-select>
      </ion-item>

      <h3>Add Tenant</h3>

      <!-- Tenant Details -->
      <ion-card>
        <ion-item>
          <ion-input v-model="tenant.name" :readonly="viewOnly" label="Name:" />
        </ion-item>

        <ion-item>
          <ion-input
            type="email"
            v-model="tenant.email"
            :readonly="viewOnly"
            label="Email:"
          />
        </ion-item>

        <ion-item>
          <ion-input
            type="tel"
            v-model="tenant.phone"
            :readonly="viewOnly"
            label="Phone:"
          />
        </ion-item>

        <ion-item>
          <ion-input
            v-model="tenant.address"
            :readonly="viewOnly"
            label="Address:"
          />
        </ion-item>

        <ion-item>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            :disabled="viewOnly"
            style="padding: 10px 0"
            labeel="ID Image:"
          />
        </ion-item>

        <ion-item>
          Reference ID:
          <strong>
            {{ tenant.ref_id ? tenant.ref_id : "No Reference ID" }}</strong
          >
        </ion-item>

        <ion-item>
          <ion-input v-model="unit.name" :readonly="viewOnly" label="Unit:" />
        </ion-item>

        <ion-item>
          <ion-input
            v-model="unit.property"
            :readonly="viewOnly"
            label="Property:"
          />
        </ion-item>

        <ion-item>
          <ion-input
            type="number"
            v-model="unit.price"
            :readonly="viewOnly"
            label="Unit Price:"
          />
        </ion-item>

        <ion-item>
          <ion-input
            type="number"
            v-model="tenant.num_people"
            :readonly="viewOnly"
            label="Number of People:"
          />
        </ion-item>

        <ion-item>
          <ion-input
            type="date"
            v-model="tenant.due_date"
            :readonly="viewOnly"
            label="Due Date:"
          />
        </ion-item>

        <ion-item>
          <ion-select
            v-model="tenant.status"
            :disabled="viewOnly"
            interface="popover"
            label="Status:"
          >
            <ion-select-option value="Occupied">Occupied</ion-select-option>
            <ion-select-option value="Move Out">Moved Out</ion-select-option>
            <ion-select-option value="Available">Available</ion-select-option>
            <ion-select-option value="not_available"
              >Not Available</ion-select-option
            >
          </ion-select>
        </ion-item>
      </ion-card>

      <ion-button expand="full" @click="handleSave">Save</ion-button>
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonLabel,
} from "@ionic/vue";

const props = defineProps<{
  showEditModal: boolean;
  selectedUnit: any;
  newTenant: any;
  viewOnly?: boolean;
}>();

const emit = defineEmits(["close", "save"]);

const unit = ref({ ...props.selectedUnit });
const tenant = ref({ ...props.newTenant });

// Watch to sync when modal opens
watch(
  () => props.showEditModal,
  (val) => {
    if (val) {
      unit.value = { ...props.selectedUnit };
      tenant.value =
        props.newTenant && props.newTenant.name
          ? { ...props.newTenant }
          : {
              id: 0,
              name: "",
              email: "",
              phone: "",
              address: "",
              id_image: "",
              ref_id: generateUniqueRefId(),
              unit_id: undefined,
              unit: props.selectedUnit.name,
              unit_price: Number(props.selectedUnit.price),
              num_people: 1,
              due_date: "",
              status: "Occupied",
              property: props.selectedUnit.property,
            };
    }
  }
);

function generateUniqueRefId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function handleSave() {
  emit("save", { unit: unit.value, tenant: tenant.value });
  handleClose();
}

function handleClose() {
  emit("close");
}

function handleFileUpload(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      tenant.value.id_image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function viewrefID() {
  if (tenant.value.ref_id) {
    return tenant.value.ref_id;
  } else {
    return "No Reference ID";
  }
}
viewrefID();
</script>
