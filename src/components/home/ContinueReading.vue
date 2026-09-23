<template>
  <section v-if="entries.length" class="bg-white border border-[#E2E4EC] rounded-2xl p-4">
    <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
      <iconify-icon icon="tabler:book-2" class="text-[19px] text-[#3138B0]"></iconify-icon>Reprendre la lecture
    </h2>
    <div class="grid gap-3.5 mt-3.5" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      <RouterLink
        v-for="entry in entries"
        :key="entry.novel.id"
        :to="{name: 'read_page', params: {slug: entry.novel.slug, chapter_id: entry.chapterId}}"
        class="flex gap-3 text-[#101323] hover:text-[#3138B0]"
      >
        <div class="w-[38px] aspect-[2/3] flex-none rounded overflow-hidden border border-[#E2E4EC] bg-[#E6E7EE]">
          <img v-if="entry.novel.cover" class="w-full h-full object-cover" :src="BACK_URL + entry.novel.cover.filepath" :alt="entry.novel.title">
        </div>
        <span class="min-w-0">
          <span class="block font-newsreader text-[17px] font-medium leading-tight line-clamp-2 min-h-[44px]">{{ entry.novel.title }}</span>
          <span class="block text-xs text-[#555D75] mt-0.5">Chapitre {{ entry.chapterIndex + 1 }} · {{ entry.chapterTitle }}</span>
          <span class="block h-1 rounded-full bg-[#E6E7EE] mt-2">
            <span class="block h-1 rounded-full bg-[#E9A23B]" :style="{ width: percent(entry) + '%' }"></span>
          </span>
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const entries = ref([]);

axios.get('/reading-progress/me', { params: { limit: 3 } }).then((res) => {
  entries.value = res.data;
}).catch((err) => console.error(err));

function percent(entry) {
  if (!entry.totalChapters) return 0;
  return Math.round(((entry.chapterIndex + 1) / entry.totalChapters) * 100);
}
</script>
