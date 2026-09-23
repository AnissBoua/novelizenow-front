<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323] flex flex-col">

    <header class="bg-white border-b border-[#E2E4EC]">
      <div class="max-w-[1340px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-2 flex-none">
          <img class="h-7 w-auto rounded-lg" src="@/assets/logos/novelizelogoimg.svg" alt="logo">
          <span class="font-sora font-semibold text-[17px] tracking-[-0.025em] text-[#101323]">NovelizeNow</span>
        </RouterLink>
        <span class="text-sm text-[#6B7286]">
          {{ headerAside }} <RouterLink :to="otherModeRoute" class="font-semibold text-[#3138B0]">{{ headerLink }}</RouterLink>
        </span>
      </div>
    </header>

    <div class="flex-1 max-w-[1180px] w-full mx-auto px-4 py-10 sm:py-14 flex flex-wrap gap-10 items-start">

      <main class="flex-1 basis-[400px] min-w-[300px] max-w-[520px]">
        <div class="bg-white border border-[#E2E4EC] rounded-2xl p-7">

          <div class="flex gap-1.5 p-1 bg-[#F3F4F8] border border-[#E2E4EC] rounded-xl">
            <RouterLink
              to="/login"
              class="flex-1 text-center px-3 py-2.5 rounded-lg text-[15px] font-semibold"
              :class="isLogin ? 'bg-white border border-[#DCDEE8] text-[#101323]' : 'border border-transparent text-[#555D75]'"
            >Se connecter</RouterLink>
            <RouterLink
              to="/register"
              class="flex-1 text-center px-3 py-2.5 rounded-lg text-[15px] font-semibold"
              :class="!isLogin ? 'bg-white border border-[#DCDEE8] text-[#101323]' : 'border border-transparent text-[#555D75]'"
            >Créer un compte</RouterLink>
          </div>

          <h1 class="font-sora text-[25px] font-semibold tracking-[-0.025em] mt-6">{{ title }}</h1>
          <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[42ch]">{{ subtitle }}</p>

          <form class="flex flex-col gap-3.5 mt-5" @submit.prevent="$emit('submit')">
            <slot />

            <div v-if="error" class="text-sm text-[#6B0504] bg-[#FBEAEA] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5">{{ error }}</div>

            <button
              type="submit"
              class="mt-1 px-5 py-3.5 rounded-lg border-0 bg-[#3138B0] text-white text-base font-semibold hover:bg-[#232878] disabled:opacity-60"
              :disabled="submitting"
            >
              <span class="flex items-center justify-center gap-2">
                <iconify-icon :icon="submitIcon" class="text-[18px]"></iconify-icon>{{ submitting ? 'Un instant…' : submitLabel }}
              </span>
            </button>
          </form>

          <p class="text-sm text-[#6B7286] mt-4 text-center">
            {{ footerAside }} <RouterLink :to="otherModeRoute" class="font-semibold text-[#3138B0]">{{ footerLink }}</RouterLink>
          </p>
        </div>

        <p class="flex items-center gap-2 text-[13px] text-[#6B7286] mt-4 justify-center">
          <iconify-icon icon="tabler:shield-check" class="text-[16px]"></iconify-icon>Lecture gratuite possible sans compte. Aucun abonnement.
        </p>
      </main>

      <aside class="flex-1 basis-[380px] min-w-[300px] flex flex-col gap-4">

        <section v-if="heroChapter" class="bg-[#FFFCF6] border border-[#EADFCB] rounded-2xl p-6">
          <span class="flex items-center gap-2 font-plexmono text-xs tracking-wider uppercase text-[#7A5313]">
            <iconify-icon icon="tabler:star" class="text-[15px]"></iconify-icon>Chapitre du jour<template v-if="heroCategory"> · {{ heroCategory }}</template>
          </span>
          <h3 class="font-sora text-[18px] font-semibold leading-snug text-[#101323] mt-3">{{ heroChapter.title }}</h3>
          <p v-if="heroNovel.resume" class="text-[13px] leading-relaxed text-[#555D75] mt-1.5 line-clamp-3">{{ heroNovel.resume }}</p>
          <div class="flex items-center gap-2.5 mt-4">
            <span class="w-[34px] h-[34px] flex-none rounded-full bg-[#F7E3C2] flex items-center justify-center font-sora text-xs font-semibold text-[#7A5313]">{{ heroAuthorInitials }}</span>
            <span class="text-sm text-[#3A4260]">
              <RouterLink :to="{name: 'read_novel', params: {novel_slug: heroNovel.slug}}" class="font-semibold text-[#101323]">{{ heroNovel.title }}</RouterLink>
              par <span class="font-semibold text-[#3138B0]">{{ heroNovel.author.name }} {{ heroNovel.author.lastname }}</span>
            </span>
          </div>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl px-6 py-[22px]">
          <h2 class="font-sora text-base font-semibold">{{ benefitsTitle }}</h2>
          <div class="flex flex-col gap-3.5 mt-4">
            <div v-for="b in benefits" :key="b.title" class="flex items-start gap-3">
              <span class="w-8 h-8 flex-none rounded-[9px] flex items-center justify-center" :class="b.bgClass">
                <iconify-icon :icon="b.icon" class="text-[18px]" :class="b.fgClass"></iconify-icon>
              </span>
              <span class="flex-1 min-w-0">
                <span class="block text-[15px] font-semibold">{{ b.title }}</span>
                <span class="block text-sm leading-relaxed text-[#555D75] mt-0.5">{{ b.text }}</span>
              </span>
            </div>
          </div>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl px-6 py-[22px]">
          <div class="flex flex-wrap gap-5">
            <div v-for="s in stats" :key="s.label" class="flex-1 basis-[100px] min-w-[90px]">
              <div class="font-sora text-[22px] font-semibold tracking-[-0.02em]">{{ s.value }}</div>
              <div class="text-[13px] text-[#6B7286] mt-0.5">{{ s.label }}</div>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <footer class="bg-white border-t border-[#E2E4EC]">
      <div class="max-w-[1180px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-4 justify-between text-[13px] text-[#6B7286]">
        <span>© 2026 NovelizeNow</span>
        <span class="flex gap-5">
          <a href="#" class="text-[#6B7286]">Conditions</a>
          <a href="#" class="text-[#6B7286]">Confidentialité</a>
          <a href="#" class="text-[#6B7286]">Aide</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useHomeStore } from '@/stores/home.js';

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (v) => ['login', 'register'].includes(v),
  },
  error: {
    type: String,
    default: null,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['submit']);

const store = useHomeStore();

const isLogin = computed(() => props.mode === 'login');
const otherModeRoute = computed(() => (isLogin.value ? '/register' : '/login'));

const title = computed(() => (isLogin.value ? 'Content de vous revoir' : 'Créez votre compte'));
const subtitle = computed(() => (isLogin.value
  ? 'Retrouvez vos lectures en cours, vos pièces et votre bibliothèque.'
  : 'Lisez, suivez vos auteurs et publiez vos propres chapitres. C\'est gratuit.'));
const submitIcon = computed(() => (isLogin.value ? 'tabler:login-2' : 'tabler:user-plus'));
const headerAside = computed(() => (isLogin.value ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?'));
const headerLink = computed(() => (isLogin.value ? 'Créer un compte' : 'Se connecter'));
const footerAside = headerAside;
const footerLink = computed(() => (isLogin.value ? 'Créer un compte gratuit' : 'Se connecter'));
const benefitsTitle = computed(() => (isLogin.value ? 'Ce qui vous attend' : 'Inclus dès l\'inscription'));

const submitLabel = computed(() => (isLogin.value ? 'Se connecter' : 'Créer mon compte'));

const benefits = [
  { icon: 'tabler:book-2', title: 'Reprenez où vous en étiez', text: 'Vos chapitres en cours suivis sur tous vos appareils.', bgClass: 'bg-[#E9EAF7]', fgClass: 'text-[#3138B0]' },
  { icon: 'tabler:coin', title: 'Un solde, tout le catalogue', text: 'Pas d\'abonnement, rien n\'expire.', bgClass: 'bg-[#FBEEDA]', fgClass: 'text-[#B4741A]' },
  { icon: 'tabler:bookmark', title: 'Votre bibliothèque', text: 'Mettez des romans de côté et retrouvez-les depuis votre compte.', bgClass: 'bg-[#E9EAF7]', fgClass: 'text-[#3138B0]' },
  { icon: 'tabler:pencil', title: 'Publiez vos chapitres', text: 'L\'éditeur est ouvert à tous les comptes, et vous fixez vos prix.', bgClass: 'bg-[#FBEEDA]', fgClass: 'text-[#B4741A]' },
];

const stats = computed(() => [
  { value: store.publishedNovelsCount, label: 'romans publiés' },
  { value: store.freeChaptersCount, label: 'chapitres gratuits' },
  { value: store.totalCategoriesCount, label: 'catégories' },
]);

const heroChapter = computed(() => store.chapters[0] ?? null);
const heroNovel = computed(() => heroChapter.value?.novel ?? null);
const heroCategory = computed(() => heroNovel.value?.categories?.[0]?.name ?? '');
const heroAuthorInitials = computed(() => {
  const a = heroNovel.value?.author;
  if (!a) return '';
  return (a.name?.slice(0, 1) ?? '').toUpperCase() + (a.lastname?.slice(0, 1) ?? '').toUpperCase();
});
</script>
