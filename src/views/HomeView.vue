<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <Hero v-if="!token && heroChapter" :chapter="heroChapter" />

    <div class="max-w-[1340px] mx-auto px-4 py-6 flex flex-wrap gap-6 items-start">
      <aside class="flex-1 basis-[190px] min-w-[190px] grid gap-5" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));">
        <nav class="flex flex-col gap-0.5">
          <RouterLink to="/" class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[15px] font-medium bg-[#E9EAF7] text-[#3138B0]">
            <iconify-icon icon="tabler:layout-list" class="text-[19px]"></iconify-icon>Le fil
          </RouterLink>
          <a href="#nouveautes" class="flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-[15px] font-medium text-[#333B54] hover:bg-[#E9EAF7] hover:text-[#3138B0]">
            <span class="flex items-center gap-2.5"><iconify-icon icon="tabler:file-plus" class="text-[19px]"></iconify-icon>Nouveautés</span>
            <span class="font-plexmono text-xs text-[#6B7286]">{{ store.newNovels.length }}</span>
          </a>
          <a href="#tendances" class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[15px] font-medium text-[#333B54] hover:bg-[#E9EAF7] hover:text-[#3138B0]">
            <iconify-icon icon="tabler:flame" class="text-[19px]"></iconify-icon>Tendances
          </a>
          <a href="#nouveautes" class="flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-[15px] font-medium text-[#333B54] hover:bg-[#E9EAF7] hover:text-[#3138B0]" @click="showFreeChapters">
            <span class="flex items-center gap-2.5"><iconify-icon icon="tabler:gift" class="text-[19px]"></iconify-icon>Chapitres gratuits</span>
            <span class="font-plexmono text-xs text-[#6B7286]">{{ store.freeChaptersCount }}</span>
          </a>
        </nav>
        <div id="categories">
          <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286] px-3">Catégories</div>
          <div class="flex flex-col gap-0.5 mt-2">
            <RouterLink v-for="cat in store.categories" :key="cat.id" :to="{name: 'category', params: {id: cat.id}}" class="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-[15px] text-[#333B54] hover:bg-white hover:text-[#3138B0] capitalize">
              {{ cat.name }}
              <span class="font-plexmono text-xs text-[#6B7286]">{{ cat.novelCount }}</span>
            </RouterLink>
            <RouterLink :to="{name: 'categories'}" class="px-3 py-2 text-sm font-semibold text-[#3138B0]">Toutes les catégories</RouterLink>
          </div>
        </div>
      </aside>

      <main class="flex-[100_1_460px] min-w-[300px] flex flex-col gap-4">
        <ContinueReading v-if="token" />

        <section v-if="store.carousel.length" id="tendances" class="bg-white border border-[#E2E4EC] rounded-2xl p-4">
          <div class="flex items-baseline justify-between gap-3.5 flex-wrap">
            <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
              <iconify-icon icon="tabler:flame" class="text-[19px] text-[#B4741A]"></iconify-icon>Tendances de la semaine
            </h2>
            <button type="button" class="text-sm font-semibold text-[#3138B0] hover:text-[#232878]" @click="seeAllTrending">Tout voir</button>
          </div>
          <div class="grid gap-3.5 mt-3.5" style="grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));">
            <RouterLink v-for="(novel, i) in store.carousel" :key="novel.id" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="block text-[#101323] hover:text-[#3138B0]">
              <div class="relative aspect-[2/3] rounded-lg overflow-hidden border border-[#E2E4EC] bg-[#E6E7EE]">
                <img v-if="novel.cover" class="absolute w-full h-full object-cover" :src="BACK_URL + novel.cover.filepath" :alt="novel.title">
                <span class="absolute top-1.5 left-1.5 font-plexmono text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/90 text-[#101323]">{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
              <p class="font-newsreader text-[16px] font-medium leading-tight mt-2.5">{{ novel.title }}</p>
              <p class="text-xs text-[#555D75] mt-1">{{ novel.likesCount }} j'aime</p>
            </RouterLink>
          </div>
        </section>

        <div id="nouveautes" class="flex gap-2 flex-wrap py-1">
          <button
            v-for="t in tabs"
            :key="t"
            type="button"
            class="px-4 py-2 rounded-full text-sm font-semibold border"
            :class="tab === t ? 'bg-[#101323] text-white border-[#101323]' : 'bg-white text-[#333B54] border-[#DCDEE8]'"
            @click="tab = t"
          >{{ t }}</button>
        </div>

        <p v-if="!feed.length" class="text-center text-[#6B7286] py-10">Aucun chapitre pour le moment.</p>
        <FeedPost v-for="chapter in feed" :key="chapter.id" :chapter="chapter" />

        <button
          v-if="store.hasMoreChapters"
          type="button"
          class="text-center py-3.5 rounded-xl border border-[#DCDEE8] bg-white text-[15px] font-semibold hover:border-[#3138B0] disabled:opacity-60"
          :disabled="store.loadingMore"
          @click="store.loadMoreChapters()"
        >
          <span class="flex items-center justify-center gap-2">
            {{ store.loadingMore ? 'Chargement…' : 'Charger plus de chapitres' }}
            <iconify-icon v-if="!store.loadingMore" icon="tabler:chevron-down" class="text-[18px]"></iconify-icon>
          </span>
        </button>
      </main>

      <aside class="flex-1 basis-[260px] min-w-[250px] grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
        <CoinPacks />
        <FreeReads :novels="store.newNovels" />
        <AuthorsToDiscover :novels="store.newNovels" />
        <WriteCta />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useHomeStore } from '../stores/home';
import { useAuth } from '../stores/auth';
import Hero from '../components/home/Hero.vue';
import FeedPost from '../components/home/FeedPost.vue';
import CoinPacks from '../components/home/CoinPacks.vue';
import ContinueReading from '../components/home/ContinueReading.vue';
import FreeReads from '../components/home/FreeReads.vue';
import AuthorsToDiscover from '../components/home/AuthorsToDiscover.vue';
import WriteCta from '../components/home/WriteCta.vue';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const store = useHomeStore();
const { token } = storeToRefs(useAuth());

const heroChapter = computed(() => store.chapters[0] ?? null);

const tabs = ['Nouveautés', 'Tendances', 'Gratuits'];
const tab = ref('Nouveautés');

const feed = computed(() => {
  if (tab.value === 'Tendances') {
    return [...store.chapters].sort(
      (a, b) => (b.novel.likesCount + b.novel.commentsCount) - (a.novel.likesCount + a.novel.commentsCount)
    );
  }
  if (tab.value === 'Gratuits') {
    return store.chapters.filter((chapter) => chapter.unlocked);
  }
  return store.chapters;
});

function seeAllTrending() {
  tab.value = 'Tendances';
  document.getElementById('nouveautes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showFreeChapters() {
  tab.value = 'Gratuits';
}
</script>
