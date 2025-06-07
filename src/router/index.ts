import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/home",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/tab1",
      },
      {
        path: "tab1",
        component: () => import("@/views/Tab1Page.vue"),
      },
      {
        path: "tab2",
        component: () => import("@/views/Tab2Page.vue"),
      },
      {
        path: "tab3",
        component: () => import("@/views/Tab3Page.vue"),
      },
      {
        path: "home",
        component: () => import("@/views/HomePage.vue"),
      },
      {
        path: "/tenantmanagement",
        component: () =>
          import("@/views/TenantManagement/TenantManagement.vue"),
      },
      {
        path: "/propertieslist",
        component: () => import("@/views/Properties/PropertiesList.vue"),
      },
      {
        path: "/tenantduecalendar",
        component: () => import("@/views/Calendar/TenantDueCalendar.vue"),
      },
      {
        path: "/settings",
        component: () => import("@/views/Settings/Settings.vue"),
      },
      {
        path: "/dashboard",
        component: () => import("@/views/Home/Dashboard.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
