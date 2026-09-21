import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuth } from "@/stores/auth.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { theme: "light" },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Registration.vue"),
      meta: { hideChrome: true, theme: "light" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
      meta: { hideChrome: true, theme: "light" },
    },
    {
      path: "/account",
      name: "account",
      component: () => import("../views/Account.vue"),
      meta: { theme: "light" },
    },
    {
      path: "/novel/",
      children: [
        {
          path: ":novel_slug",
          name: "read_novel",
          component: () => import("../views/novel/read_novel/ReadNovel.vue"),
          meta: { theme: "light" },
        },
        {
          path: ":slug/:chapter_id",
          name: "read_page",
          component: () => import("../views/novel/read_novel/ReadPage.vue"),
          meta: { hideChrome: true, theme: "light" },
        },
      ]
    },
    // BACKOFFICE AUTHOR
    {
      path: "/author/",
      children: [
        {
          path: ":novel_id/chapter/:chapter_id?",
          name: "chapter_edit",
          component: () => import("../views/novel/ChapterEdit.vue"),
          meta: { theme: "light" },
        },
        {
          path: "novel/:id?",
          name: "author_novel",
          component: () => import("@/views/backoffice/author/Novel.vue"),
          meta: { theme: "light" },
        },
      ],
    },
    {
      path: "/shop/",
      children: [
        {
          path: "coins",
          name: "shop_coins",
          component: () => import("../views/boutique/Shop.vue"),
          meta: { theme: "light" },
        },
        {
          path: "success",
          name: "shop_success",
          component: () => import("../views/boutique/Success.vue"),
          meta: { theme: "light" },
        },
        {
          path: "cancel",
          name: "shop_cancel",
          component: () => import("../views/boutique/Cancel.vue"),
          meta: { theme: "light" },
        }
      ]
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const noLogedPath = ["/register", "/login"];
  const authStore = useAuth();
  if (authStore.getToken && !authStore.getUser) {
    await authStore.me();
  }
  
  if (noLogedPath.includes(to.path)) {
    if (authStore.getToken) {
      next("/");
    }
  }

  if (authStore.getToken) {
    await authStore.updateCoins();
  }
  next();
});

export default router;
