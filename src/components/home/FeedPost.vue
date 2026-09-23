<template>
  <article class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
    <div class="flex items-center gap-3">
      <RouterLink :to="authorLink" class="flex-none w-[38px] h-[38px] rounded-full overflow-hidden bg-[#E9EAF7] flex items-center justify-center font-sora text-[13px] font-semibold text-[#3138B0]">
        <img v-if="novel.author.avatar" class="w-full h-full object-cover" :src="BACK_URL + novel.author.avatar.filepath" :alt="`${novel.author.name} ${novel.author.lastname}`">
        <template v-else>{{ authorInitials }}</template>
      </RouterLink>
      <div class="flex-1 min-w-0">
        <div class="text-[15px] text-[#333B54]">
          <RouterLink :to="authorLink" class="font-semibold text-[#3138B0] hover:text-[#232878]">{{ novel.author.name }} {{ novel.author.lastname }}</RouterLink>
          a publié un chapitre de
          <RouterLink :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="font-semibold text-[#101323] hover:text-[#232878]">{{ novel.title }}</RouterLink>
        </div>
        <div class="text-[13px] text-[#6B7286] mt-0.5 capitalize">{{ categories }}</div>
      </div>
      <span v-if="!unlocked" class="flex-none text-[13px] font-semibold px-2.5 py-1 rounded-md bg-[#F1F2F7] text-[#101323]">{{ chapter.price }} pièces</span>
      <span v-else class="flex-none text-[13px] font-semibold px-2.5 py-1 rounded-md bg-[#FBEEDA] text-[#7A5313]">Gratuit</span>
    </div>
    <div class="flex gap-4 mt-3.5 flex-wrap">
      <RouterLink :to="chapterLink" class="flex-none w-[74px]">
        <img v-if="novel.cover" class="w-full aspect-[2/3] object-cover rounded-lg border border-[#E2E4EC]" :src="BACK_URL + novel.cover.filepath" :alt="novel.title">
        <span v-else class="block w-full aspect-[2/3] rounded-lg bg-[#E6E7EE] border border-[#E2E4EC]"></span>
      </RouterLink>
      <div class="flex-1 basis-[240px] min-w-[200px]">
        <h3 class="font-sora text-[17px] font-semibold leading-tight">{{ chapter.title }}</h3>
        <p v-if="novel.resume" class="font-newsreader text-[18px] leading-relaxed text-[#3A4260] mt-2 line-clamp-3">{{ novel.resume }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2.5 mt-4 pt-3.5 border-t border-[#EEEFF4] flex-wrap">
      <span class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E4EC] text-sm font-semibold text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]">
        <iconify-icon icon="tabler:heart" class="text-[18px] text-[#B4741A]"></iconify-icon>{{ novel.likesCount }}
      </span>
      <span class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E4EC] text-sm font-semibold text-[#333B54] hover:border-[#3138B0] hover:text-[#3138B0]">
        <iconify-icon icon="tabler:message-circle" class="text-[18px]"></iconify-icon>{{ novel.commentsCount }} commentaires
      </span>
      <div class="flex-1"></div>
      <RouterLink v-if="unlocked" :to="chapterLink" class="px-4 py-2 rounded-lg bg-[#3138B0] text-white text-sm font-semibold hover:bg-[#232878]">
        <span class="flex items-center gap-1.5"><iconify-icon icon="tabler:book-2" class="text-[17px]"></iconify-icon>Lire maintenant</span>
      </RouterLink>
      <RouterLink v-else :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="px-4 py-2 rounded-lg bg-[#101323] text-white text-sm font-semibold hover:bg-[#262B45]">
        <span class="flex items-center gap-1.5"><iconify-icon icon="tabler:lock-open" class="text-[17px]"></iconify-icon>Débloquer</span>
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const props = defineProps({
  chapter: {
    type: Object,
    required: true,
  },
});

const novel = computed(() => props.chapter.novel);
const unlocked = computed(() => props.chapter.unlocked ?? true);
const categories = computed(() => (novel.value.categories ?? []).map((c) => c.name).join(' · '));
const authorInitials = computed(() => {
  const a = novel.value.author;
  return (a.name?.slice(0, 1) ?? '').toUpperCase() + (a.lastname?.slice(0, 1) ?? '').toUpperCase();
});
const authorLink = computed(() => ({ name: 'author', params: { id: novel.value.author.id } }));
const chapterLink = computed(() => ({
  name: 'read_page',
  params: { slug: novel.value.slug, chapter_id: props.chapter.id },
}));
</script>
