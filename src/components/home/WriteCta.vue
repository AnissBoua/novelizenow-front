<template>
  <section class="bg-[#3138B0] rounded-2xl p-5 text-white">
    <h2 class="font-sora text-lg font-semibold">Publiez un chapitre ce soir</h2>
    <p class="font-newsreader text-[16px] leading-relaxed text-[#DCDEF7] mt-2.5">Écrivez dans l'éditeur, fixez le prix de votre roman en pièces, gardez la main sur vos chapitres en cours.</p>
    <RouterLink :to="destination" class="block text-center mt-4 px-4 py-2.5 rounded-lg bg-[#E9A23B] text-[#2A1B05] text-[15px] font-semibold hover:bg-[#F2B558]">
      Commencer à écrire
    </RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/stores/auth.js';

const { token } = storeToRefs(useAuth());

const destination = computed(() => (token.value ? { name: 'author_novel' } : { name: 'register' }));
</script>
