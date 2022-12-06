import RoutesBill from "@/views/digitalizing/bill/services/routes";

export default [
    {
      path: "",
      name: "Digital",
      component: () => import("../Digital.vue"),
      children: [
        ...RoutesBill
      ]
    },
  ];
  