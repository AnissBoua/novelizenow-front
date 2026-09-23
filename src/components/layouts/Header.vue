<template>
  <header class="sticky top-0 z-30 bg-white border-b border-[#E2E4EC] font-figtree text-[#101323]">
    <div class="max-w-[1340px] mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-4">
      <RouterLink to="/" class="flex items-center gap-2 flex-none">
        <img class="h-7 w-auto rounded-lg" src="@/assets/logos/novelizelogoimg.svg" alt="logo">
        <span class="font-sora font-semibold text-[17px] tracking-[-0.025em] text-[#101323]">NovelizeNow</span>
      </RouterLink>

      <form class="hidden md:flex flex-1 min-w-0" @submit.prevent>
        <label class="relative flex-1 flex items-center gap-2 bg-[#F3F4F8] border border-[#E2E4EC] rounded-lg px-3 h-[42px]">
          <iconify-icon icon="tabler:search" class="text-[18px] text-[#868DA3]"></iconify-icon>
          <input
            v-model="search"
            type="search"
            placeholder="Chercher un roman, un auteur, une catégorie"
            class="flex-1 min-w-0 bg-transparent border-0 outline-none text-[15px] !text-[#101323] placeholder:text-[#868DA3]"
            @input="debounceSeach"
            @focusin="toggleSearch"
            @focusout="toggleSearch"
          >
          <div v-if="isSearching && hasSearchResults" class="absolute left-0 top-full mt-2 z-50 flex flex-col gap-2 w-full bg-white border border-[#E2E4EC] rounded-lg p-2 shadow-lg">
            <RouterLink v-for="cat in categoryResults" :key="'cat-' + cat.id" :to="{name: 'category', params: {id: cat.id}}" class="flex items-center gap-3 p-1 rounded-md hover:bg-[#F3F4F8]">
              <span class="w-8 h-8 flex-none rounded-lg bg-[#E9EAF7] flex items-center justify-center">
                <iconify-icon :icon="cat.icon || 'tabler:category'" class="text-[17px] text-[#3138B0]"></iconify-icon>
              </span>
              <span class="text-sm font-medium capitalize">{{ cat.name }}</span>
              <span class="ml-auto text-xs text-[#6B7286]">Catégorie</span>
            </RouterLink>
            <RouterLink v-for="author in authorResults" :key="'author-' + author.id" :to="{name: 'author', params: {id: author.id}}" class="flex items-center gap-3 p-1 rounded-md hover:bg-[#F3F4F8]">
              <img v-if="author.avatar" class="w-8 h-8 flex-none rounded-full object-cover" :src="BACK_URL + author.avatar" alt="">
              <span v-else class="w-8 h-8 flex-none rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-xs font-semibold text-[#3138B0]">{{ authorInitials(author) }}</span>
              <span class="min-w-0">
                <span class="block text-sm font-medium capitalize truncate">{{ author.name }} {{ author.lastname }}</span>
                <span class="block text-xs text-[#6B7286]">{{ author.novelCount }} {{ author.novelCount > 1 ? 'romans' : 'roman' }}</span>
              </span>
              <span class="ml-auto text-xs text-[#6B7286]">Auteur</span>
            </RouterLink>
            <RouterLink v-for="(novel, index) in novels" :key="index" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="flex gap-3 p-1 rounded-md hover:bg-[#F3F4F8]">
              <img class="w-12 h-16 object-cover rounded-md flex-none" :src="novel.cover ? (BACK_URL + novel.cover.filepath) : ''" alt="">
              <div class="min-w-0">
                <div class="flex gap-2 mb-1">
                  <p v-for="(category, i) in novel.categories" :key="i" class="text-[#3138B0] text-xs capitalize">{{ category.name }}</p>
                </div>
                <p class="text-sm font-medium truncate">{{ novel.title }}</p>
                <p class="text-xs text-[#6B7286]">{{ novel.quantiteChapitre }} chapitres · {{ novel.author.name }} {{ novel.author.lastname }}</p>
              </div>
            </RouterLink>
          </div>
        </label>
      </form>

      <div class="md:hidden flex-1"></div>
      <button type="button" class="md:hidden flex-none" @click="toggleSearchMobile">
        <iconify-icon icon="tabler:search" class="text-[18px]"></iconify-icon>
      </button>

      <div v-if="token && user" class="hidden md:flex items-center gap-3 flex-none">
        <RouterLink :to="{name: 'shop_coins'}" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FBEEDA] text-[#7A5313] text-sm font-semibold hover:bg-[#F7E3C2]">
          <iconify-icon icon="tabler:coin" class="text-[18px] text-[#B4741A]"></iconify-icon>{{ coins ?? 0 }}
        </RouterLink>
        <RouterLink :to="{name: 'author_novel'}" class="px-4 py-2 rounded-lg bg-[#3138B0] text-white text-sm font-semibold hover:bg-[#232878]">
          <span class="flex items-center gap-2"><iconify-icon icon="tabler:pencil" class="text-[17px]"></iconify-icon>Écrire</span>
        </RouterLink>
        <div class="relative w-[34px] h-[34px]" @mouseover="toggleMenuUser" @mouseleave="closeMenuUser">
          <RouterLink :to="{name: 'account'}" class="block w-full h-full cursor-pointer">
            <img v-if="user.avatar" class="w-full h-full rounded-full object-cover" :src="BACK_URL + user.avatar.filepath" alt="avatar">
            <div v-else class="flex items-center justify-center w-full h-full rounded-full bg-[#E9EAF7] text-[#3138B0] font-sora text-xs font-semibold">
              {{ initials }}
            </div>
          </RouterLink>
          <div v-if="menuUser" class="absolute right-0 top-full mt-2 w-56 z-50 bg-white border border-[#E2E4EC] rounded-lg shadow-lg">
            <div class="py-3 px-4">
              <p class="font-semibold">{{ user.name }} {{ user.lastname }}</p>
              <p class="text-[#6B7286] text-sm truncate">{{ user.email }}</p>
            </div>
            <div class="h-px bg-[#EEEFF4]"></div>
            <RouterLink :to="{name: 'account'}" class="block py-2.5 px-4 text-sm hover:bg-[#F3F4F8]">Mon compte</RouterLink>
            <p class="cursor-pointer text-sm py-2.5 px-4 hover:bg-[#F3F4F8]" @click="logout">Se déconnecter</p>
          </div>
        </div>
      </div>
      <div v-else class="hidden md:flex items-center gap-4 flex-none">
        <RouterLink :to="{name: 'login'}" class="text-[15px] font-medium text-[#555D75] hover:text-[#3138B0]">Se connecter</RouterLink>
        <RouterLink :to="{name: 'register'}" class="px-4 py-2 rounded-lg bg-[#3138B0] text-white text-[15px] font-semibold hover:bg-[#232878]">Créer un compte</RouterLink>
      </div>

      <div v-if="token && user" class="relative md:hidden flex-none" @click="mobilemenu = !mobilemenu">
        <img v-if="user.avatar" class="w-8 h-8 rounded-full object-cover" :src="BACK_URL + user.avatar.filepath" alt="avatar">
        <div v-else class="flex items-center justify-center w-8 h-8 rounded-full bg-[#E9EAF7] text-[#3138B0] font-sora text-xs font-semibold">{{ initials }}</div>
      </div>
    </div>

    <div v-if="mobilemenu && token && user" class="md:hidden border-t border-[#EEEFF4] bg-white">
      <div class="px-4 py-3">
        <p class="font-semibold">{{ user.name }} {{ user.lastname }}</p>
        <p class="text-[#6B7286] text-sm truncate">{{ user.email }}</p>
      </div>
      <div class="h-px bg-[#EEEFF4]"></div>
      <div class="flex flex-col gap-1 py-2">
        <RouterLink :to="{name: 'account'}" class="px-4 py-2 text-sm">Mon compte</RouterLink>
        <RouterLink :to="{name: 'author_novel'}" class="px-4 py-2 text-sm font-semibold text-[#3138B0]">Écrire</RouterLink>
        <RouterLink :to="{name: 'shop_coins'}" class="flex items-center gap-2 px-4 py-2 text-sm">
          <iconify-icon icon="tabler:coin" class="text-[18px] text-[#B4741A]"></iconify-icon>{{ coins ?? 0 }} pièces
        </RouterLink>
        <p class="px-4 py-2 text-sm cursor-pointer" @click="logout">Se déconnecter</p>
      </div>
    </div>

    <div v-if="isSearchMobile" class="md:hidden absolute inset-0 z-50 flex items-center gap-3 w-full h-[58px] bg-white px-4 border-b border-[#E2E4EC]">
      <input
        v-model="search"
        type="text"
        placeholder="Chercher un roman, un auteur, une catégorie"
        class="flex-1 bg-[#F3F4F8] rounded-lg px-3 py-2 border border-[#E2E4EC] outline-none !text-[#101323]"
        @input="debounceSeach"
        @focusin="toggleSearch"
        @focusout="toggleSearch"
      >
      <iconify-icon icon="tabler:x" class="text-xl" @click="toggleSearchMobile"></iconify-icon>
      <div v-if="isSearching && hasSearchResults" class="absolute left-0 top-full w-full z-50 flex flex-col gap-2 bg-white border-t border-[#E2E4EC] p-2">
        <RouterLink v-for="cat in categoryResults" :key="'cat-' + cat.id" :to="{name: 'category', params: {id: cat.id}}" class="flex items-center gap-3 p-1">
          <span class="w-8 h-8 flex-none rounded-lg bg-[#E9EAF7] flex items-center justify-center">
            <iconify-icon :icon="cat.icon || 'tabler:category'" class="text-[17px] text-[#3138B0]"></iconify-icon>
          </span>
          <span class="text-sm font-medium capitalize">{{ cat.name }}</span>
          <span class="ml-auto text-xs text-[#6B7286]">Catégorie</span>
        </RouterLink>
        <RouterLink v-for="author in authorResults" :key="'author-' + author.id" :to="{name: 'author', params: {id: author.id}}" class="flex items-center gap-3 p-1">
          <img v-if="author.avatar" class="w-8 h-8 flex-none rounded-full object-cover" :src="BACK_URL + author.avatar" alt="">
          <span v-else class="w-8 h-8 flex-none rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-xs font-semibold text-[#3138B0]">{{ authorInitials(author) }}</span>
          <span class="min-w-0">
            <span class="block text-sm font-medium capitalize truncate">{{ author.name }} {{ author.lastname }}</span>
            <span class="block text-xs text-[#6B7286]">{{ author.novelCount }} {{ author.novelCount > 1 ? 'romans' : 'roman' }}</span>
          </span>
          <span class="ml-auto text-xs text-[#6B7286]">Auteur</span>
        </RouterLink>
        <RouterLink v-for="(novel, index) in novels" :key="index" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="flex gap-3 p-1">
          <img class="w-12 h-16 object-cover rounded-md flex-none" :src="novel.cover ? (BACK_URL + novel.cover.filepath) : ''" alt="">
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ novel.title }}</p>
            <p class="text-xs text-[#6B7286]">{{ novel.author.name }} {{ novel.author.lastname }}</p>
          </div>
        </RouterLink>
      </div>
    </div>

    <div class="border-t border-[#EEEFF4]">
      <div class="max-w-[1340px] mx-auto px-4 sm:px-6 flex items-center gap-5 overflow-x-auto">
        <RouterLink to="/" class="flex-none py-2.5 text-sm border-b-2" :class="route.name === 'home' ? 'font-semibold text-[#3138B0] border-[#3138B0]' : 'font-medium text-[#333B54] border-transparent hover:text-[#3138B0]'">Le fil</RouterLink>
        <RouterLink v-for="cat in homeStore.categories" :key="cat.id" :to="{name: 'category', params: {id: cat.id}}" class="flex-none py-2.5 text-sm border-b-2 capitalize" :class="isActiveCategory(cat.id) ? 'font-semibold text-[#3138B0] border-[#3138B0]' : 'font-medium text-[#333B54] border-transparent hover:text-[#3138B0]'">{{ cat.name }}</RouterLink>
        <span class="flex-1 min-w-[8px]"></span>
        <RouterLink :to="{name: 'categories'}" class="flex-none py-2.5 text-sm font-semibold text-[#3138B0] border-b-2" :class="route.name === 'categories' ? 'border-[#3138B0]' : 'border-transparent'">Les {{ homeStore.totalCategoriesCount }} catégories</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/stores/auth.js'
import { useHomeStore } from '@/stores/home.js'
import { computed, ref, watch } from 'vue'
import axios from 'axios';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const store = useAuth()
const { token, coins, user } = storeToRefs(store);
const { logout } = store;

const homeStore = useHomeStore();
const route = useRoute();

function isActiveCategory(id) {
  return route.name === 'category' && Number(route.params.id) === id;
}

const initials = computed(() => {
  if (!user.value) return '';
  return (user.value.name?.slice(0, 1) ?? '').toUpperCase() + (user.value.lastname?.slice(0, 1) ?? '').toUpperCase();
});

const novels = ref([]);
const categoryResults = ref([]);
const authorResults = ref([]);
const hasSearchResults = computed(() => novels.value.length > 0 || categoryResults.value.length > 0 || authorResults.value.length > 0);

function authorInitials(author) {
  return ((author.name?.[0] ?? '') + (author.lastname?.[0] ?? '')).toUpperCase();
}
const isSearching = ref(false);
const debounceTimer = ref(null);
const search = ref('');

function debounceSeach(){
    clearTimeout(debounceTimer.value);
    debounceTimer.value = setTimeout(() => {
        searchNovels();
    }, 500);
}

function toggleSearch(){
    setTimeout(() => {
        isSearching.value = !isSearching.value;
    }, 1000);
}

function searchNovels(){
    if (!search.value.trim()) {
        novels.value = [];
        categoryResults.value = [];
        authorResults.value = [];
        return;
    }
    axios.get('/novel/search', { params: { search: search.value } })
    .then(res => {
        novels.value = res.data.novels;
        categoryResults.value = res.data.categories;
        authorResults.value = res.data.authors;
    })
    .catch(err => {
        console.log(err);
    })
}

const menuUser = ref(false);
const isSearchMobile = ref(false);
const timer = ref(false);
const mobilemenu = ref(false);

function toggleMenuUser() {
    menuUser.value = true;
    clearTimeout(timer.value);
}

function closeMenuUser(){
    timer.value = setTimeout(() => {
        menuUser.value = false;
    }, 300);
}

function toggleSearchMobile(){
    isSearchMobile.value = !isSearchMobile.value;
}

watch(token, (newToken) => {
    token.value = newToken;
})
</script>
