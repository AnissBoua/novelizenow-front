<template>
  <section class="bg-[#FFFCF6] border-b border-[#EADFCB]">
    <div class="max-w-[1340px] mx-auto px-4 sm:px-6 py-10 flex flex-wrap gap-10 items-center">
      <div class="flex-none basis-[230px] min-w-[160px]">
        <img
          v-if="novel.cover"
          class="block aspect-[2/3] w-full rounded-xl object-cover border border-[#EADFCB] shadow-lg"
          :src="BACK_URL + novel.cover.filepath"
          :alt="novel.title"
        >
        <span v-else class="block aspect-[2/3] rounded-xl bg-[#F0EBE0] border border-[#EADFCB]"></span>
      </div>
      <div class="flex-1 basis-[480px] min-w-[300px]">
        <span class="flex items-center gap-2 font-plexmono text-xs tracking-wider uppercase text-[#7A5313]">
          <iconify-icon icon="tabler:star" class="text-[15px]"></iconify-icon>Chapitre du jour<template v-if="category"> · {{ category }}</template>
        </span>
        <h1 class="font-newsreader italic text-[clamp(24px,2.6vw,32px)] leading-tight text-[#101323] mt-4 max-w-[40ch]">{{ chapter.title }}</h1>
        <p v-if="novel.resume" class="text-[#3A4260] text-[15px] leading-relaxed mt-3 max-w-[52ch] line-clamp-3">{{ novel.resume }}</p>
        <div class="flex items-center gap-2.5 mt-4">
          <span class="flex-none w-[34px] h-[34px] rounded-full bg-[#F7E3C2] flex items-center justify-center font-sora text-xs font-semibold text-[#7A5313]">{{ authorInitials }}</span>
          <span class="text-[15px] text-[#3A4260]">
            <RouterLink :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="font-semibold text-[#101323] hover:text-[#232878]">{{ novel.title }}</RouterLink>
            par <span class="font-semibold text-[#3138B0]">{{ novel.author.name }} {{ novel.author.lastname }}</span>
          </span>
        </div>
        <div class="flex flex-wrap gap-2.5 mt-6">
          <RouterLink :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="px-5 py-3 rounded-lg bg-[#101323] text-white text-[15px] font-semibold hover:bg-[#262B45]">
            <span class="flex items-center gap-2"><iconify-icon icon="tabler:book-2" class="text-[18px]"></iconify-icon>Découvrir ce roman</span>
          </RouterLink>
          <a href="#nouveautes" class="px-5 py-3 rounded-lg border border-[#EADFCB] bg-white text-[15px] font-semibold text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]">Parcourir le fil</a>
        </div>
      </div>
    </div>
  </section>
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
const category = computed(() => novel.value.categories?.[0]?.name ?? '');
const authorInitials = computed(() => {
  const a = novel.value.author;
  return (a.name?.slice(0, 1) ?? '').toUpperCase() + (a.lastname?.slice(0, 1) ?? '').toUpperCase();
});
</script>
