<template>
  <ion-list>
    <ion-item v-for="property in properties" :key="property.id" lines="inset">
      <ion-label class="ion-text-wrap">
        <h2>{{ property.name }}</h2>
        <p>{{ property.location }}</p>

        <!-- List of units -->
        <ion-card
          v-for="unit in property.units"
          :key="unit.id"
          class="ion-margin-top"
        >
          <ion-card-content class="unit-card">
            <div class="unit-info">
              <ion-chip :color="badgeColor(unit.status)">
                {{ unit.name }} - {{ unit.status }}
              </ion-chip>
              <div class="unit-actions">
                <ion-button fill="clear" @click="toggleMenu(unit.id)">
                  <ion-icon :icon="ellipsisVertical" />
                </ion-button>
              </div>
            </div>
          </ion-card-content>

          <!-- Popover for each unit -->
          <ion-popover
            :is-open="activePopoverId === unit.id"
            @didDismiss="closeMenu"
            :translucent="true"
          >
            <ion-content>
              <ion-list>
                <ion-item button @click="emitEditUnit(property.id, unit)"
                  >Edit</ion-item
                >
                <ion-item button @click="emitDeleteUnit(property.id, unit.id)"
                  >Delete</ion-item
                >
              </ion-list>
            </ion-content>
          </ion-popover>
        </ion-card>
      </ion-label>
    </ion-item>
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

function toggleMenu(unitId: number) {
  activePopoverId.value = activePopoverId.value === unitId ? null : unitId;
}

function closeMenu() {
  activePopoverId.value = null;
}

function emitEditUnit(propertyId: number, unit: any) {
  emit("edit", { propertyId, unit });
  closeMenu();
}

function emitDeleteUnit(propertyId: number, unitId: number) {
  emit("delete", { propertyId, unitId });
  closeMenu();
}
</script>

<style scoped>
.unit-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.unit-actions {
  display: flex;
  align-items: center;
}
</style>
