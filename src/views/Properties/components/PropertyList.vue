<template>
  <ion-list>
    <div
      v-for="property in properties"
      :key="property.id"
      class="property-section"
    >
      <!-- Property Header -->
      <ion-item lines="inset">
        <ion-label class="ion-text-wrap" style="flex: 1">
          <h2>{{ property.name }}</h2>
          <p>{{ property.location }}</p>
        </ion-label>

        <ion-button
          fill="clear"
          :id="'popover-trigger-' + property.id"
          @click="toggleMenu(property.id)"
        >
          <ion-icon :icon="ellipsisVertical" />
        </ion-button>

        <ion-popover
          :is-open="activePopoverId === property.id"
          :trigger="'popover-trigger-' + property.id"
          @didDismiss="closeMenu"
          :translucent="true"
        >
          <ion-content>
            <ion-list>
              <ion-item button @click="emitEditProperty(property)"
                >Edit</ion-item
              >
              <ion-item button @click="emitDeleteProperty(property.id)"
                >Delete</ion-item
              >
            </ion-list>
          </ion-content>
        </ion-popover>
      </ion-item>

      <!-- Units Below Property -->
      <div class="units-container">
        <ion-card
          v-for="unit in property.units"
          :key="unit.id"
          class="unit-card"
        >
          <ion-card-content class="unit-card">
            <div class="unit-row">
              <div class="unit-info">
                Unit: {{ unit.unit ? unit.unit : "No Unit" }}
                {{
                  unit.unit_price
                    ? " - " + Number(unit.unit_price).toLocaleString()
                    : " - " + "No Price Yet!"
                }}

                <p>
                  {{ unit.name || "No Tenant" }}
                </p>
              </div>
              <ion-chip :color="badgeColor(unit.status)">
                {{ unit.status }}
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </div>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
  IonCard,
  IonCardContent,
} from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import { ref } from "vue";

const props = defineProps<{
  properties: any[];
  badgeColor: (status: string) => string;
}>();

const emit = defineEmits(["edit", "delete"]);

const activePopoverId = ref<number | null>(null);

function toggleMenu(propertyId: number) {
  activePopoverId.value =
    activePopoverId.value === propertyId ? null : propertyId;
}

function closeMenu() {
  activePopoverId.value = null;
}

function emitEditProperty(property: any) {
  emit("edit", property);
  closeMenu();
}

function emitDeleteProperty(propertyId: number) {
  emit("delete", propertyId);
  closeMenu();
}
</script>

<style scoped>
.property-section {
  margin-bottom: 1rem;
}

.units-container {
  padding: 0 16px;
}

.unit-card {
  padding: 0;
  margin: 0;
  border-bottom: 1px solid gray;
}

.unit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.unit-info {
  font-weight: 500;
}
</style>
