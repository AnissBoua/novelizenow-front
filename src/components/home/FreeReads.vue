<template>
  <section v-if="novels.length" class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
    <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
      <iconify-icon icon="tabler:gift" class="text-[19px] text-[#B4741A]"></iconify-icon>Commencez sans payer
    </h2>
    <div class="flex flex-col mt-1.5">
      <RouterLink v-for="novel in novels" :key="novel.id" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="flex items-center gap-3 py-2.5 border-b border-[#EEEFF4] last:border-b-0 text-[#101323] hover:text-[#3138B0]">
        <span class="flex-1 min-w-0">
          <span class="block font-newsreader text-[17px] font-medium truncate">{{ novel.title }}</span>
          <span class="block text-xs text-[#555D75] mt-0.5 truncate">{{ meta(novel) }}</span>
        </span>
        <span class="flex-none text-xs font-semibold text-[#7A5313] bg-[#FBEEDA] px-2 py-1 rounded-md">{{ freeLabel }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
  novels: {
    type: Array,
    default: () => [],
  },
});

const novels = computed(() => props.novels.slice(0, 4));

const FREE_CHAPTERS_PER_NOVEL = 1;
const freeLabel = `${FREE_CHAPTERS_PER_NOVEL} gratuit${FREE_CHAPTERS_PER_NOVEL > 1 ? 's' : ''}`;

function meta(novel) {
  const category = novel.categories?.[0]?.name ?? '';
  const author = novel.author ? `${novel.author.name} ${novel.author.lastname}` : '';
  return [category, author].filter(Boolean).join(' · ');
}
</script>
