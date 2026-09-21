<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <main class="max-w-[640px] mx-auto px-4 sm:px-6 py-14 pb-24">

      <div class="flex items-center gap-4">
        <span class="flex-none w-[52px] h-[52px] rounded-full bg-[#E7E9F1] flex items-center justify-center">
          <iconify-icon icon="tabler:x" class="text-[26px] text-[#555D75]"></iconify-icon>
        </span>
        <div>
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Paiement annulé</span>
          <h1 class="font-sora text-[clamp(26px,4vw,34px)] font-semibold tracking-[-0.03em] leading-[1.15] mt-1.5">Aucun montant n'a été prélevé.</h1>
        </div>
      </div>

      <p class="text-[17px] leading-relaxed text-[#555D75] mt-4 max-w-[54ch]">{{ coins != null ? `Votre solde reste de ${fmt(coins)} pièces.` : '' }} Vous pouvez reprendre le paiement quand vous voulez.</p>

      <div v-if="transaction" class="mt-7 bg-white border border-[#E2E4EC] rounded-2xl p-6">
        <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Votre sélection</span>
        <div class="flex flex-wrap items-end gap-4 mt-3">
          <div class="flex-1 basis-[200px] min-w-[180px]">
            <div class="font-sora text-[19px] font-semibold tracking-[-0.02em]">Pack {{ transaction.offerName }} · {{ fmt(transaction.coins) }} pièces</div>
          </div>
          <span class="flex-none font-sora text-2xl font-semibold tracking-[-0.02em]">{{ transaction.total.toFixed(2) }} €</span>
        </div>

        <div class="flex flex-wrap gap-3 mt-5">
          <RouterLink :to="{name: 'shop_coins'}" class="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#E9A23B] text-[#2A1B05] text-[15px] font-semibold hover:bg-[#DE9526]">
            <iconify-icon icon="tabler:lock" class="text-[18px]"></iconify-icon>Reprendre le paiement
          </RouterLink>
          <RouterLink :to="{name: 'shop_coins'}" class="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#F3F4F8] border border-[#D8DBE6] text-[#101323] text-[15px] font-semibold hover:bg-[#EDEFF4]">Choisir un autre pack</RouterLink>
        </div>
      </div>
      <div v-else class="mt-7">
        <RouterLink :to="{name: 'shop_coins'}" class="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#E9A23B] text-[#2A1B05] text-[15px] font-semibold hover:bg-[#DE9526]">
          <iconify-icon icon="tabler:coins" class="text-[18px]"></iconify-icon>Voir les packs de pièces
        </RouterLink>
      </div>

      <div class="mt-4 bg-white border border-[#E2E4EC] rounded-2xl p-6">
        <div class="font-sora text-base font-semibold">Le paiement a échoué sans que vous l'annuliez ?</div>
        <ul class="list-none m-0 mt-3.5 p-0 flex flex-col gap-2.5">
          <li v-for="r in reasons" :key="r.text" class="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#2B3148]">
            <iconify-icon :icon="r.icon" class="text-[18px] text-[#3138B0] flex-none mt-0.5"></iconify-icon>{{ r.text }}
          </li>
        </ul>
      </div>

      <p class="text-[13px] leading-relaxed text-[#6B7286] mt-7 max-w-[72ch]">Le premier chapitre de chaque roman reste gratuit, sans achat de pièces.</p>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useAuth } from '@/stores/auth.js';

const route = useRoute();
const { coins } = storeToRefs(useAuth());

const transaction = ref(null);

function fmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const sessionId = route.query.session_id;
if (sessionId) {
  axios.get(`stripe/session/${sessionId}`).then((res) => {
    transaction.value = res.data;
  }).catch(() => {
    transaction.value = null;
  });
}

const reasons = [
  { icon: 'tabler:credit-card-off', text: 'Carte refusée ou plafond de paiement atteint.' },
  { icon: 'tabler:shield-lock', text: 'Validation 3-D Secure interrompue par la banque.' },
  { icon: 'tabler:wifi-off', text: 'Connexion perdue pendant la redirection vers le paiement.' },
];
</script>
