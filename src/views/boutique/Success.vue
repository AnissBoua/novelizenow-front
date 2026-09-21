<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <main class="max-w-[640px] mx-auto px-4 sm:px-6 py-14 pb-24">

      <div v-if="loading" class="flex items-center justify-center py-20">
        <iconify-icon icon="tabler:loader-2" class="text-[28px] text-[#3138B0] animate-spin"></iconify-icon>
      </div>

      <div v-else-if="transaction && transaction.status === 'completed'">
        <div class="flex items-center gap-4">
          <span class="flex-none w-[52px] h-[52px] rounded-full bg-[#FBEEDA] flex items-center justify-center">
            <iconify-icon icon="tabler:check" class="text-[28px] text-[#B4741A]"></iconify-icon>
          </span>
          <div>
            <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Paiement confirmé</span>
            <h1 class="font-sora text-[clamp(26px,4vw,34px)] font-semibold tracking-[-0.03em] leading-[1.15] mt-1.5">{{ fmt(transaction.coins) }} pièces créditées.</h1>
          </div>
        </div>

        <div class="mt-7 bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 basis-[200px] min-w-[180px]">
              <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Nouveau solde</span>
              <div class="flex items-baseline gap-2 mt-2.5">
                <iconify-icon icon="tabler:coin" class="text-[26px] text-[#B4741A]"></iconify-icon>
                <span class="font-sora text-[36px] font-semibold tracking-[-0.03em] leading-none">{{ fmt(transaction.balance) }}</span>
                <span class="text-[15px] font-semibold text-[#7A5313]">pièces</span>
              </div>
            </div>
            <div class="flex-none text-sm text-[#6B7286] leading-relaxed">
              <div>Solde avant achat : {{ fmt(transaction.balance - transaction.coins) }}</div>
              <div class="text-[#B4741A] font-semibold">+ {{ fmt(transaction.coins) }} pièces</div>
            </div>
          </div>

          <div class="h-px bg-[#EDEFF4] my-5"></div>

          <dl class="grid gap-4 sm:gap-6" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Pack</dt>
              <dd class="mt-1.5 text-[15px] font-semibold">Pack {{ transaction.offerName }} · {{ fmt(transaction.coins) }} pièces</dd>
            </div>
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Montant</dt>
              <dd class="mt-1.5 text-[15px] font-semibold">{{ transaction.total.toFixed(2) }} €</dd>
            </div>
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Commande</dt>
              <dd class="mt-1.5 font-plexmono text-sm text-[#2B3148]">#{{ transaction.id }}</dd>
            </div>
          </dl>

          <p class="text-sm leading-relaxed text-[#6B7286] mt-5">Retrouvez cet achat dans <RouterLink :to="{name: 'shop_coins', hash: '#historique'}" class="font-semibold text-[#3138B0] hover:text-[#232878]">l'historique des achats</RouterLink>.</p>
        </div>

        <div class="flex flex-wrap gap-3 mt-4">
          <RouterLink to="/" class="flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#D8DBE6] text-[#101323] text-[15px] font-semibold hover:border-[#B9BECD]">
            <iconify-icon icon="tabler:home" class="text-[18px] text-[#555D75]"></iconify-icon>Retour à l'accueil
          </RouterLink>
          <RouterLink :to="{name: 'shop_coins'}" class="flex items-center gap-2 px-5 py-3 rounded-lg text-[#555D75] text-[15px] font-semibold hover:text-[#101323]">Acheter d'autres pièces</RouterLink>
        </div>

        <p class="text-[13px] leading-relaxed text-[#6B7286] mt-7 max-w-[72ch]">Les pièces n'expirent pas et ne sont pas remboursables en espèces.</p>
      </div>

      <div v-else-if="transaction">
        <div class="flex items-center gap-4">
          <span class="flex-none w-[52px] h-[52px] rounded-full bg-[#E7E9F1] flex items-center justify-center">
            <iconify-icon icon="tabler:clock" class="text-[26px] text-[#555D75]"></iconify-icon>
          </span>
          <div>
            <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Paiement en cours de traitement</span>
            <h1 class="font-sora text-[clamp(24px,4vw,30px)] font-semibold tracking-[-0.03em] leading-[1.15] mt-1.5">Ça ne devrait plus être très long.</h1>
          </div>
        </div>
        <p class="text-[15px] leading-relaxed text-[#555D75] mt-4">Votre pack {{ transaction.offerName }} ({{ fmt(transaction.coins) }} pièces) est en cours de confirmation. Rechargez cette page dans un instant, ou consultez <RouterLink :to="{name: 'shop_coins', hash: '#historique'}" class="font-semibold text-[#3138B0] hover:text-[#232878]">l'historique des achats</RouterLink>.</p>
        <RouterLink to="/" class="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-lg bg-white border border-[#D8DBE6] text-[#101323] text-[15px] font-semibold hover:border-[#B9BECD]">
          <iconify-icon icon="tabler:home" class="text-[18px] text-[#555D75]"></iconify-icon>Retour à l'accueil
        </RouterLink>
      </div>

      <div v-else>
        <div class="flex items-center gap-4">
          <span class="flex-none w-[52px] h-[52px] rounded-full bg-[#FBEEDA] flex items-center justify-center">
            <iconify-icon icon="tabler:check" class="text-[28px] text-[#B4741A]"></iconify-icon>
          </span>
          <div>
            <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Paiement confirmé</span>
            <h1 class="font-sora text-[clamp(24px,4vw,30px)] font-semibold tracking-[-0.03em] leading-[1.15] mt-1.5">Merci pour votre achat.</h1>
          </div>
        </div>
        <p class="text-[15px] leading-relaxed text-[#555D75] mt-4">Vos pièces sont créditées sur votre compte. Vérifiez votre solde dans l'en-tête ou <RouterLink :to="{name: 'shop_coins', hash: '#historique'}" class="font-semibold text-[#3138B0] hover:text-[#232878]">l'historique des achats</RouterLink>.</p>
        <RouterLink to="/" class="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-lg bg-white border border-[#D8DBE6] text-[#101323] text-[15px] font-semibold hover:border-[#B9BECD]">
          <iconify-icon icon="tabler:home" class="text-[18px] text-[#555D75]"></iconify-icon>Retour à l'accueil
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import axios from 'axios';
import { useAuth } from '@/stores/auth.js';

const route = useRoute();
const authStore = useAuth();

const loading = ref(true);
const transaction = ref(null);
let pollTimer = null;
let attempts = 0;

function fmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

async function fetchSession() {
  const sessionId = route.query.session_id;
  if (!sessionId) {
    loading.value = false;
    return;
  }
  try {
    const res = await axios.get(`stripe/session/${sessionId}`);
    transaction.value = res.data;
    if (res.data.status === 'completed') {
      authStore.updateCoins();
    } else if (attempts < 6) {
      attempts++;
      pollTimer = setTimeout(fetchSession, 2000);
    }
  } catch (err) {
    transaction.value = null;
  } finally {
    loading.value = false;
  }
}

fetchSession();

onUnmounted(() => {
  if (pollTimer) clearTimeout(pollTimer);
});
</script>
