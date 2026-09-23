<template>
  <section v-if="authors.length" class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
    <h2 class="flex items-center gap-2 font-sora text-base font-semibold mb-3">
      <iconify-icon icon="tabler:users" class="text-[19px] text-[#3138B0]"></iconify-icon>Auteurs à découvrir
    </h2>
    <div class="flex flex-col gap-3">
      <div v-for="entry in authors" :key="entry.author.id" class="flex items-center gap-2.5">
        <RouterLink :to="{name: 'author', params: {id: entry.author.id}}" class="flex items-center gap-2.5 flex-1 min-w-0 hover:text-[#3138B0]">
          <img v-if="entry.author.avatar" class="w-9 h-9 rounded-full object-cover flex-none" :src="BACK_URL + entry.author.avatar.filepath" alt="">
          <span v-else class="flex-none w-9 h-9 rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-xs font-semibold text-[#3138B0]">{{ initials(entry.author) }}</span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-[#101323]">{{ entry.author.name }} {{ entry.author.lastname }}</span>
            <span class="block text-xs text-[#555D75]">{{ entry.author.novelCount }} {{ entry.author.novelCount > 1 ? 'romans' : 'roman' }}</span>
          </span>
        </RouterLink>
        <button
          type="button"
          class="flex-none px-2.5 py-1.5 rounded-full border text-xs font-semibold"
          :class="entry.author.isFollowing ? 'border-[#3138B0] bg-[#E9EAF7] text-[#3138B0]' : 'border-[#DCDEE8] bg-white text-[#555D75]'"
          @click="toggleFollow(entry.author)"
        >{{ entry.author.isFollowing ? 'Suivi' : 'Suivre' }}</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useAuth } from '@/stores/auth.js';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const router = useRouter();
const { token } = storeToRefs(useAuth());

const props = defineProps({
  novels: {
    type: Array,
    default: () => [],
  },
});

function initials(author) {
  return (author.name?.slice(0, 1) ?? '').toUpperCase() + (author.lastname?.slice(0, 1) ?? '').toUpperCase();
}

function toggleFollow(author) {
  if (!token.value) {
    router.push({ name: 'login' });
    return;
  }
  axios.post(`follow/${author.id}`).then((res) => {
    author.isFollowing = res.data.following;
  });
}

const authors = computed(() => {
  const seen = new Set();
  const result = [];
  for (const novel of props.novels) {
    if (!novel.author || seen.has(novel.author.id)) continue;
    seen.add(novel.author.id);
    result.push({ author: novel.author, novel });
    if (result.length >= 4) break;
  }
  return result;
});
</script>
