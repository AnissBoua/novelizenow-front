<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <main class="max-w-[1100px] mx-auto px-4 sm:px-6 py-11 pb-24">

      <div class="flex flex-wrap items-end gap-7">
        <div class="flex-1 basis-[420px] min-w-[260px]">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Pièces</span>
          <h1 class="font-sora text-[clamp(30px,4.2vw,44px)] font-semibold tracking-[-0.03em] leading-[1.1] mt-3">Achetez des pièces, débloquez vos romans.</h1>
          <p class="text-[17px] leading-relaxed text-[#555D75] mt-3.5 max-w-[54ch]">Chaque roman a un prix fixé par son auteur et réglé une seule fois avec vos pièces. Le premier chapitre de chaque roman est toujours gratuit. Les pièces n'expirent jamais.</p>
        </div>

        <div v-if="token" class="flex-none basis-[280px] min-w-[240px] bg-white border border-[#E2E4EC] rounded-2xl p-5">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Votre solde</span>
          <div class="flex items-baseline gap-2.5 mt-3">
            <iconify-icon icon="tabler:coin" class="text-[26px] text-[#B4741A]"></iconify-icon>
            <span class="font-sora text-[34px] font-semibold tracking-[-0.03em]">{{ fmt(coins ?? 0) }}</span>
            <span class="text-[15px] font-semibold text-[#7A5313]">pièces</span>
          </div>
          <button type="button" class="block w-full text-left mt-3.5 pt-3.5 border-t border-[#EDEFF4] text-sm font-semibold text-[#3138B0] hover:text-[#232878]" @click="showHistory = true; scrollToHistory()">Historique des achats</button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3.5 mt-10">
        <h2 class="font-sora text-lg font-semibold">Packs de pièces</h2>
        <span class="text-sm text-[#6B7286]">Paiement unique, pièces créditées immédiatement.</span>
      </div>

      <div class="grid gap-4 mt-5" style="grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));">
          <button
            v-for="offer in offers"
            :key="offer.id"
            type="button"
            class="text-left flex flex-col p-5 rounded-2xl border"
            :class="selectedOfferId === offer.id ? 'border-[#E9A23B] bg-[#FFFBF4] shadow-[0_10px_28px_rgba(185,125,25,0.16)]' : 'border-[#E2E4EC] bg-white'"
            @click="selectedOfferId = offer.id"
          >
            <span class="flex items-center justify-between gap-2.5 min-h-[22px]">
              <span class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">{{ offer.name }}</span>
              <span v-if="bestValueId === offer.id" class="px-2.5 py-0.5 rounded-full bg-[#E9EAF7] text-[#3138B0] text-[11px] font-semibold">Meilleur tarif</span>
            </span>
            <span class="flex items-baseline gap-2 mt-4">
              <iconify-icon icon="tabler:coins" class="text-[22px] text-[#B4741A]"></iconify-icon>
              <span class="font-sora text-[32px] font-semibold tracking-[-0.03em] leading-none">{{ fmt(offer.coins) }}</span>
            </span>
            <span class="block h-px bg-[#EDEFF4] my-4"></span>
            <span class="flex items-baseline gap-2">
              <span class="font-sora text-[22px] font-semibold tracking-[-0.02em]">{{ offer.price.toFixed(2) }} €</span>
              <span class="font-plexmono text-xs text-[#6B7286]">{{ unitPrice(offer) }} €/pièce</span>
            </span>
            <span class="flex items-center gap-1.5 justify-center mt-5 py-2.5 rounded-lg text-sm font-semibold" :class="selectedOfferId === offer.id ? 'bg-[#E9A23B] text-[#2A1B05]' : 'bg-[#F3F4F8] text-[#555D75]'">
              <iconify-icon :icon="selectedOfferId === offer.id ? 'tabler:check' : 'tabler:circle'" class="text-[17px]"></iconify-icon>{{ selectedOfferId === offer.id ? 'Sélectionné' : 'Choisir' }}
            </span>
          </button>
        </div>

        <div v-if="selectedOffer" class="flex flex-wrap items-center gap-4 mt-6 px-6 py-5 rounded-2xl bg-white border border-[#E2E4EC]">
          <div class="flex-1 basis-[320px] min-w-[240px]">
            <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Votre sélection</span>
            <div class="font-sora text-[19px] font-semibold tracking-[-0.02em] mt-2">Pack {{ selectedOffer.name }} · {{ fmt(selectedOffer.coins) }} pièces pour {{ selectedOffer.price.toFixed(2) }} €</div>
            <span class="block text-sm text-[#555D75] mt-1.5">{{ token ? `Nouveau solde après achat : ${fmt((coins ?? 0) + selectedOffer.coins)} pièces.` : 'Connectez-vous pour acheter des pièces.' }}</span>
          </div>
          <div class="flex-none flex flex-wrap items-center gap-3">
            <span class="flex items-center gap-2 text-[13px] text-[#868DA3]">
              <iconify-icon icon="tabler:credit-card" class="text-[20px] text-[#555D75]"></iconify-icon>
            </span>
            <RouterLink v-if="!token" :to="{name: 'login'}" class="px-6 py-3.5 rounded-lg border-0 bg-[#E9A23B] text-[#2A1B05] text-base font-semibold hover:bg-[#DE9526]">
              <span class="flex items-center gap-2"><iconify-icon icon="tabler:lock" class="text-[18px]"></iconify-icon>Se connecter pour payer</span>
            </RouterLink>
            <button v-else type="button" class="px-6 py-3.5 rounded-lg border-0 bg-[#E9A23B] text-[#2A1B05] text-base font-semibold hover:bg-[#DE9526] disabled:opacity-60" :disabled="checkingOut" @click="checkout">
              <span class="flex items-center gap-2"><iconify-icon icon="tabler:lock" class="text-[18px]"></iconify-icon>{{ checkingOut ? 'Redirection…' : `Payer ${selectedOffer.price.toFixed(2)} €` }}</span>
            </button>
          </div>
        </div>

      <section class="grid gap-4 mt-11" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <div class="p-5 rounded-2xl bg-white border border-[#E2E4EC]">
          <iconify-icon icon="tabler:infinity" class="text-[22px] text-[#3138B0]"></iconify-icon>
          <div class="font-sora text-[15px] font-semibold mt-3">Pièces sans expiration</div>
          <p class="text-sm leading-relaxed text-[#555D75] mt-1.5">Votre solde reste acquis, quel que soit le temps entre deux lectures.</p>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-[#E2E4EC]">
          <iconify-icon icon="tabler:users" class="text-[22px] text-[#3138B0]"></iconify-icon>
          <div class="font-sora text-[15px] font-semibold mt-3">100 % pour l'auteur</div>
          <p class="text-sm leading-relaxed text-[#555D75] mt-1.5">Quand vous débloquez un roman, la totalité du prix est créditée au compte de son auteur.</p>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-[#E2E4EC]">
          <iconify-icon icon="tabler:shield-lock" class="text-[22px] text-[#3138B0]"></iconify-icon>
          <div class="font-sora text-[15px] font-semibold mt-3">Paiement sécurisé</div>
          <p class="text-sm leading-relaxed text-[#555D75] mt-1.5">Par carte via Stripe. Aucune donnée bancaire stockée chez nous.</p>
        </div>
      </section>

      <section class="mt-11 bg-white border border-[#E2E4EC] rounded-2xl px-6">
        <div v-for="(f, i) in faq" :key="f.q" class="border-b border-[#EDEFF4] last:border-b-0">
          <button type="button" class="w-full flex items-center justify-between gap-4 py-5 border-0 bg-none text-left font-sora text-[16px] font-semibold tracking-[-0.01em]" @click="openFaq = openFaq === i ? -1 : i">
            {{ f.q }}
            <iconify-icon :icon="openFaq === i ? 'tabler:minus' : 'tabler:plus'" class="text-[20px] text-[#868DA3] flex-none"></iconify-icon>
          </button>
          <p v-if="openFaq === i" class="text-[15px] leading-relaxed text-[#555D75] m-0 pb-5 pr-10 max-w-[72ch]">{{ f.a }}</p>
        </div>
      </section>

      <section v-if="token" id="historique" class="mt-11">
        <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
          <iconify-icon icon="tabler:receipt" class="text-[19px] text-[#3138B0]"></iconify-icon>Historique des achats
        </h2>
        <div class="mt-3 bg-white border border-[#E2E4EC] rounded-2xl">
          <div v-if="!transactions.length" class="text-center text-[#6B7286] py-8">Aucun achat pour le moment.</div>
          <div v-for="t in transactions" :key="t.id" class="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#EEEFF4] last:border-b-0">
            <div>
              <div class="font-semibold">Pack {{ t.offer.name }}</div>
              <div class="text-sm text-[#6B7286] mt-0.5">{{ formatDate(t.dateTransaction) }}</div>
            </div>
            <div class="text-right">
              <div class="font-semibold">{{ t.total.toFixed(2) }} €</div>
              <div class="text-sm text-[#7A5313] mt-0.5">+{{ fmt(t.coins) }} pièces</div>
            </div>
          </div>
        </div>
      </section>

      <p class="text-[13px] leading-relaxed text-[#6B7286] mt-6 max-w-[78ch]">Les pièces sont un moyen de paiement interne à NovelizeNow, sans valeur monétaire hors de la plateforme et non remboursables en espèces. Prix TTC. En achetant, vous acceptez les conditions de vente.</p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useAuth } from '@/stores/auth.js';
import { useStripe } from '@/stores/stripe.js';

const authStore = useAuth();
const { token, coins } = storeToRefs(authStore);
const stripeStore = useStripe();

const offers = ref([]);
const selectedOfferId = ref(null);
const checkingOut = ref(false);
const openFaq = ref(-1);
const transactions = ref([]);
const showHistory = ref(false);

axios.get('/offer/').then((res) => {
  offers.value = res.data;
  if (offers.value.length) selectedOfferId.value = offers.value[1]?.id ?? offers.value[0].id;
});

if (token.value) {
  axios.get('/transaction/me').then((res) => {
    transactions.value = res.data;
  }).catch((err) => console.error(err));
}

const selectedOffer = computed(() => offers.value.find((o) => o.id === selectedOfferId.value) ?? null);

const bestValueId = computed(() => {
  if (!offers.value.length) return null;
  return offers.value.reduce((best, o) => (o.price / o.coins < best.price / best.coins ? o : best)).id;
});

function fmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function unitPrice(offer) {
  return (offer.price / offer.coins).toFixed(3);
}

function formatDate(value) {
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function scrollToHistory() {
  setTimeout(() => document.getElementById('historique')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

function checkout() {
  if (!selectedOffer.value) return;
  checkingOut.value = true;
  stripeStore.initCheckout(selectedOffer.value.id);
}

const faq = [
  { q: "Comment fonctionne le prix d'un roman ?", a: "Chaque auteur fixe le prix de son roman en pièces. Le premier chapitre est toujours gratuit ; le reste du roman se débloque en une seule fois pour ce prix, sans limite de lecture ensuite." },
  { q: 'Est-ce que mes pièces expirent ?', a: 'Non. Les pièces restent sur votre solde sans limite de durée, y compris si vous ne lisez rien pendant plusieurs mois.' },
  { q: 'Que reçoit l\'auteur ?', a: "La totalité du prix affiché sur le roman est créditée au compte de son auteur au moment de l'achat." },
];
</script>
