import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import layoutDigital from "@/layout/layoutDigital.vue";
import RoutesHome from "@/views/digitalizing/services/routes.js"

const routes = [
  // {
  //   path: "/test",
  //   component: AppLayout,
  //   children: [...RoutesHome],
  // },
  {
    path: "/",
    component: layoutDigital,
    children: [...RoutesHome],
  },
  {
    path: "/landing",
    name: "landing",
    component: () => import("@/views/pages/Landing.vue"),
  },
  {
    path: "/pages/notfound",
    name: "notfound",
    component: () => import("@/views/pages/NotFound.vue"),
  },

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/pages/auth/Login.vue"),
  },
  {
    path: "/auth/access",
    name: "accessDenied",
    component: () => import("@/views/pages/auth/Access.vue"),
  },
  {
    path: "/auth/error",
    name: "error",
    component: () => import("@/views/pages/auth/Error.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
