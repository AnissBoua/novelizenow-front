<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <section class="bg-white border-b border-[#E2E4EC]">
      <div class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-11 pb-9">
        <div class="flex items-center gap-2 font-plexmono text-xs tracking-wider uppercase text-[#6B7286]">
          <RouterLink to="/" class="text-[#6B7286] hover:text-[#3138B0]">Parcourir</RouterLink>
          <iconify-icon icon="tabler:chevron-right" class="text-[13px]"></iconify-icon>
          <span class="text-[#101323]">Catégories</span>
        </div>
        <h1 class="font-sora text-[clamp(32px,4vw,46px)] leading-[1.05] tracking-[-0.035em] font-semibold mt-3.5">Catégories</h1>
        <p class="font-newsreader text-[20px] leading-normal text-[#3A4260] mt-3 max-w-[52ch]">{{ categories.length }} catégories, des plus aimées aux plus précises. Ouvrez-en une pour voir tous ses romans.</p>
      </div>
    </section>

    <main v-if="loaded" class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-8 pb-[72px] flex flex-col gap-11">

      <div v-if="featured.length && !query.trim()">
        <h2 class="font-sora text-[22px] font-semibold tracking-[-0.02em] mb-4">Les plus aimées</h2>
        <div class="flex flex-col gap-4">
          <section v-for="cat in featured" :key="cat.id" class="bg-white border border-[#E2E4EC] rounded-2xl p-[26px] flex flex-wrap gap-8">
            <div class="flex-[1_1_260px] min-w-[240px] flex flex-col">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 flex-none rounded-[10px] bg-[#E9EAF7] flex items-center justify-center">
                  <iconify-icon :icon="cat.icon || 'tabler:category'" class="text-[21px] text-[#3138B0]"></iconify-icon>
                </span>
                <h3 class="font-sora text-2xl font-semibold tracking-[-0.025em] capitalize">{{ cat.name }}</h3>
              </div>
              <div class="font-plexmono text-xs text-[#6B7286] mt-3">{{ fmt(cat.novelCount) }} {{ cat.novelCount > 1 ? 'romans' : 'roman' }}</div>
              <p v-if="cat.description" class="font-newsreader text-[17px] leading-normal text-[#3A4260] mt-2.5">{{ cat.description }}</p>
              <span class="flex-1"></span>
              <RouterLink :to="{name: 'category', params: {id: cat.id}}" class="inline-flex items-center gap-1.5 mt-[18px] text-sm font-semibold text-[#3138B0] hover:text-[#232878]">
                Voir {{ cat.novelCount > 1 ? `les ${fmt(cat.novelCount)} romans` : 'le roman' }}<iconify-icon icon="tabler:arrow-right" class="text-base"></iconify-icon>
              </RouterLink>
            </div>
            <div class="flex-[3_1_560px] min-w-[280px] grid gap-[18px]" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));">
              <RouterLink v-for="novel in cat.novels" :key="novel.id" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="block text-[#101323] hover:text-[#3138B0]">
                <span class="block aspect-[2/3] rounded-[10px] overflow-hidden bg-[#EDEEF4] border border-[#E2E4EC]">
                  <img v-if="novel.cover" class="w-full h-full object-cover" :src="BACK_URL + novel.cover.filepath" :alt="novel.title">
                </span>
                <span class="block font-newsreader text-[17px] font-medium leading-tight mt-2.5">{{ novel.title }}</span>
                <span class="block text-[13px] text-[#555D75] mt-[3px]">{{ novel.author }} · {{ novel.chapterCount }} ch.</span>
                <span class="flex items-center gap-[5px] text-[13px] text-[#555D75] mt-1.5"><iconify-icon icon="tabler:heart" class="text-sm text-[#B4741A]"></iconify-icon>{{ fmt(novel.likesCount) }}</span>
              </RouterLink>
            </div>
          </section>
        </div>
      </div>

      <div id="toutes">
        <div class="flex flex-wrap items-center justify-between gap-3.5 mb-4">
          <h2 class="font-sora text-[22px] font-semibold tracking-[-0.02em]">Toutes les catégories</h2>
          <div class="flex flex-wrap gap-2.5 items-center">
            <label class="flex-[1_1_240px] min-w-[200px] flex items-center gap-2.5 bg-white border border-[#E2E4EC] rounded-[9px] px-[13px] h-[42px]">
              <iconify-icon icon="tabler:filter" class="text-[17px] text-[#868DA3] flex-none"></iconify-icon>
              <input v-model="query" type="search" placeholder="Filtrer les catégories" class="flex-1 min-w-0 border-0 outline-none bg-transparent text-[15px]">
            </label>
            <div class="flex gap-0.5 p-[3px] bg-[#E9EBF1] rounded-[9px] h-[42px]">
              <button v-for="o in sortOptions" :key="o.key" type="button" class="rounded-[7px] px-[13px] text-sm font-semibold" :class="sort === o.key ? 'bg-white text-[#101323] shadow-[0_1px_2px_rgba(16,19,35,0.12)]' : 'text-[#555D75]'" @click="sort = o.key">{{ o.label }}</button>
            </div>
          </div>
        </div>

        <div v-if="!filtered.length" class="px-6 py-12 text-center bg-white border border-[#E2E4EC] rounded-[14px]">
          <div class="font-sora text-[19px] font-semibold">Aucune catégorie pour « {{ query }} »</div>
          <p class="text-[15px] text-[#555D75] mt-2">Essayez un autre mot, ou cherchez directement un titre dans la barre du haut.</p>
          <button type="button" class="mt-[18px] px-4 py-2.5 rounded-[9px] border border-[#D6D9E4] bg-white text-sm font-semibold hover:border-[#3138B0] hover:text-[#3138B0]" @click="query = ''">Effacer le filtre</button>
        </div>

        <div v-else class="grid gap-2.5" style="grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));">
          <RouterLink v-for="cat in filtered" :key="cat.id" :to="{name: 'category', params: {id: cat.id}}" class="flex items-center gap-3 px-4 py-3.5 bg-white border border-[#E2E4EC] rounded-[11px] text-[#101323] hover:border-[#3138B0] hover:bg-[#F7F7FD] hover:text-[#3138B0]">
            <span class="text-[15px] font-semibold flex-auto min-w-0 capitalize">{{ cat.name }}</span>
            <span class="font-plexmono text-xs text-[#868DA3] flex-none">{{ fmt(cat.novelCount) }}</span>
            <iconify-icon icon="tabler:chevron-right" class="text-[15px] text-[#B3B8C8] flex-none"></iconify-icon>
          </RouterLink>
        </div>
      </div>
    </main>

    <div v-else class="flex items-center justify-center py-32">
      <iconify-icon icon="tabler:loader-2" class="text-[28px] text-[#3138B0] animate-spin"></iconify-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const categories = ref([]);
const featured = ref([]);
const loaded = ref(false);
const query = ref('');
const sort = ref('popular');

const sortOptions = [
  { key: 'popular', label: 'Populaires' },
  { key: 'az', label: 'A–Z' },
];

axios.get('/category/overview').then((res) => {
  categories.value = res.data.categories;
  featured.value = res.data.featured;
  loaded.value = true;
}).catch((err) => console.error(err));

function fmt(n) {
  return new Intl.NumberFormat('fr-FR').format(n ?? 0);
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  const byName = (a, b) => a.name.localeCompare(b.name, 'fr');
  return categories.value
    .filter((c) => !q || c.name.toLowerCase().includes(q))
    .sort((a, b) => (sort.value === 'popular' ? (b.novelCount - a.novelCount) || byName(a, b) : byName(a, b)));
});
</script>
