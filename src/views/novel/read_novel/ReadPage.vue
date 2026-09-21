<template>
  <div v-if="novel" :style="{ background: theme.bg, color: theme.ink }" style="min-height: 100vh;">

    <header class="sticky top-0 z-30" :style="{ background: theme.bg, borderBottom: `1px solid ${mixSoft(0.12)}` }">
      <div class="max-w-[1100px] mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-4">
        <RouterLink :to="{name: 'read_novel', params: {novel_slug: novelSlug}}" class="flex items-center gap-2.5 min-w-0" :style="{ color: theme.ink }">
          <iconify-icon icon="tabler:arrow-left" class="text-[20px] flex-none"></iconify-icon>
          <span class="flex flex-col min-w-0">
            <span class="font-sora text-sm font-semibold tracking-[-0.02em] truncate">{{ novel.title }}</span>
            <span class="font-plexmono text-[11px] truncate" :style="{ color: theme.inkSoft }">{{ novel.author.name }} {{ novel.author.lastname }}</span>
          </span>
        </RouterLink>

        <span class="flex-1"></span>

        <div class="flex items-center gap-2 flex-none">
          <a :href="`#`" @click.prevent="goToSummary" class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold" :style="{ border: `1px solid ${mixSoft(0.16)}`, color: theme.ink }">
            <iconify-icon icon="tabler:list-numbers" class="text-[17px]"></iconify-icon>Sommaire
          </a>
          <div class="relative">
            <button type="button" class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold" :style="{ border: `1px solid ${mixSoft(0.16)}`, color: theme.ink }" @click="panelOpen = !panelOpen">
              <iconify-icon icon="tabler:text-size" class="text-[17px]"></iconify-icon>Lecture
            </button>
            <div v-if="panelOpen" class="absolute top-[calc(100%+10px)] right-0 w-[268px] p-4 rounded-2xl z-40" :style="{ background: theme.bg, border: `1px solid ${mixSoft(0.16)}`, boxShadow: '0 18px 44px rgba(16,19,35,0.18)' }">
              <div class="font-plexmono text-[11px] tracking-wider uppercase" :style="{ color: theme.inkSoft }">Taille du texte</div>
              <div class="flex items-center gap-2.5 mt-2.5">
                <button type="button" class="flex-1 py-2.5 rounded-lg font-newsreader text-[15px]" :style="{ border: `1px solid ${mixSoft(0.18)}` }" @click="readerSize = Math.max(16, readerSize - 2)">A</button>
                <span class="font-plexmono text-xs min-w-[44px] text-center" :style="{ color: theme.inkSoft }">{{ readerSize }} px</span>
                <button type="button" class="flex-1 py-2.5 rounded-lg font-newsreader text-[22px]" :style="{ border: `1px solid ${mixSoft(0.18)}` }" @click="readerSize = Math.min(28, readerSize + 2)">A</button>
              </div>
              <div class="font-plexmono text-[11px] tracking-wider uppercase mt-4" :style="{ color: theme.inkSoft }">Fond</div>
              <div class="flex gap-2 mt-2.5">
                <button
                  v-for="t in themeOptions"
                  :key="t.key"
                  type="button"
                  class="flex-1 py-2.5 rounded-lg text-xs font-semibold"
                  :style="{ background: t.bg, color: t.ink, border: `1px solid ${themeKey === t.key ? '#E9A23B' : 'rgba(128,128,128,0.35)'}` }"
                  @click="themeKey = t.key"
                >{{ t.label }}</button>
              </div>
            </div>
          </div>
          <RouterLink v-if="token && user" :to="{name: 'account'}" class="w-[34px] h-[34px] flex-none rounded-full flex items-center justify-center font-sora text-[13px] font-semibold" :style="{ background: mixSoft(0.1), color: theme.ink }">{{ initials }}</RouterLink>
        </div>
      </div>
      <span class="block h-[3px]" :style="{ background: mixSoft(0.1) }">
        <span class="block h-[3px] transition-[width]" :style="{ background: '#E9A23B', width: progress + '%' }"></span>
      </span>
    </header>

    <article class="max-w-[720px] mx-auto px-4 sm:px-6" style="padding-top: 56px; padding-bottom: 8px;">
      <div class="flex items-center gap-2.5 font-plexmono text-xs tracking-wider uppercase" :style="{ color: theme.inkSoft }">
        <span>Chapitre {{ String(chapterIndex + 1).padStart(2, '0') }}</span>
        <span class="flex-none w-[22px] h-px" :style="{ background: mixSoft(0.3) }"></span>
        <span>{{ String(chapterIndex + 1).padStart(2, '0') }} / {{ publishedChapters.length }}</span>
      </div>
      <h1 class="font-newsreader font-medium mt-3.5" style="font-size: clamp(34px, 5vw, 50px); letter-spacing: -0.02em; line-height: 1.12;">{{ chapterTitle }}</h1>

      <div class="flex flex-wrap items-center gap-2.5 mt-4 pb-6" :style="{ borderBottom: `1px solid ${mixSoft(0.14)}`, color: theme.inkSoft }">
        <span v-if="unlocked" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold" style="background: #FBEEDA; color: #7A5313;">
          <iconify-icon icon="tabler:lock-open" class="text-[15px]"></iconify-icon>{{ chapterIndex === 0 ? 'Gratuit' : 'Débloqué' }}
        </span>
        <span v-else class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold" style="background: #F1F2F7; color: #101323;">
          <iconify-icon icon="tabler:lock" class="text-[15px]"></iconify-icon>Verrouillé
        </span>
        <span v-if="wordCount">{{ wordCount }} mots</span>
        <span v-if="readingMinutes">≈ {{ readingMinutes }} min de lecture</span>
      </div>

      <div v-if="unlocked && chapterHtml" class="mt-8" :style="{ fontSize: readerSize + 'px', lineHeight: 1.78, fontFamily: readerFontFamily }" v-html="chapterHtml"></div>

      <div v-else-if="!unlocked" class="relative" style="margin-top: 24px;">
        <div class="rounded-2xl text-center p-6" :style="{ border: '1px solid #E9A23B', background: `color-mix(in oklab, #E9A23B 8%, ${theme.bg})` }">
          <iconify-icon icon="tabler:lock" class="text-[26px]" style="color: #B4741A;"></iconify-icon>
          <h2 class="font-sora text-xl font-semibold mt-2.5">Ce chapitre est verrouillé</h2>
          <p class="text-[15px] leading-relaxed mt-2 mx-auto max-w-[40ch]" :style="{ color: theme.inkSoft }">Le premier chapitre de chaque roman est gratuit. Débloquez le roman entier pour lire la suite.</p>
          <div class="flex flex-wrap justify-center gap-2.5 mt-5">
            <button v-if="token" type="button" class="px-5 py-3 rounded-lg border-0 text-[15px] font-semibold" style="background: #E9A23B; color: #2A1B05;" @click="$router.push({name: 'read_novel', params: {novel_slug: novelSlug}, hash: '#pieces'})">
              <span class="flex items-center gap-2"><iconify-icon icon="tabler:coin" class="text-[18px]"></iconify-icon>Débloquer le roman · {{ novel.price }} pièces</span>
            </button>
            <RouterLink v-else :to="{name: 'login'}" class="px-5 py-3 rounded-lg border-0 text-[15px] font-semibold" style="background: #E9A23B; color: #2A1B05;">Se connecter pour débloquer</RouterLink>
          </div>
          <span class="block text-[13px] mt-3.5" :style="{ color: theme.inkSoft }">{{ token ? `Solde : ${coins ?? 0} pièces.` : 'Créez un compte pour acheter des pièces.' }}</span>
        </div>
      </div>
    </article>

    <div v-if="unlocked" class="max-w-[720px] mx-auto px-4 sm:px-6">
      <div class="flex flex-wrap items-center gap-2.5 mt-10 py-4" :style="{ borderTop: `1px solid ${mixSoft(0.14)}`, borderBottom: `1px solid ${mixSoft(0.14)}` }">
        <button type="button" class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[15px] font-semibold" :style="likeStyle" @click="toggleLike">
          <iconify-icon :icon="isLiked ? 'tabler:heart-filled' : 'tabler:heart'" class="text-[18px]"></iconify-icon>{{ likesCount }}
        </button>
        <RouterLink :to="{name: 'read_novel', params: {novel_slug: novelSlug}, query: {tab: 'Commentaires'}}" class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[15px] font-semibold" :style="{ border: `1px solid ${mixSoft(0.18)}`, color: theme.ink }">
          <iconify-icon icon="tabler:message-circle" class="text-[18px]"></iconify-icon>{{ novel.commentsCount ?? 0 }}
        </RouterLink>
        <span class="flex-1"></span>
        <span class="text-sm" :style="{ color: theme.inkSoft }">Fin du chapitre {{ String(chapterIndex + 1).padStart(2, '0') }}</span>
      </div>

      <RouterLink v-if="nextChapter" :to="chapterLink(nextChapter)" class="flex items-center gap-4 mt-4 p-6 rounded-2xl" :style="{ background: mixSoft(0.05), border: `1px solid ${mixSoft(0.12)}`, color: theme.ink }">
        <span class="flex-1 min-w-0">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase" :style="{ color: theme.inkSoft }">Chapitre suivant · {{ String(chapterIndex + 2).padStart(2, '0') }}</span>
          <span class="block font-newsreader text-2xl font-medium leading-tight mt-2 truncate">{{ nextChapter.title }}</span>
        </span>
        <iconify-icon icon="tabler:arrow-right" class="text-2xl flex-none"></iconify-icon>
      </RouterLink>
      <div v-else class="flex items-center gap-4 mt-4 p-6 rounded-2xl text-center justify-center" :style="{ background: mixSoft(0.05), border: `1px solid ${mixSoft(0.12)}` }">
        <span class="font-newsreader text-lg" :style="{ color: theme.inkSoft }">Vous avez atteint le dernier chapitre publié.</span>
      </div>
    </div>

    <nav class="max-w-[720px] mx-auto px-4 sm:px-6 py-10 flex gap-3">
      <RouterLink v-if="prevChapter" :to="chapterLink(prevChapter)" class="flex-1 min-w-0 flex items-center gap-2.5 p-3.5 rounded-lg" :style="{ border: `1px solid ${mixSoft(0.14)}`, color: theme.ink }">
        <iconify-icon icon="tabler:chevron-left" class="text-[19px] flex-none"></iconify-icon>
        <span class="min-w-0">
          <span class="block font-plexmono text-[10px] tracking-wider uppercase" :style="{ color: theme.inkSoft }">Chapitre {{ String(chapterIndex).padStart(2, '0') }}</span>
          <span class="block font-newsreader text-[17px] truncate">{{ prevChapter.title }}</span>
        </span>
      </RouterLink>
      <span v-else class="flex-1"></span>
      <RouterLink v-if="nextChapter" :to="chapterLink(nextChapter)" class="flex-1 min-w-0 flex items-center justify-end gap-2.5 p-3.5 rounded-lg text-right" :style="{ border: `1px solid ${mixSoft(0.14)}`, color: theme.ink }">
        <span class="min-w-0">
          <span class="block font-plexmono text-[10px] tracking-wider uppercase" :style="{ color: theme.inkSoft }">Chapitre {{ String(chapterIndex + 2).padStart(2, '0') }}</span>
          <span class="block font-newsreader text-[17px] truncate">{{ nextChapter.title }}</span>
        </span>
        <iconify-icon icon="tabler:chevron-right" class="text-[19px] flex-none"></iconify-icon>
      </RouterLink>
    </nav>
  </div>

  <div v-else-if="error" class="min-h-screen bg-[#FFFCF6] flex flex-col items-center justify-center gap-3 text-center px-4">
    <h1 class="font-sora text-xl font-semibold">Oups</h1>
    <p class="text-[#555D75]">{{ error }}</p>
    <RouterLink :to="{name: 'read_novel', params: {novel_slug: novelSlug}}" class="text-[#3138B0] font-semibold">Retour au roman</RouterLink>
  </div>
  <div v-else class="min-h-screen bg-[#FFFCF6] flex items-center justify-center">
    <iconify-icon icon="tabler:loader-2" class="text-[28px] text-[#3138B0] animate-spin"></iconify-icon>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuth } from "@/stores/auth.js";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const authStore = useAuth();
const { user, token, coins } = storeToRefs(authStore);

const novelSlug = route.params.slug;
const chapterId = ref(Number(route.params.chapter_id));

const novel = ref(null);
const chapterHtml = ref("");
const chapterContent = ref("");
const error = ref("");

const isLiked = ref(false);
const likesCount = ref(0);

const panelOpen = ref(false);
const progress = ref(0);

const readerSize = ref(Number(localStorage.getItem("reader_size")) || 20);
const themeKey = ref(localStorage.getItem("reader_theme") || "papier");
const readerFont = ref(localStorage.getItem("reader_font") || "Newsreader");
const readerFontFamily = computed(() => (readerFont.value === "Figtree" ? "Figtree, sans-serif" : "Newsreader, serif"));

const themeOptions = [
  { key: "papier", label: "Papier", bg: "#FFFCF6", ink: "#101323", inkSoft: "#6B7286" },
  { key: "sepia", label: "Sépia", bg: "#F3E7D3", ink: "#33271A", inkSoft: "#6B5637" },
  { key: "nuit", label: "Nuit", bg: "#15161D", ink: "#E6E7EF", inkSoft: "#A3A8BC" },
];
const theme = computed(() => themeOptions.find((t) => t.key === themeKey.value) ?? themeOptions[0]);

watch(readerSize, (v) => localStorage.setItem("reader_size", v));
watch(themeKey, (v) => localStorage.setItem("reader_theme", v));

function mixSoft(alpha) {
  return `color-mix(in oklab, ${theme.value.ink} ${Math.round(alpha * 100)}%, transparent)`;
}

const initials = computed(() => {
  if (!user.value) return "";
  return (user.value.name?.slice(0, 1) ?? "").toUpperCase() + (user.value.lastname?.slice(0, 1) ?? "").toUpperCase();
});

const publishedChapters = computed(() => (novel.value ? (novel.value.isAuthor ? novel.value.chapters : novel.value.publishedChapters) : []));
const chapterIndex = computed(() => publishedChapters.value.findIndex((c) => c.id === chapterId.value));
const prevChapter = computed(() => (chapterIndex.value > 0 ? publishedChapters.value[chapterIndex.value - 1] : null));
const nextChapter = computed(() => (chapterIndex.value >= 0 && chapterIndex.value < publishedChapters.value.length - 1 ? publishedChapters.value[chapterIndex.value + 1] : null));
const unlocked = computed(() => novel.value && (chapterIndex.value === 0 || novel.value.userBought || novel.value.isAuthor));
const chapterTitle = computed(() => publishedChapters.value[chapterIndex.value]?.title ?? "");

const currentWordCount = computed(() => chapterContent.value.trim() ? chapterContent.value.trim().split(/\s+/).filter(Boolean).length : 0);
const wordCount = computed(() => (currentWordCount.value ? new Intl.NumberFormat("fr-FR").format(currentWordCount.value) : ""));
const readingMinutes = computed(() => (currentWordCount.value ? Math.max(1, Math.round(currentWordCount.value / 200)) : ""));

const likeStyle = computed(() => (isLiked.value
  ? { background: "#FBEEDA", color: "#7A5313", border: "1px solid #E9A23B" }
  : { border: `1px solid ${mixSoft(0.18)}`, color: theme.value.ink }));

function chapterLink(chapter) {
  return { name: "read_page", params: { slug: novelSlug, chapter_id: chapter.id } };
}

function goToSummary() {
  router.push({ name: "read_novel", params: { novel_slug: novelSlug }, hash: "#sommaire" });
}

function toggleLike() {
  if (!token.value) {
    router.push({ name: "login" });
    return;
  }
  axios.post("like/", { novel: novel.value.id }).then((res) => {
    if (res.data.response) {
      isLiked.value = false;
      likesCount.value--;
    } else {
      isLiked.value = true;
      likesCount.value++;
    }
  });
}

async function loadChapterContent() {
  try {
    const res = await axios.get(`chapter_pages/${chapterId.value}`);
    chapterHtml.value = res.data.html ?? "";
    chapterContent.value = res.data.content ?? "";
  } catch (e) {
    error.value = e.response?.data?.detail ?? e.response?.data?.error ?? "Ce chapitre est introuvable.";
  }
}

async function init() {
  const res = await axios.get(`novel/bySlug/${novelSlug}`);
  novel.value = res.data;
  likesCount.value = novel.value.likesCount ?? 0;

  if (token.value) {
    axios.get(`like/liked/${novel.value.id}`).then((res) => {
      isLiked.value = res.data.liked;
    });
  }

  if (unlocked.value) {
    await loadChapterContent();
  }
}

let onScroll;
onMounted(() => {
  init();
  onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});

</script>
