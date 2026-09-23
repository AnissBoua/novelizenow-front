<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <div v-if="notFound" class="flex items-center justify-center py-32 text-[#555D75]">Cet auteur est introuvable.</div>

    <div v-else-if="loadError" class="flex flex-col items-center justify-center gap-4 py-32 text-[#555D75]">
      Impossible de charger cette page.
      <button type="button" class="px-4 py-2.5 rounded-[9px] border border-[#D6D9E4] bg-white text-sm font-semibold text-[#101323] hover:border-[#3138B0] hover:text-[#3138B0]" @click="load">Réessayer</button>
    </div>

    <template v-else-if="data">
      <section class="bg-[#FFFCF6] border-b border-[#EADFCB]">
        <div class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-[18px] flex items-center gap-2 font-plexmono text-xs tracking-wider uppercase text-[#6B7286]">
          <RouterLink to="/" class="text-[#6B7286] hover:text-[#3138B0]">Parcourir</RouterLink>
          <iconify-icon icon="tabler:chevron-right" class="text-[13px]"></iconify-icon>
          <span>Auteurs</span>
          <iconify-icon icon="tabler:chevron-right" class="text-[13px]"></iconify-icon>
          <span class="text-[#101323]">{{ fullName }}</span>
        </div>
        <div class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-7 pb-9 flex flex-wrap gap-8 items-start">
          <img v-if="author.avatar" class="w-[132px] h-[132px] flex-none rounded-full object-cover border border-[#EADFCB]" :src="BACK_URL + author.avatar.filepath" :alt="fullName">
          <span v-else class="w-[132px] h-[132px] flex-none rounded-full bg-[#F7E3C2] border border-[#EADFCB] flex items-center justify-center font-sora text-[42px] font-semibold tracking-[-0.02em] text-[#7A5313]">{{ initials(author) }}</span>

          <div class="flex-[1_1_520px] min-w-[280px]">
            <div class="flex flex-wrap items-start justify-between gap-5">
              <div class="min-w-0">
                <h1 class="font-sora text-[clamp(32px,4vw,46px)] leading-[1.05] tracking-[-0.035em] font-semibold capitalize">{{ fullName }}</h1>
                <div v-if="author.username" class="text-sm text-[#555D75] mt-2.5">@{{ author.username }}</div>
              </div>
              <div class="flex gap-2 flex-none">
                <button
                  v-if="!author.isSelf"
                  type="button"
                  class="flex items-center gap-[7px] h-11 px-[18px] rounded-[10px] border text-[15px] font-semibold disabled:opacity-60"
                  :class="author.isFollowing ? 'border-[#CFD2EE] bg-[#E9EAF7] text-[#3138B0]' : 'border-[#3138B0] bg-[#3138B0] text-white hover:bg-[#232878]'"
                  :disabled="togglingFollow"
                  @click="toggleFollow"
                >
                  <iconify-icon :icon="author.isFollowing ? 'tabler:check' : 'tabler:plus'" class="text-lg"></iconify-icon>{{ author.isFollowing ? 'Suivi' : 'Suivre' }}
                </button>
                <button type="button" :title="shareCopied ? 'Lien copié' : 'Partager'" class="w-11 h-11 rounded-[10px] border border-[#EADFCB] bg-white text-[#333B54] flex items-center justify-center hover:border-[#E9A23B] hover:text-[#7A5313]" @click="share">
                  <iconify-icon :icon="shareCopied ? 'tabler:check' : 'tabler:share-2'" class="text-[19px]"></iconify-icon>
                </button>
              </div>
            </div>
            <p v-if="shareCopied" class="text-sm text-[#7A5313] mt-2">Lien copié dans le presse-papiers.</p>
            <p v-if="author.bio" class="font-newsreader text-[20px] leading-[1.55] text-[#3A4260] mt-[18px] max-w-[60ch]">{{ author.bio }}</p>
            <div class="flex flex-wrap gap-7 mt-6 pt-[18px] border-t border-[#EADFCB]">
              <span v-for="s in statItems" :key="s.label" class="block">
                <span class="block font-sora text-[22px] font-semibold tracking-[-0.02em]">{{ s.value }}</span>
                <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313] mt-1">{{ s.label }}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6 pb-[72px] flex flex-wrap gap-6 items-start">
        <main class="flex-[100_1_520px] min-w-[300px] flex flex-col gap-4">
          <div class="flex gap-2 flex-wrap">
            <button v-for="t in tabs" :key="t" type="button" class="px-[15px] py-[9px] rounded-full border text-sm font-semibold" :class="tab === t ? 'bg-[#101323] text-white border-[#101323]' : 'bg-white text-[#333B54] border-[#DCDEE8]'" @click="tab = t">{{ t }}</button>
          </div>

          <template v-if="tab === 'Romans'">
            <div class="flex flex-wrap gap-6 p-[22px] bg-white border border-[#E2E4EC] rounded-[14px]">
              <RouterLink :to="novelLink(featured)" class="flex-[0_0_150px] aspect-[2/3] rounded-[10px] overflow-hidden bg-[#F0EBE0] border border-[#EADFCB] block">
                <img v-if="featured.cover" class="w-full h-full object-cover" :src="BACK_URL + featured.cover.filepath" :alt="featured.title">
              </RouterLink>
              <div class="flex-[1_1_300px] min-w-0 flex flex-col">
                <span class="font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313]">Roman le plus aimé</span>
                <RouterLink :to="novelLink(featured)" class="font-newsreader text-[28px] font-medium leading-[1.15] mt-2 text-[#101323] hover:text-[#3138B0]">{{ featured.title }}</RouterLink>
                <p v-if="featured.resume" class="font-newsreader text-[17px] leading-[1.55] text-[#3A4260] mt-2.5 max-w-[58ch]">{{ featured.resume }}</p>
                <span class="flex flex-wrap items-center gap-3.5 text-[13px] text-[#555D75] mt-3.5">
                  <span class="flex items-center gap-1"><iconify-icon icon="tabler:heart" class="text-sm text-[#B4741A]"></iconify-icon>{{ fmt(featured.likesCount) }}</span>
                  <span>{{ featured.chapterCount }} {{ featured.chapterCount > 1 ? 'chapitres' : 'chapitre' }}</span>
                  <span>{{ progressLabel(featured) }}</span>
                  <span v-if="featured.hasFreeChapter" class="font-semibold px-2 py-[3px] rounded-[5px] bg-[#FBEEDA] text-[#7A5313]">1er chapitre gratuit</span>
                </span>
                <span class="flex-1 min-h-[14px]"></span>
                <RouterLink v-if="featured.firstChapterId" :to="{name: 'read_page', params: {slug: featured.slug, chapter_id: featured.firstChapterId}}" class="self-start flex items-center gap-2 px-[18px] py-[11px] rounded-[10px] bg-[#101323] text-white text-[15px] font-semibold hover:bg-[#232640]">
                  <iconify-icon icon="tabler:book-2" class="text-lg"></iconify-icon>Lire le chapitre 1
                </RouterLink>
              </div>
            </div>

            <section v-if="novels.length > 1" class="bg-white border border-[#E2E4EC] rounded-[14px] overflow-hidden">
              <div class="flex items-center justify-between gap-3 flex-wrap px-5 py-4">
                <h2 class="font-sora text-base font-semibold">Tous ses romans</h2>
                <div class="flex gap-0.5 p-[3px] bg-[#E9EBF1] rounded-[9px] h-9">
                  <button v-for="o in sortOptions" :key="o.key" type="button" class="rounded-[7px] px-3 text-[13px] font-semibold" :class="sort === o.key ? 'bg-white text-[#101323] shadow-[0_1px_2px_rgba(16,19,35,0.12)]' : 'text-[#555D75]'" @click="sort = o.key">{{ o.label }}</button>
                </div>
              </div>
              <RouterLink v-for="novel in sortedNovels" :key="novel.id" :to="novelLink(novel)" class="flex gap-[18px] px-5 py-[18px] border-t border-[#EEEFF4] text-[#101323] hover:bg-[#F7F7FD]">
                <span class="w-16 flex-none aspect-[2/3] rounded-[7px] overflow-hidden bg-[#E6E8F0] border border-[#E2E4EC] block">
                  <img v-if="novel.cover" class="w-full h-full object-cover" :src="BACK_URL + novel.cover.filepath" :alt="novel.title">
                </span>
                <span class="flex-auto min-w-0 block">
                  <span class="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                    <span class="font-newsreader text-[20px] font-medium">{{ novel.title }}</span>
                    <span v-if="novel.firstCategory" class="text-[13px] text-[#555D75] capitalize">{{ novel.firstCategory.name }}</span>
                  </span>
                  <span v-if="novel.resume" class="block font-newsreader text-base leading-normal text-[#3A4260] mt-[5px] max-w-[72ch] line-clamp-3">{{ novel.resume }}</span>
                  <span class="flex flex-wrap items-center gap-3.5 text-[13px] text-[#555D75] mt-[9px]">
                    <span class="flex items-center gap-1"><iconify-icon icon="tabler:heart" class="text-sm text-[#B4741A]"></iconify-icon>{{ fmt(novel.likesCount) }}</span>
                    <span>{{ novel.chapterCount }} {{ novel.chapterCount > 1 ? 'chapitres' : 'chapitre' }}</span>
                    <span>{{ progressLabel(novel) }}</span>
                    <span v-if="novel.updatedAt">Mis à jour {{ relativeDay(novel.updatedAt) }}</span>
                  </span>
                </span>
              </RouterLink>
            </section>
          </template>

          <section v-else class="bg-white border border-[#E2E4EC] rounded-[14px] px-5 py-[18px]">
            <h2 class="font-sora text-base font-semibold">À propos de <span class="capitalize">{{ author.name }}</span></h2>
            <p v-if="author.bio" class="font-newsreader text-lg leading-relaxed text-[#3A4260] mt-3 max-w-[64ch]">{{ author.bio }}</p>
            <div class="grid gap-4 mt-5 pt-[18px] border-t border-[#EEEFF4]" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
              <div v-for="f in facts" :key="f.label">
                <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">{{ f.label }}</div>
                <div class="text-[15px] font-semibold mt-[5px] first-letter:uppercase">{{ f.value }}</div>
              </div>
            </div>
            <div v-if="data.genres.length" class="flex flex-wrap gap-2 mt-5">
              <RouterLink v-for="g in data.genres" :key="g.id" :to="{name: 'category', params: {id: g.id}}" class="px-3 py-1.5 rounded-full border border-[#E2E4EC] bg-[#F7F8FC] text-[13px] font-medium text-[#333B54] capitalize hover:border-[#3138B0] hover:text-[#3138B0]">{{ g.name }}</RouterLink>
            </div>
          </section>
        </main>

        <aside class="flex-[1_1_300px] min-w-[260px] grid gap-4 items-start" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
          <section v-if="data.nextChapter || data.rhythm" class="bg-[#FFFBF4] border border-[#EADFCB] rounded-[14px] px-5 py-[18px]">
            <h2 class="flex items-center gap-2 font-sora text-base font-semibold"><iconify-icon icon="tabler:calendar-event" class="text-[19px] text-[#B4741A]"></iconify-icon>Prochain chapitre</h2>
            <template v-if="data.nextChapter">
              <div class="font-sora text-2xl font-semibold tracking-[-0.02em] mt-3 first-letter:uppercase">{{ nextChapterDate }}</div>
              <div class="text-sm text-[#555D75] mt-1">{{ data.nextChapter.novel.title }} · chapitre {{ data.nextChapter.number }}</div>
            </template>
            <template v-else>
              <div class="font-sora text-2xl font-semibold tracking-[-0.02em] mt-3 first-letter:uppercase">{{ rhythmText }}</div>
              <div class="text-sm text-[#555D75] mt-1">{{ data.rhythm.novelTitle }}</div>
            </template>
            <div v-if="highlightedDay !== null" class="grid grid-cols-7 gap-1.5 mt-4">
              <span v-for="(d, i) in ['L', 'M', 'M', 'J', 'V', 'S', 'D']" :key="i" class="flex flex-col items-center gap-1.5">
                <span class="font-plexmono text-[11px] text-[#6B7286]">{{ d }}</span>
                <span class="w-full h-2 rounded-full" :class="i === highlightedDay ? 'bg-[#E9A23B]' : 'bg-[#EFE7D8]'"></span>
              </span>
            </div>
            <div v-if="data.rhythm && data.nextChapter" class="text-[13px] text-[#6B7286] mt-3 first-letter:uppercase">Rythme annoncé : {{ rhythmText }} ({{ data.rhythm.novelTitle }}).</div>
          </section>

          <section v-if="data.recentChapters.length" class="bg-white border border-[#E2E4EC] rounded-[14px] px-5 py-[18px]">
            <h2 class="flex items-center gap-2 font-sora text-base font-semibold mb-1"><iconify-icon icon="tabler:clock" class="text-[19px] text-[#3138B0]"></iconify-icon>Derniers chapitres</h2>
            <RouterLink v-for="c in data.recentChapters" :key="c.id" :to="{name: 'read_page', params: {slug: c.novel.slug, chapter_id: c.id}}" class="flex items-center gap-3 py-3 border-b border-[#EEEFF4] last:border-b-0 text-[#101323] hover:text-[#3138B0]">
              <span class="flex-none w-[30px] font-plexmono text-[13px] text-[#868DA3]">{{ String(c.number).padStart(2, '0') }}</span>
              <span class="flex-auto min-w-0">
                <span class="block font-newsreader text-[17px] font-medium leading-tight">{{ c.title }}</span>
                <span class="block text-xs text-[#555D75] mt-[3px]">{{ c.novel.title }} · {{ relativeDay(c.date) }}</span>
              </span>
            </RouterLink>
          </section>

          <section v-if="data.alsoRead.length" class="bg-white border border-[#E2E4EC] rounded-[14px] px-5 py-[18px]">
            <h2 class="flex items-center gap-2 font-sora text-base font-semibold mb-1"><iconify-icon icon="tabler:users" class="text-[19px] text-[#3138B0]"></iconify-icon><span>Les lecteurs de <span class="capitalize">{{ author.name }}</span> lisent aussi</span></h2>
            <RouterLink v-for="a in data.alsoRead" :key="a.id" :to="{name: 'author', params: {id: a.id}}" class="flex items-center gap-3 py-3 border-b border-[#EEEFF4] last:border-b-0 text-[#101323] hover:text-[#3138B0]">
              <img v-if="a.avatar" class="w-[38px] h-[38px] flex-none rounded-full object-cover" :src="BACK_URL + a.avatar.filepath" alt="">
              <span v-else class="w-[38px] h-[38px] flex-none rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-[13px] font-semibold text-[#3138B0]">{{ initials(a) }}</span>
              <span class="flex-auto min-w-0">
                <span class="block text-[15px] font-semibold capitalize">{{ a.name }} {{ a.lastname }}</span>
                <span v-if="a.novelTitle" class="block text-xs text-[#555D75] mt-0.5">{{ a.novelTitle }}<template v-if="a.category"> · <span class="capitalize">{{ a.category }}</span></template></span>
              </span>
            </RouterLink>
          </section>
        </aside>
      </div>
    </template>

    <div v-else class="flex items-center justify-center py-32">
      <iconify-icon icon="tabler:loader-2" class="text-[28px] text-[#3138B0] animate-spin"></iconify-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useAuth } from '@/stores/auth.js';
import { progressLabels, rhythmLabel } from '@/utils/rhythm.js';
import { parseDate, relativeDay } from '@/utils/dates.js';

const BACK_URL = import.meta.env.VITE_BACK_URL;
const authorId = useRoute().params.id;
const router = useRouter();
const { token } = storeToRefs(useAuth());

const data = ref(null);
const notFound = ref(false);
const loadError = ref(false);
const tab = ref('Romans');
const tabs = ['Romans', 'À propos'];
const sort = ref('popular');
const sortOptions = [
  { key: 'popular', label: 'Populaires' },
  { key: 'updated', label: 'Mis à jour' },
];
const togglingFollow = ref(false);
const shareCopied = ref(false);

function load() {
  loadError.value = false;
  axios.get(`/author/${authorId}`).then((res) => {
    data.value = res.data;
  }).catch((err) => {
    if (err.response?.status === 404) {
      notFound.value = true;
    } else {
      loadError.value = true;
    }
  });
}
load();

const author = computed(() => data.value.author);
const novels = computed(() => data.value.novels);
const featured = computed(() => data.value.novels[0]);
const fullName = computed(() => `${author.value.name} ${author.value.lastname}`.trim());

const sortedNovels = computed(() => {
  if (sort.value === 'popular') return novels.value;
  return [...novels.value].sort((a, b) => String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')));
});

const statItems = computed(() => [
  { value: fmt(data.value.stats.novels), label: data.value.stats.novels > 1 ? 'romans' : 'roman' },
  { value: fmt(data.value.stats.likes), label: "j'aime" },
  { value: fmt(data.value.stats.followers), label: data.value.stats.followers > 1 ? 'abonnés' : 'abonné' },
  { value: fmt(data.value.stats.words), label: 'mots publiés' },
]);

const rhythmText = computed(() => (data.value.rhythm ? rhythmLabel(data.value.rhythm.rhythm, data.value.rhythm.releaseDay) : ''));

const facts = computed(() => {
  const list = [
    { label: 'Genres', value: data.value.genres.map((g) => g.name).join(', ') || '—' },
    { label: 'Premier roman', value: parseDate(data.value.firstPublishedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) },
  ];
  if (data.value.rhythm) list.push({ label: 'Rythme', value: rhythmText.value });
  return list;
});

const nextChapterDate = computed(() => {
  const date = parseDate(data.value.nextChapter.publishAt);
  const day = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time}`;
});

// Monday = 0 … Sunday = 6, matching the week strip.
const highlightedDay = computed(() => {
  if (data.value.nextChapter) return (parseDate(data.value.nextChapter.publishAt).getDay() + 6) % 7;
  if (data.value.rhythm?.releaseDay) return data.value.rhythm.releaseDay - 1;
  return null;
});

function novelLink(novel) {
  return { name: 'read_novel', params: { novel_slug: novel.slug } };
}

function progressLabel(novel) {
  return progressLabels[novel.progress] ?? progressLabels.ongoing;
}

function initials(person) {
  return ((person.name?.[0] ?? '') + (person.lastname?.[0] ?? '')).toUpperCase();
}

function fmt(n) {
  return new Intl.NumberFormat('fr-FR').format(n ?? 0);
}

function toggleFollow() {
  if (!token.value) {
    router.push({ name: 'login' });
    return;
  }
  togglingFollow.value = true;
  axios.post(`follow/${author.value.id}`).then((res) => {
    author.value.isFollowing = res.data.following;
    data.value.stats.followers = res.data.followersCount;
  }).catch((err) => console.error(err)).finally(() => {
    togglingFollow.value = false;
  });
}

async function share() {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: fullName.value, url });
    } catch (e) {
      // The reader closed the share sheet.
    }
    return;
  }
  await navigator.clipboard.writeText(url);
  shareCopied.value = true;
  setTimeout(() => { shareCopied.value = false; }, 2500);
}
</script>
