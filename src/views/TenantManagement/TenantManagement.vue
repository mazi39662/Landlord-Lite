<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tenant Management</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="addTenant()">
            <ion-icon slot="icon-only" :icon="add" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <search-bar v-model="searchTerm" />
    </ion-header>

    <ion-content>
      <ion-list>
        <tenant-card
          v-for="tenant in filteredTenants"
          :key="tenant.id"
          :tenant="tenant"
          @view="viewTenant"
          @edit="editTenant"
          @delete="deleteTenant"
        />
      </ion-list>
    </ion-content>

    <!-- View, Create & Edit Modal -->
    <ion-modal :is-open="showAddModal" @did-dismiss="showAddModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{
            viewOnly ? "Tenant Details" : "Add Tenant"
          }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showAddModal = false">Close</ion-button>
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
          <ion-input
            type="tel"
            v-model="newTenant.phone"
            :readonly="viewOnly"
          />
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
            <ion-select-option value="active">Occupied</ion-select-option>
            <ion-select-option value="moved_out">Moved Out</ion-select-option>
            <ion-select-option value="pending">Available</ion-select-option>
            <ion-select-option value="not_available">
              Not Available
            </ion-select-option>
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
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  IonModal,
  IonButtons,
  IonSelectOption,
  IonSelect,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { reactive, ref, computed } from "vue";
import TenantCard from "@/views/TenantManagement/components/TenantCard.vue";
import SearchBar from "@/components/SearchBar.vue";

interface Tenant {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  id_image?: string;
  ref_id?: string;
  unit_id?: number;
  unit: string;
  num_people?: number;
  due_date?: string;
  status?: "Occupied" | "Move Out" | "Available" | "Not Available";
  property: string;
  unit_price?: number;
}

const viewOnly = ref(false);
const showAddModal = ref(false);
const searchTerm = ref("");
const propertyNames = ref<string[]>([]);
const tenants = ref<Tenant[]>([]);

// Load tenants from localStorage
function loadTenants(): Tenant[] {
  const stored = localStorage.getItem("tenants");
  const storedProperties = localStorage.getItem("propertyData");

  if (storedProperties) {
    try {
      const properties = JSON.parse(storedProperties);
      propertyNames.value = properties.map((p: any) => p.name);
    } catch (e) {
      console.error("Error parsing propertyData:", e);
    }
  }

  return stored ? JSON.parse(stored) : [];
}

// Save tenants to localStorage
function saveTenants(data: Tenant[]) {
  localStorage.setItem("tenants", JSON.stringify(data));
}

// Initialize tenant data
function initTenants() {
  try {
    const loaded = loadTenants();
    tenants.value = loaded.length ? loaded : [];
  } catch (error) {
    console.error("Error initializing tenants:", error);
    alert("Error initializing tenants.");
  }
}

initTenants();

const newTenant = reactive<Tenant>({
  id: 0,
  name: "",
  email: "",
  phone: "",
  address: "",
  id_image: "",
  ref_id: "",
  unit_id: undefined,
  unit: "",
  unit_price: 0,
  num_people: 1,
  due_date: "",
  status: "active",
  property: "",
});

const filteredTenants = computed(() => {
  if (!searchTerm.value.trim()) return tenants.value;
  return tenants.value.filter((t) =>
    [t.name, t.email, t.phone, t.unit, t.property]
      .filter(Boolean)
      .some((field) =>
        field!.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
  );
});

function addTenant() {
  try {
    reset();
    newTenant.ref_id = generateUniqueRefId();
    showAddModal.value = true;
    viewOnly.value = false;
  } catch (error) {
    console.error("Error adding tenant:", error);
    alert("Error adding tenant.");
  }
}

function saveTenant() {
  if (viewOnly.value) return;

  try {
    const index = tenants.value.findIndex((t) => t.id === newTenant.id);

    if (index === -1) {
      const newId =
        tenants.value.length > 0
          ? Math.max(...tenants.value.map((t) => t.id)) + 1
          : 1;

      tenants.value.push({
        ...JSON.parse(JSON.stringify(newTenant)),
        id: newId,
      });
      alert("Tenant added successfully.");
    } else {
      tenants.value[index] = { ...JSON.parse(JSON.stringify(newTenant)) };
      alert("Tenant updated successfully.");
    }

    saveTenants(tenants.value);
    showAddModal.value = false;
    reset();
  } catch (error) {
    console.error("Error saving tenant:", error);
    alert("Error saving tenant.");
  }
}

function viewTenant(tenant: Tenant) {
  try {
    Object.assign(newTenant, tenant);
    showAddModal.value = true;
    viewOnly.value = true;
  } catch (error) {
    console.error("Error viewing tenant:", error);
    alert("Error viewing tenant.");
  }
}

function editTenant(tenant: Tenant) {
  try {
    Object.assign(newTenant, tenant);
    showAddModal.value = true;
    viewOnly.value = false;
  } catch (error) {
    console.error("Error editing tenant:", error);
    alert("Error editing tenant.");
  }
}

function deleteTenant(id: number) {
  try {
    if (confirm("Are you sure you want to delete this tenant?")) {
      tenants.value = tenants.value.filter((tenant) => tenant.id !== id);
      saveTenants(tenants.value);
      alert("Tenant deleted successfully.");
    }
  } catch (error) {
    console.error("Error deleting tenant:", error);
    alert("Error deleting tenant.");
  }
}

function reset() {
  Object.assign(newTenant, {
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    id_image: "",
    ref_id: "",
    unit_id: undefined,
    unit: "", // reset as empty string
    unit_price: 0,
    num_people: 1,
    due_date: "",
    status: "active",
    property: "", // reset as empty string
  });
}

function generateUniqueRefId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];

  // Simple FileReader to get base64 or URL for demo
  const reader = new FileReader();
  reader.onload = (e) => {
    newTenant.id_image = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}
</script>
