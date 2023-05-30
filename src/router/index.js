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
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Registration.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/account",
      name: "account",
      component: () => import("../views/Account.vue"),
    },
    {
      path: "/novel/",
      children: [
        {
          path: ":novel_slug",
          name: "read_novel",
          component: () => import("../views/novel/read_novel/ReadNovel.vue"),
        },
        {
          path: ":slug/:chapter_id",
          name: "read_page",
          component: () => import("../views/novel/read_novel/ReadPage.vue"),
          query: {
            page: '1'
          }
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
        },
        {
          path: ":novel_id/:chapter_id/page/:page_id?",
          name: "page_edit",
          component: () => import("../views/novel/PageEdit.vue"),
        },
        {
          path: "novel/:id?",
          name: "author_novel",
          component: () => import("@/views/backoffice/author/Novel.vue"),
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
    await authStore.getAvatar();
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
