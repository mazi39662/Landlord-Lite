<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Summary Cards -->
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card>
              <ion-card-header>
                <ion-card-subtitle>Total Tenants</ion-card-subtitle>
                <ion-card-title>24</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card>
              <ion-card-header>
                <ion-card-subtitle>Vacant Units</ion-card-subtitle>
                <ion-card-title>5</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Recent Activities -->
      <ion-list>
        <ion-item-divider color="medium">Recent Activities</ion-item-divider>
        <ion-item>
          <ion-label>
            <h2>Juan Dela Cruz paid rent</h2>
            <p>June 5, 2025</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h2>Unit 3B marked as vacant</h2>
            <p>June 4, 2025</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h2>Maria Santos moved in</h2>
            <p>June 1, 2025</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonItemDivider,
  IonLabel,
} from "@ionic/vue";
</script>

<style scoped>
ion-card {
  text-align: center;
}
</style>
