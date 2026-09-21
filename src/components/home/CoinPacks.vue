<template>
  <section v-if="offers.length" class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
    <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
      <iconify-icon icon="tabler:coins" class="text-[19px] text-[#B4741A]"></iconify-icon>Pièces
    </h2>
    <p class="text-sm leading-relaxed text-[#555D75] mt-2">Un seul solde pour tout le catalogue. Pas d'abonnement, rien n'expire.</p>
    <div class="flex flex-col gap-2 mt-3.5">
      <RouterLink v-for="offer in offers" :key="offer.id" :to="{name: 'shop_coins'}" class="flex items-center gap-3 px-3.5 py-3 rounded-lg border border-[#E2E4EC] hover:border-[#3138B0]">
        <iconify-icon icon="tabler:coin" class="text-[22px] text-[#B4741A] flex-none"></iconify-icon>
        <span class="flex-1 min-w-0">
          <span class="block font-sora text-[16px] font-semibold">{{ offer.coins }} pièces</span>
          <span class="block text-[13px] text-[#555D75] mt-0.5">{{ offer.name }}</span>
        </span>
        <span class="flex-none text-[15px] font-semibold">{{ offer.price.toFixed(2) }} €</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const offers = ref([]);

axios.get('/offer/')
  .then((res) => {
    offers.value = res.data;
  })
  .catch((err) => {
    console.error(err);
  });
</script>
