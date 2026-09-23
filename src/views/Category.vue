<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <div v-if="notFound" class="flex items-center justify-center py-32 text-[#555D75]">Cette catégorie est introuvable.</div>

    <div v-else-if="loadError && !category" class="flex flex-col items-center justify-center gap-4 py-32 text-[#555D75]">
      Impossible de charger cette catégorie.
      <button type="button" class="px-4 py-2.5 rounded-[9px] border border-[#D6D9E4] bg-white text-sm font-semibold text-[#101323] hover:border-[#3138B0] hover:text-[#3138B0]" @click="load()">Réessayer</button>
    </div>

    <template v-else-if="category">
      <section class="bg-white border-b border-[#E2E4EC]">
        <div class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div class="flex items-center gap-2 font-plexmono text-xs tracking-wider uppercase text-[#6B7286]">
            <RouterLink to="/" class="text-[#6B7286] hover:text-[#3138B0]">Parcourir</RouterLink>
            <iconify-icon icon="tabler:chevron-right" class="text-[13px]"></iconify-icon>
            <RouterLink :to="{name: 'categories'}" class="text-[#6B7286] hover:text-[#3138B0]">Catégories</RouterLink>
            <iconify-icon icon="tabler:chevron-right" class="text-[13px]"></iconify-icon>
            <span class="text-[#101323]">{{ category.name }}</span>
          </div>
          <div class="flex items-center gap-3.5 mt-4">
            <span class="w-12 h-12 flex-none rounded-xl bg-[#E9EAF7] flex items-center justify-center">
              <iconify-icon :icon="category.icon || 'tabler:category'" class="text-[25px] text-[#3138B0]"></iconify-icon>
            </span>
            <h1 class="font-sora text-[clamp(32px,4vw,46px)] leading-[1.05] tracking-[-0.035em] font-semibold capitalize">{{ category.name }}</h1>
          </div>
          <p v-if="category.description" class="font-newsreader text-[20px] leading-normal text-[#3A4260] mt-3.5 max-w-[54ch]">{{ category.description }}</p>
          <div class="flex flex-wrap gap-5 mt-3.5 text-sm text-[#555D75]">
            <span><strong class="text-[#101323] font-semibold">{{ fmt(category.novelCount) }}</strong> {{ category.novelCount > 1 ? 'romans' : 'roman' }}</span>
            <span><strong class="text-[#101323] font-semibold">{{ fmt(category.newChaptersThisWeek) }}</strong> {{ category.newChaptersThisWeek > 1 ? 'nouveaux chapitres' : 'nouveau chapitre' }} cette semaine</span>
          </div>
        </div>
      </section>

      <main class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6 pb-[72px]">
        <div class="flex flex-wrap items-center gap-2.5 pb-[18px] border-b border-[#E2E4EC]">
          <div class="flex gap-0.5 p-[3px] bg-[#E9EBF1] rounded-[9px] h-10">
            <button v-for="o in statusOptions" :key="o.key" type="button" class="rounded-[7px] px-[13px] text-sm font-semibold" :class="segmentClass(status === o.key)" @click="status = o.key">{{ o.label }}</button>
          </div>
          <button type="button" class="flex items-center gap-[7px] h-10 px-[13px] rounded-[9px] border text-sm font-semibold" :class="free ? 'border-[#F0DCB8] bg-[#FBEEDA] text-[#7A5313]' : 'border-[#E2E4EC] bg-white text-[#3A4260]'" @click="free = !free">
            <iconify-icon :icon="free ? 'tabler:check' : 'tabler:gift'" class="text-[17px]"></iconify-icon>Début gratuit
          </button>
          <span class="flex-1 min-w-[8px]"></span>
          <span class="text-sm text-[#555D75]">Trier par</span>
          <div class="flex gap-0.5 p-[3px] bg-[#E9EBF1] rounded-[9px] h-10">
            <button v-for="o in sortOptions" :key="o.key" type="button" class="rounded-[7px] px-[13px] text-sm font-semibold" :class="segmentClass(sort === o.key)" @click="sort = o.key">{{ o.label }}</button>
          </div>
          <div class="flex gap-0.5 p-[3px] bg-[#E9EBF1] rounded-[9px] h-10">
            <button v-for="o in viewOptions" :key="o.key" type="button" :aria-label="o.label" class="w-9 rounded-[7px] flex items-center justify-center" :class="segmentClass(view === o.key)" @click="view = o.key">
              <iconify-icon :icon="o.icon" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>

        <div class="text-sm text-[#555D75] mt-[18px] mb-4">{{ fmt(total) }} {{ total > 1 ? 'romans' : 'roman' }}</div>

        <div v-if="loadError" class="flex flex-wrap items-center gap-3 mb-4 text-sm text-[#6B0504] bg-[#FBEAEA] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5">
          Le chargement a échoué.
          <button type="button" class="font-semibold underline" @click="load()">Réessayer</button>
        </div>

        <div v-if="!novels.length && !loading" class="px-6 py-12 text-center bg-white border border-[#E2E4EC] rounded-[14px]">
          <template v-if="filtersActive">
            <div class="font-sora text-[19px] font-semibold">Aucun roman ne correspond à ces filtres</div>
            <button type="button" class="mt-4 px-4 py-2.5 rounded-[9px] border border-[#D6D9E4] bg-white text-sm font-semibold hover:border-[#3138B0] hover:text-[#3138B0]" @click="resetFilters">Réinitialiser les filtres</button>
          </template>
          <div v-else class="font-sora text-[19px] font-semibold">Aucun roman dans cette catégorie pour le moment</div>
        </div>

        <div v-else-if="view === 'grid'" class="grid gap-x-5 gap-y-7" style="grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));">
          <RouterLink v-for="novel in novels" :key="novel.id" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="block text-[#101323] hover:text-[#3138B0]">
            <span class="block relative aspect-[2/3] rounded-[11px] overflow-hidden bg-[#E6E8F0] border border-[#E2E4EC]">
              <img v-if="novel.cover" class="absolute inset-0 w-full h-full object-cover" :src="BACK_URL + novel.cover.filepath" :alt="novel.title">
              <span v-if="novel.hasFreeChapter" class="absolute top-[9px] left-[9px] text-[11px] font-semibold tracking-[0.03em] uppercase px-2 py-1 rounded-[5px] bg-[#FBEEDA] text-[#7A5313]">1er chapitre gratuit</span>
            </span>
            <span class="block font-newsreader text-lg font-medium leading-tight mt-[11px]">{{ novel.title }}</span>
            <span class="block text-[13px] text-[#555D75] mt-[3px]">{{ novel.author }} · {{ progressLabels[novel.progress] ?? progressLabels.ongoing }}</span>
            <span class="flex items-center gap-3 text-[13px] text-[#555D75] mt-[7px]">
              <span class="flex items-center gap-1"><iconify-icon icon="tabler:heart" class="text-sm text-[#B4741A]"></iconify-icon>{{ fmt(novel.likesCount) }}</span>
              <span>{{ novel.chapterCount }} ch.</span>
            </span>
          </RouterLink>
        </div>

        <div v-else class="bg-white border border-[#E2E4EC] rounded-[14px] overflow-hidden divide-y divide-[#EEEFF4]">
          <RouterLink v-for="novel in novels" :key="novel.id" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="flex gap-[18px] px-5 py-[18px] text-[#101323] hover:bg-[#F7F7FD]">
            <span class="w-16 flex-none aspect-[2/3] rounded-[7px] overflow-hidden bg-[#E6E8F0] border border-[#E2E4EC] block">
              <img v-if="novel.cover" class="w-full h-full object-cover" :src="BACK_URL + novel.cover.filepath" :alt="novel.title">
            </span>
            <span class="flex-auto min-w-0 block">
              <span class="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span class="font-newsreader text-[20px] font-medium">{{ novel.title }}</span>
                <span class="text-[13px] text-[#555D75]">par {{ novel.author }}</span>
              </span>
              <span v-if="novel.resume" class="block font-newsreader text-base leading-normal text-[#3A4260] mt-[5px] max-w-[72ch] line-clamp-3">{{ novel.resume }}</span>
              <span class="flex flex-wrap items-center gap-3.5 text-[13px] text-[#555D75] mt-[9px]">
                <span class="flex items-center gap-1"><iconify-icon icon="tabler:heart" class="text-sm text-[#B4741A]"></iconify-icon>{{ fmt(novel.likesCount) }}</span>
                <span>{{ novel.chapterCount }} {{ novel.chapterCount > 1 ? 'chapitres' : 'chapitre' }}</span>
                <span>{{ progressLabels[novel.progress] ?? progressLabels.ongoing }}</span>
                <span v-if="novel.updatedAt">Mis à jour {{ relativeDay(novel.updatedAt) }}</span>
                <span v-if="novel.hasFreeChapter" class="font-semibold px-2 py-[3px] rounded-[5px] bg-[#FBEEDA] text-[#7A5313]">1er chapitre gratuit</span>
              </span>
            </span>
          </RouterLink>
        </div>

        <div v-if="novels.length" class="flex flex-col items-center gap-2.5 mt-9">
          <button v-if="novels.length < total" type="button" class="px-[22px] py-3 rounded-[10px] border border-[#D6D9E4] bg-white text-[15px] font-semibold hover:border-[#3138B0] hover:text-[#3138B0] disabled:opacity-60" :disabled="loading" @click="load(true)">{{ loading ? 'Chargement…' : 'Afficher plus de romans' }}</button>
          <span class="text-[13px] text-[#6B7286]">{{ novels.length }} sur {{ fmt(total) }} {{ total > 1 ? 'romans' : 'roman' }}</span>
        </div>

        <div v-if="related.length" class="mt-14 pt-7 border-t border-[#E2E4EC]">
          <h2 class="font-sora text-[20px] font-semibold tracking-[-0.02em] mb-3.5">Catégories proches</h2>
          <div class="flex flex-wrap gap-2">
            <RouterLink v-for="r in related" :key="r.id" :to="{name: 'category', params: {id: r.id}}" class="flex items-center gap-2 px-[13px] py-2 rounded-full border border-[#E2E4EC] bg-white text-sm font-medium text-[#3A4260] capitalize hover:border-[#3138B0] hover:text-[#3138B0]">
              {{ r.name }}<span class="font-plexmono text-xs text-[#868DA3]">{{ fmt(r.novelCount) }}</span>
            </RouterLink>
          </div>
        </div>
      </main>
    </template>

    <div v-else class="flex items-center justify-center py-32">
      <iconify-icon icon="tabler:loader-2" class="text-[28px] text-[#3138B0] animate-spin"></iconify-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { progressLabels } from '@/utils/rhythm.js';
import { relativeDay } from '@/utils/dates.js';

const BACK_URL = import.meta.env.VITE_BACK_URL;
const categoryId = useRoute().params.id;

const category = ref(null);
const novels = ref([]);
const related = ref([]);
const total = ref(0);
const loading = ref(false);
const notFound = ref(false);
const loadError = ref(false);

const status = ref('all');
const free = ref(false);
const sort = ref('popular');
const view = ref('grid');

const statusOptions = [
  { key: 'all', label: 'Tous' },
  { key: 'ongoing', label: 'En cours' },
  { key: 'completed', label: 'Terminés' },
];
const sortOptions = [
  { key: 'popular', label: 'Populaires' },
  { key: 'updated', label: 'Mis à jour' },
  { key: 'new', label: 'Nouveautés' },
];
const viewOptions = [
  { key: 'grid', label: 'Grille', icon: 'tabler:layout-grid' },
  { key: 'list', label: 'Liste', icon: 'tabler:list' },
];

const filtersActive = computed(() => status.value !== 'all' || free.value);

let lastRequest = 0;
function load(append = false) {
  const requestId = ++lastRequest;
  loading.value = true;
  loadError.value = false;
  axios.get(`/category/${categoryId}/novels`, {
    params: { status: status.value, free: free.value ? 1 : 0, sort: sort.value, offset: append ? novels.value.length : 0 },
  }).then((res) => {
    if (requestId !== lastRequest) return;
    category.value = res.data.category;
    related.value = res.data.related;
    total.value = res.data.total;
    novels.value = append ? [...novels.value, ...res.data.novels] : res.data.novels;
  }).catch((err) => {
    if (requestId !== lastRequest) return;
    if (err.response?.status === 404) {
      notFound.value = true;
    } else {
      loadError.value = true;
    }
  }).finally(() => {
    if (requestId === lastRequest) loading.value = false;
  });
}

watch([status, free, sort], () => load());
load();

function resetFilters() {
  status.value = 'all';
  free.value = false;
}

function segmentClass(active) {
  return active ? 'bg-white text-[#101323] shadow-[0_1px_2px_rgba(16,19,35,0.12)]' : 'text-[#555D75]';
}

function fmt(n) {
  return new Intl.NumberFormat('fr-FR').format(n ?? 0);
}

</script>
