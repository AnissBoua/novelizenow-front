<template>
  <footer class="bg-white border-t border-[#E2E4EC] font-figtree text-[#101323]">
    <div class="max-w-[1340px] mx-auto px-4 sm:px-6 py-10 flex flex-wrap gap-9">
      <div class="flex-1 basis-60 min-w-[220px]">
        <RouterLink to="/" class="flex items-center gap-2">
          <img class="h-6 w-auto rounded-md" src="@/assets/logos/novelizelogo.svg" alt="logo">
        </RouterLink>
        <p class="text-sm text-[#555D75] leading-relaxed mt-3 max-w-[32ch]">La maison des romans publiés chapitre par chapitre, et de ceux qui les écrivent.</p>
      </div>

      <div class="flex-[2] basis-[460px] min-w-[240px] grid gap-7" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
        <div>
          <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Lire</div>
          <div class="flex flex-col gap-2 mt-3">
            <RouterLink to="/" class="text-sm text-[#3A4260] hover:text-[#3138B0]">Le fil</RouterLink>
            <RouterLink :to="{path: '/', hash: '#categories'}" class="text-sm text-[#3A4260] hover:text-[#3138B0]">Catégories</RouterLink>
            <RouterLink :to="{path: '/', hash: '#nouveautes'}" class="text-sm text-[#3A4260] hover:text-[#3138B0]">Nouveautés</RouterLink>
          </div>
        </div>
        <div>
          <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Écrire</div>
          <div class="flex flex-col gap-2 mt-3">
            <RouterLink :to="{name: 'author_novel'}" class="text-sm text-[#3A4260] hover:text-[#3138B0]">Commencer un roman</RouterLink>
          </div>
        </div>
        <div>
          <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Compte</div>
          <div class="flex flex-col gap-2 mt-3">
            <RouterLink :to="{name: 'shop_coins'}" class="text-sm text-[#3A4260] hover:text-[#3138B0]">Acheter des pièces</RouterLink>
            <RouterLink :to="{name: 'account'}" class="text-sm text-[#3A4260] hover:text-[#3138B0]">Mon compte</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1340px] mx-auto px-4 sm:px-6 py-4 border-t border-[#EEEFF4] flex flex-wrap gap-4 justify-between items-center text-[13px] text-[#6B7286]">
      <span>© 2026 NovelizeNow</span>
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span>Hugo Tran</span>
          <a href="https://github.com/Tran-Hugo" class="hover:text-[#3138B0]"><i class="fa-brands fa-github"></i></a>
          <a href="https://www.linkedin.com/in/hugo-tran-202569233/" class="hover:text-[#3138B0]"><i class="fa-brands fa-linkedin"></i></a>
        </div>
        <span class="hidden sm:inline">|</span>
        <div class="flex items-center gap-2">
          <span>Anisse Bouainbi</span>
          <a href="https://github.com/AnissBoua" class="hover:text-[#3138B0]"><i class="fa-brands fa-github"></i></a>
          <a href="https://www.linkedin.com/in/anisse-bouainbi/" class="hover:text-[#3138B0]"><i class="fa-brands fa-linkedin"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
