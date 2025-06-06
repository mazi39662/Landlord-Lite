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
          <ion-label label-placement="floating">ID Image URL:</ion-label>
          <ion-input v-model="newTenant.id_image" :readonly="viewOnly" />
        </ion-item>

        <ion-item>
          <ion-label label-placement="floating">Reference ID:</ion-label>
          <ion-input v-model="newTenant.ref_id" :readonly="viewOnly" />
        </ion-item>

        <ion-item>
          <ion-label label-placement="floating">Unit Number:</ion-label>
          <ion-input
            type="number"
            v-model="newTenant.unit_id"
            :readonly="viewOnly"
          />
        </ion-item>

        <ion-item>
          <ion-label label-placement="floating">Unit:</ion-label>
          <ion-input v-model="newTenant.unit" :readonly="viewOnly" />
        </ion-item>

        <ion-item>
          <ion-label label-placement="floating">Property:</ion-label>
          <ion-input v-model="newTenant.property" :readonly="viewOnly" />
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
            <ion-select-option value="active">Active</ion-select-option>
            <ion-select-option value="pending">Pending</ion-select-option>
            <ion-select-option value="moved_out">Moved Out</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-button
          v-if="!viewOnly"
          expand="block"
          class="ion-margin-top"
          @click="addTenant"
        >
          Add Tenant
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
  unit?: string;
  num_people?: number;
  due_date?: string;
  status?: "active" | "moved_out" | "pending";
  property?: string;
}

const viewOnly = ref(false);
const showAddModal = ref(false);
const searchTerm = ref("");

// Load tenants from localStorage
function loadTenants(): Tenant[] {
  const stored = localStorage.getItem("tenants");
  return stored ? JSON.parse(stored) : [];
}

function saveTenants(data: Tenant[]) {
  localStorage.setItem("tenants", JSON.stringify(data));
}

// Initialize tenants with sample data fallback
const tenants = reactive<Tenant[]>(
  loadTenants().length
    ? loadTenants()
    : [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          unit: "101",
          property: "Building A",
          address: "123 Main St",
          ref_id: "REF001",
          unit_id: 101,
          num_people: 2,
          due_date: "2025-06-30",
          status: "active",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "098-765-4321",
          unit: "202",
          property: "Building B",
          address: "456 Side Ave",
          ref_id: "REF002",
          unit_id: 202,
          num_people: 1,
          due_date: "2025-07-05",
          status: "pending",
        },
      ]
);

// Tenant form state
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
  num_people: 1,
  due_date: "",
  status: "active",
  property: "",
});

// Computed for filtered tenants
const filteredTenants = computed(() => {
  if (!searchTerm.value.trim()) return tenants;
  return tenants.filter((t) =>
    [t.name, t.email, t.phone, t.unit, t.property]
      .filter(Boolean)
      .some((field) =>
        field!.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
  );
});

// Open modal to add new tenant
function addTenant() {
  reset();
  showAddModal.value = true;
}

// Save the tenant entry
function saveTenant() {
  const newId = tenants.length ? Math.max(...tenants.map((t) => t.id)) + 1 : 1;

  const newEntry: Tenant = {
    id: newId,
    ...newTenant,
  };

  tenants.push(newEntry);
  saveTenants(tenants);
  showAddModal.value = false;
  reset();
}

// View tenant details in read-only mode
function viewTenant(tenant: Tenant) {
  Object.assign(newTenant, tenant);
  showAddModal.value = true;
  viewOnly.value = true;
}

// Edit existing tenant
function editTenant(tenant: Tenant) {
  Object.assign(newTenant, tenant);
  showAddModal.value = true;
  viewOnly.value = false;
}

// Delete tenant
function deleteTenant(id: number) {
  const index = tenants.findIndex((t) => t.id === id);
  if (index !== -1 && confirm("Are you sure you want to delete this tenant?")) {
    tenants.splice(index, 1);
    saveTenants(tenants);
  }
}

// Reset tenant form
function reset() {
  console.log("reset");
  Object.assign(newTenant, {
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    id_image: "",
    ref_id: "",
    unit_id: undefined,
    unit: "",
    num_people: 1,
    due_date: "",
    status: "active",
    property: "",
  });
  viewOnly.value = false;
}
</script>
