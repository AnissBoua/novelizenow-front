<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
    <main class="max-w-[1100px] mx-auto px-4 sm:px-6 py-11 pb-24" v-if="user">

      <div class="flex flex-wrap items-end gap-5">
        <div class="flex-1 basis-[320px] min-w-[260px]">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Mon compte</span>
          <h1 class="font-sora text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.03em] leading-[1.1] mt-2.5">{{ user.name }} {{ user.lastname }}</h1>
          <p class="text-[15px] text-[#555D75] mt-2">@{{ user.username }} · {{ user.email }}</p>
        </div>
        <button type="button" class="flex-none flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#D8DBE6] text-[#101323] text-[15px] font-semibold hover:border-[#B9BECD]" @click="logout">
          <iconify-icon icon="tabler:logout" class="text-[18px] text-[#555D75]"></iconify-icon>Se déconnecter
        </button>
      </div>

      <div class="flex flex-wrap gap-7 items-start mt-8">

        <aside class="flex-1 basis-[210px] min-w-[200px] max-w-[250px] flex flex-col gap-1">
          <button
            v-for="t in tabs"
            :key="t.key"
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[15px] font-semibold text-left border"
            :class="tab === t.key ? 'bg-white border-[#DCDEE8] text-[#101323]' : 'border-transparent text-[#555D75]'"
            @click="tab = t.key"
          >
            <iconify-icon :icon="t.icon" class="text-[19px] flex-none" :class="tab === t.key ? 'text-[#3138B0]' : 'text-[#868DA3]'"></iconify-icon>{{ t.label }}
          </button>
        </aside>

        <section class="flex-1 basis-[520px] min-w-[300px] flex flex-col gap-4">

          <template v-if="tab === 'Profil'">
            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <h2 class="font-sora text-xl font-semibold tracking-[-0.02em]">Profil public</h2>
              <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Ce que voient les autres lecteurs sous vos commentaires.</p>

              <div class="flex flex-wrap items-center gap-4 mt-5 p-4 border border-[#EDEFF4] rounded-xl bg-[#F8F9FC]">
                <img v-if="user.avatar" class="flex-none w-[60px] h-[60px] rounded-full object-cover" :src="BACK_URL + user.avatar.filepath" alt="">
                <span v-else class="flex-none w-[60px] h-[60px] rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-xl font-semibold text-[#3138B0]">{{ initials }}</span>
                <div class="flex-1 basis-[200px] min-w-[180px]">
                  <div class="text-[15px] font-semibold">Photo de profil</div>
                  <span class="block text-sm text-[#6B7286] mt-1">JPG ou PNG.</span>
                </div>
                <div class="flex-none">
                  <label class="px-4 py-2.5 rounded-lg border border-[#D8DBE6] bg-white text-sm font-semibold hover:border-[#B9BECD] cursor-pointer">
                    Téléverser
                    <input type="file" accept="image/*" class="hidden" @change="onAvatarChange">
                  </label>
                </div>
              </div>

              <div class="grid gap-4 mt-5" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
                <label class="block">
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Prénom</span>
                  <input v-model="profileForm.name" type="text" class="w-full mt-2 h-[44px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
                </label>
                <label class="block">
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Nom</span>
                  <input v-model="profileForm.lastname" type="text" class="w-full mt-2 h-[44px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
                </label>
              </div>
              <label class="block mt-4">
                <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Identifiant</span>
                <input v-model="profileForm.username" type="text" class="w-full mt-2 h-[44px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
              </label>
              <label class="block mt-4">
                <span class="flex justify-between gap-3 font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">
                  <span>Bio</span><span>{{ profileForm.bio.length }} / 280</span>
                </span>
                <textarea v-model="profileForm.bio" rows="3" maxlength="280" placeholder="Une phrase sur vous ou votre façon d'écrire, affichée sur vos romans." class="w-full mt-2 px-3.5 py-2.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px] leading-relaxed resize-y"></textarea>
              </label>

              <div v-if="profileError" class="text-sm text-[#6B0504] bg-[#FBEAEA] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5 mt-4">{{ profileError }}</div>
              <div v-if="profileSaved" class="text-sm text-[#3A6B1F] bg-[#EEF7E8] border border-[#CDE7BD] rounded-lg px-3.5 py-2.5 mt-4">Profil mis à jour.</div>

              <div class="flex flex-wrap items-center gap-3 mt-5">
                <button type="button" class="flex items-center gap-2 px-5 py-3 rounded-lg border-0 bg-[#3138B0] text-white text-[15px] font-semibold hover:bg-[#232878] disabled:opacity-60" :disabled="savingProfile" @click="saveProfile">{{ savingProfile ? 'Enregistrement…' : 'Enregistrer les modifications' }}</button>
                <button type="button" class="px-4 py-3 rounded-lg border-0 bg-transparent text-[#6B7286] text-[15px] font-semibold hover:text-[#101323]" @click="resetProfileForm">Annuler</button>
              </div>
            </div>

            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Activité</h2>
              <dl class="mt-4 grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
                <div>
                  <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Chapitres lus</dt>
                  <dd class="mt-2 font-sora text-2xl font-semibold tracking-[-0.02em]">{{ user.chaptersReadCount ?? 0 }}</dd>
                </div>
                <div>
                  <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Romans suivis</dt>
                  <dd class="mt-2 font-sora text-2xl font-semibold tracking-[-0.02em]">{{ user.followedNovelsCount ?? 0 }}</dd>
                </div>
                <div>
                  <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Commentaires</dt>
                  <dd class="mt-2 font-sora text-2xl font-semibold tracking-[-0.02em]">{{ user.commentsCount ?? 0 }}</dd>
                </div>
                <div>
                  <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Auteurs soutenus</dt>
                  <dd class="mt-2 font-sora text-2xl font-semibold tracking-[-0.02em]">{{ user.authorsSupportedCount ?? 0 }}</dd>
                </div>
              </dl>
            </div>
          </template>

          <template v-else-if="tab === 'Pièces'">
            <div class="bg-[#FFFBF4] border border-[#E9A23B] rounded-2xl p-6 shadow-[0_10px_28px_rgba(185,125,25,0.16)]">
              <div class="flex flex-wrap items-end gap-5">
                <div class="flex-1 basis-[220px] min-w-[200px]">
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313]">Solde</span>
                  <div class="flex items-baseline gap-2.5 mt-2.5">
                    <iconify-icon icon="tabler:coin" class="text-[28px] text-[#B4741A]"></iconify-icon>
                    <span class="font-sora text-[40px] font-semibold tracking-[-0.03em] leading-none">{{ coins ?? 0 }}</span>
                    <span class="text-[15px] font-semibold text-[#7A5313]">pièces</span>
                  </div>
                  <span class="block text-sm text-[#6B7286] mt-2.5">Les pièces n'expirent pas.</span>
                </div>
                <RouterLink :to="{name: 'shop_coins'}" class="flex-none flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#E9A23B] text-[#2A1B05] text-base font-semibold hover:bg-[#DE9526]">
                  <iconify-icon icon="tabler:plus" class="text-[18px]"></iconify-icon>Acheter des pièces
                </RouterLink>
              </div>
            </div>

            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Historique</h2>
              <div v-if="!transactions.length" class="text-center text-[#6B7286] py-8">Aucun achat pour le moment.</div>
              <div class="flex flex-col mt-2">
                <div v-for="t in transactions" :key="t.id" class="flex flex-wrap items-center gap-3.5 py-3.5 border-b border-[#EDEFF4] last:border-b-0">
                  <iconify-icon icon="tabler:coin" class="text-[20px] text-[#B4741A] flex-none"></iconify-icon>
                  <div class="flex-1 basis-[200px] min-w-[180px]">
                    <div class="text-[15px] font-semibold">Pack {{ t.offer.name }}</div>
                    <span class="block font-plexmono text-xs text-[#6B7286] mt-1">{{ formatDate(t.dateTransaction) }} · {{ t.total.toFixed(2) }} €</span>
                  </div>
                  <span class="flex-none font-sora text-[16px] font-semibold text-[#B4741A]">+{{ t.coins }}</span>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="tab === 'Écrire'">
            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <div class="flex flex-wrap items-end gap-4">
                <div class="flex-1 basis-[260px] min-w-[240px]">
                  <h2 class="font-sora text-xl font-semibold tracking-[-0.02em]">Mes romans</h2>
                  <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Publiez chapitre par chapitre, à votre rythme, et fixez vous-même le prix du roman.</p>
                </div>
                <RouterLink :to="{name: 'author_novel'}" class="flex-none flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#3138B0] text-white text-base font-semibold hover:bg-[#232878]">
                  <iconify-icon icon="tabler:plus" class="text-[18px]"></iconify-icon>Commencer un roman
                </RouterLink>
              </div>

              <p v-if="userNovels && !userNovels.length" class="text-[#6B7286] mt-6">Vous n'avez pas encore de roman.</p>

              <div v-if="userNovels" class="flex flex-col gap-3 mt-6">
                <div v-for="entry in userNovels" :key="entry.novel.id" class="border border-[#EDEFF4] rounded-xl p-5 bg-[#F8F9FC]">
                  <div class="flex flex-wrap items-start gap-3.5">
                    <div class="flex-1 basis-[240px] min-w-[200px]">
                      <div class="flex flex-wrap items-center gap-2.5">
                        <RouterLink :to="{name: 'read_novel', params: {novel_slug: entry.novel.slug}}" class="font-sora text-[18px] font-semibold tracking-[-0.02em] text-[#101323] hover:text-[#3138B0]">{{ entry.novel.title }}</RouterLink>
                        <span class="px-2.5 py-1 rounded-full font-plexmono text-[11px] tracking-wider uppercase" :class="entry.novel.publishedAt ? 'bg-[#E9EAF7] text-[#3138B0]' : 'bg-[#EDEFF4] text-[#555D75]'">{{ entry.novel.publishedAt ? 'Publié' : 'Brouillon' }}</span>
                      </div>
                      <span class="block text-sm text-[#6B7286] mt-1.5">{{ entry.novel.quantiteChapitre }} {{ entry.novel.quantiteChapitre > 1 ? 'chapitres' : 'chapitre' }}</span>
                      <div class="flex flex-wrap gap-4 mt-2.5 text-sm text-[#555D75]">
                        <span class="flex items-center gap-1.5"><iconify-icon icon="tabler:heart" class="text-[16px] text-[#B4741A]"></iconify-icon>{{ entry.novel.likesCount }}</span>
                        <span class="flex items-center gap-1.5"><iconify-icon icon="tabler:message-circle" class="text-[16px] text-[#868DA3]"></iconify-icon>{{ entry.novel.commentsCount }}</span>
                        <span class="flex items-center gap-1.5"><iconify-icon icon="tabler:coin" class="text-[16px] text-[#B4741A]"></iconify-icon>{{ entry.novel.price }} pièces</span>
                      </div>
                    </div>
                    <div class="flex-none flex flex-wrap gap-2">
                      <RouterLink :to="{name: 'chapter_edit', params: {novel_id: entry.novel.id}}" class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E9A23B] text-[#2A1B05] text-sm font-semibold hover:bg-[#DE9526]">
                        <iconify-icon icon="tabler:pencil" class="text-[16px]"></iconify-icon>Nouveau chapitre
                      </RouterLink>
                      <RouterLink :to="{name: 'author_novel', params: {id: entry.novel.id}}" class="px-4 py-2.5 rounded-lg border border-[#D8DBE6] bg-white text-sm font-semibold hover:border-[#B9BECD]">Gérer</RouterLink>
                      <button type="button" class="px-4 py-2.5 rounded-lg border border-transparent text-sm font-semibold text-[#9B2C2C] hover:bg-[#FCF3F3]" @click="deletingNovelId = entry.novel.id">Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="tab === 'Lecture'">
            <div v-if="readingProgress && readingProgress.length" class="bg-white border border-[#E2E4EC] rounded-2xl p-6 mb-4">
              <h2 class="font-sora text-xl font-semibold tracking-[-0.02em]">Reprendre la lecture</h2>
              <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Les romans que vous avez commencés.</p>

              <div class="flex flex-col gap-3 mt-6">
                <RouterLink v-for="entry in readingProgress" :key="entry.novel.id" :to="{name: 'read_page', params: {slug: entry.novel.slug, chapter_id: entry.chapterId}}" class="flex flex-wrap items-center gap-3.5 border border-[#EDEFF4] rounded-xl p-5 bg-[#F8F9FC] hover:border-[#DCDEE8]">
                  <img v-if="entry.novel.cover" class="flex-none w-[52px] aspect-[2/3] object-cover rounded-md border border-[#E2E4EC]" :src="BACK_URL + entry.novel.cover.filepath" :alt="entry.novel.title">
                  <span v-else class="flex-none w-[52px] aspect-[2/3] rounded-md bg-[#E6E7EE] border border-[#E2E4EC] block"></span>
                  <div class="flex-1 basis-[200px] min-w-[180px]">
                    <span class="block font-sora text-[16px] font-semibold text-[#101323]">{{ entry.novel.title }}</span>
                    <span class="block text-sm text-[#6B7286] mt-1">Chapitre {{ entry.chapterIndex + 1 }} · {{ entry.chapterTitle }}</span>
                    <span class="block h-1.5 rounded-full bg-[#E6E7EE] mt-2.5 max-w-[220px]">
                      <span class="block h-1.5 rounded-full bg-[#E9A23B]" :style="{ width: progressPercent(entry) + '%' }"></span>
                    </span>
                  </div>
                  <span class="flex-none px-4 py-2.5 rounded-lg border border-[#D8DBE6] bg-white text-sm font-semibold text-[#3138B0]">Reprendre</span>
                </RouterLink>
              </div>
            </div>

            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <h2 class="font-sora text-xl font-semibold tracking-[-0.02em]">Confort de lecture</h2>
              <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Ces réglages s'appliquent à tous les chapitres.</p>

              <div class="flex flex-col gap-5 mt-6">
                <div>
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Taille du texte</span>
                  <div class="flex flex-wrap gap-1.5 mt-2.5 p-1 bg-[#F3F4F8] border border-[#E2E4EC] rounded-xl">
                    <button v-for="s in sizeOptions" :key="s.label" type="button" class="flex-1 min-w-[90px] px-3 py-2.5 rounded-lg text-[15px] font-semibold" :class="readerSize === s.value ? 'bg-white border border-[#DCDEE8] text-[#101323]' : 'border border-transparent text-[#555D75]'" @click="readerSize = s.value">{{ s.label }}</button>
                  </div>
                </div>
                <div>
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Police</span>
                  <div class="flex flex-wrap gap-1.5 mt-2.5 p-1 bg-[#F3F4F8] border border-[#E2E4EC] rounded-xl">
                    <button v-for="f in ['Newsreader', 'Figtree']" :key="f" type="button" class="flex-1 min-w-[90px] px-3 py-2.5 rounded-lg text-[15px] font-semibold" :class="readerFont === f ? 'bg-white border border-[#DCDEE8] text-[#101323]' : 'border border-transparent text-[#555D75]'" @click="readerFont = f">{{ f }}</button>
                  </div>
                </div>
                <div>
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Thème</span>
                  <div class="flex flex-wrap gap-1.5 mt-2.5 p-1 bg-[#F3F4F8] border border-[#E2E4EC] rounded-xl">
                    <button v-for="t in themeOptions" :key="t.key" type="button" class="flex-1 min-w-[90px] px-3 py-2.5 rounded-lg text-[15px] font-semibold" :class="readerTheme === t.key ? 'bg-white border border-[#DCDEE8] text-[#101323]' : 'border border-transparent text-[#555D75]'" @click="readerTheme = t.key">{{ t.label }}</button>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-5 border border-[#EDEFF4] rounded-xl" :style="{ background: currentThemeBg }">
                <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Aperçu</span>
                <p class="mt-3 max-w-[60ch]" :style="{ fontFamily: readerFont === 'Figtree' ? 'Figtree, sans-serif' : 'Newsreader, serif', fontSize: readerSize + 'px', lineHeight: 1.6, color: currentThemeFg }">Allumer un pont neuf demande deux lanterniers : un qui marche devant, un qui compte les travées derrière.</p>
              </div>
              <p class="text-sm text-[#6B7286] mt-4">Ces réglages s'appliquent immédiatement à la page de lecture des chapitres.</p>
            </div>
          </template>

          <template v-else-if="tab === 'Bibliothèque'">
            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <h2 class="font-sora text-xl font-semibold tracking-[-0.02em]">Bibliothèque</h2>
              <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Les romans que vous avez mis de côté pour plus tard.</p>

              <p v-if="library && !library.length" class="text-[#6B7286] mt-6">Aucun roman dans votre bibliothèque pour le moment.</p>

              <div v-if="library" class="flex flex-col gap-3 mt-6">
                <div v-for="entry in library" :key="entry.novel.id" class="flex flex-wrap items-start gap-3.5 border border-[#EDEFF4] rounded-xl p-5 bg-[#F8F9FC]">
                  <img v-if="entry.novel.cover" class="flex-none w-[52px] aspect-[2/3] object-cover rounded-md border border-[#E2E4EC]" :src="BACK_URL + entry.novel.cover.filepath" :alt="entry.novel.title">
                  <span v-else class="flex-none w-[52px] aspect-[2/3] rounded-md bg-[#E6E7EE] border border-[#E2E4EC] block"></span>
                  <div class="flex-1 basis-[200px] min-w-[180px]">
                    <RouterLink :to="{name: 'read_novel', params: {novel_slug: entry.novel.slug}}" class="font-sora text-[18px] font-semibold tracking-[-0.02em] text-[#101323] hover:text-[#3138B0]">{{ entry.novel.title }}</RouterLink>
                    <span class="block text-sm text-[#6B7286] mt-1.5">{{ entry.novel.author.name }} {{ entry.novel.author.lastname }} · {{ entry.novel.quantiteChapitre }} {{ entry.novel.quantiteChapitre > 1 ? 'chapitres' : 'chapitre' }}</span>
                  </div>
                  <button type="button" class="flex-none px-4 py-2.5 rounded-lg border border-[#D8DBE6] bg-white text-sm font-semibold text-[#9B2C2C] hover:bg-[#FCF3F3]" @click="removeFromLibrary(entry.novel.id)">Retirer</button>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="tab === 'Sécurité'">
            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <h2 class="font-sora text-xl font-semibold tracking-[-0.02em]">Connexion</h2>
              <div class="grid gap-4 mt-5" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
                <label class="block">
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">E-mail</span>
                  <input v-model="credentialsForm.email" type="email" class="w-full mt-2 h-[44px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
                </label>
                <label class="block">
                  <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Nouveau mot de passe</span>
                  <input v-model="credentialsForm.newPassword" type="password" placeholder="Laisser vide pour ne pas changer" autocomplete="new-password" class="w-full mt-2 h-[44px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
                </label>
              </div>
              <label class="block mt-4 max-w-[360px]">
                <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Mot de passe actuel</span>
                <input v-model="credentialsForm.currentPassword" type="password" placeholder="Requis pour confirmer" autocomplete="current-password" class="w-full mt-2 h-[44px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
              </label>

              <div v-if="credentialsError" class="text-sm text-[#6B0504] bg-[#FBEAEA] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5 mt-4">{{ credentialsError }}</div>
              <div v-if="credentialsSaved" class="text-sm text-[#3A6B1F] bg-[#EEF7E8] border border-[#CDE7BD] rounded-lg px-3.5 py-2.5 mt-4">Identifiants mis à jour.</div>

              <div class="flex flex-wrap items-center gap-3 mt-5">
                <button type="button" class="px-5 py-3 rounded-lg border-0 bg-[#3138B0] text-white text-[15px] font-semibold hover:bg-[#232878] disabled:opacity-60" :disabled="savingCredentials" @click="saveCredentials">{{ savingCredentials ? 'Mise à jour…' : 'Mettre à jour' }}</button>
              </div>
            </div>

            <div class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
              <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Vos données</h2>
              <p class="text-[15px] leading-relaxed text-[#555D75] mt-2.5 max-w-[58ch]">La suppression du compte est immédiate et définitive : vos romans, commentaires, likes et pièces non dépensées sont perdus.</p>
              <div class="flex flex-wrap gap-3 mt-5">
                <button type="button" class="px-5 py-3 rounded-lg border border-[#E3C9C9] bg-white text-[15px] font-semibold text-[#9B2C2C] hover:bg-[#FCF3F3] hover:border-[#D9A9A9]" @click="deletingAccount = true">Supprimer mon compte</button>
              </div>
            </div>
          </template>

        </section>
      </div>
    </main>

    <div v-if="deletingNovelId" class="fixed inset-0 z-40 bg-[#101323]/50 flex items-center justify-center px-4" @click.self="deletingNovelId = null">
      <div class="w-full max-w-[420px] bg-white rounded-2xl p-6">
        <h3 class="font-sora text-lg font-semibold text-center pb-3.5 border-b border-[#EEEFF4]">Supprimer le roman</h3>
        <p class="text-[#9B2C2C] font-semibold mt-4">Cette action est irréversible.</p>
        <p class="text-[#555D75] mt-1.5">Êtes-vous sûr de vouloir supprimer ce roman et tous ses chapitres ?</p>
        <div class="flex justify-center gap-3 mt-5">
          <button type="button" class="px-5 py-2.5 rounded-lg border border-[#DCDEE8] bg-white text-sm font-semibold hover:border-[#3138B0]" @click="deletingNovelId = null">Annuler</button>
          <button type="button" class="px-5 py-2.5 rounded-lg border-0 bg-[#9B2C2C] text-white text-sm font-semibold hover:bg-[#7C2222]" @click="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>

    <div v-if="deletingAccount" class="fixed inset-0 z-40 bg-[#101323]/50 flex items-center justify-center px-4" @click.self="deletingAccount = false">
      <div class="w-full max-w-[420px] bg-white rounded-2xl p-6">
        <h3 class="font-sora text-lg font-semibold text-center pb-3.5 border-b border-[#EEEFF4]">Supprimer mon compte</h3>
        <p class="text-[#9B2C2C] font-semibold mt-4">Cette action est irréversible.</p>
        <p class="text-[#555D75] mt-1.5">Votre profil, vos romans, vos commentaires, vos likes et vos pièces seront définitivement supprimés.</p>
        <div v-if="deleteAccountError" class="text-sm text-[#6B0504] bg-[#FBEAEA] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5 mt-4">{{ deleteAccountError }}</div>
        <div class="flex justify-center gap-3 mt-5">
          <button type="button" class="px-5 py-2.5 rounded-lg border border-[#DCDEE8] bg-white text-sm font-semibold hover:border-[#3138B0]" @click="deletingAccount = false">Annuler</button>
          <button type="button" class="px-5 py-2.5 rounded-lg border-0 bg-[#9B2C2C] text-white text-sm font-semibold hover:bg-[#7C2222] disabled:opacity-60" :disabled="deletingAccountLoading" @click="confirmDeleteAccount">{{ deletingAccountLoading ? 'Suppression…' : 'Supprimer définitivement' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useAuth } from '@/stores/auth.js';

const BACK_URL = import.meta.env.VITE_BACK_URL;
const authStore = useAuth();
const { user, coins } = storeToRefs(authStore);
const { logout } = authStore;

const tabs = [
  { key: 'Profil', label: 'Profil', icon: 'tabler:user' },
  { key: 'Pièces', label: 'Pièces & achats', icon: 'tabler:coins' },
  { key: 'Écrire', label: 'Écrire', icon: 'tabler:pencil' },
  { key: 'Lecture', label: 'Lecture', icon: 'tabler:book-2' },
  { key: 'Bibliothèque', label: 'Bibliothèque', icon: 'tabler:bookmark' },
  { key: 'Sécurité', label: 'Sécurité', icon: 'tabler:shield-lock' },
];
const tab = ref('Profil');

const initials = computed(() => {
  if (!user.value) return '';
  return (user.value.name?.slice(0, 1) ?? '').toUpperCase() + (user.value.lastname?.slice(0, 1) ?? '').toUpperCase();
});

const profileForm = ref({ name: '', lastname: '', username: '', bio: '' });
const savingProfile = ref(false);
const profileError = ref('');
const profileSaved = ref(false);
const pendingAvatar = ref(null);

function resetProfileForm() {
  profileForm.value = {
    name: user.value?.name ?? '',
    lastname: user.value?.lastname ?? '',
    username: user.value?.username ?? '',
    bio: user.value?.bio ?? '',
  };
  profileError.value = '';
  profileSaved.value = false;
}

watch(user, (u) => {
  if (u) resetProfileForm();
}, { immediate: true });

function onAvatarChange(event) {
  pendingAvatar.value = event.target.files[0] ?? null;
  saveProfile();
}

function saveProfile() {
  savingProfile.value = true;
  profileError.value = '';
  profileSaved.value = false;
  const formData = new FormData();
  formData.append('name', profileForm.value.name);
  formData.append('lastname', profileForm.value.lastname);
  formData.append('username', profileForm.value.username);
  formData.append('bio', profileForm.value.bio);
  if (pendingAvatar.value) {
    formData.append('avatar', pendingAvatar.value);
  }
  axios.post('me', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => {
      authStore.user = { ...authStore.user, ...res.data };
      profileSaved.value = true;
      pendingAvatar.value = null;
    })
    .catch((err) => {
      profileError.value = err.response?.data?.message ?? "La mise à jour a échoué.";
    })
    .finally(() => {
      savingProfile.value = false;
    });
}

const transactions = ref([]);
axios.get('/transaction/me').then((res) => {
  transactions.value = res.data;
}).catch((err) => console.error(err));

function formatDate(value) {
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const userNovels = ref(null);
axios.get('user/novels').then((res) => {
  userNovels.value = res.data;
}).catch((err) => console.error(err));

const library = ref(null);
axios.get('library/me').then((res) => {
  library.value = res.data;
}).catch((err) => console.error(err));

const readingProgress = ref(null);
axios.get('/reading-progress/me').then((res) => {
  readingProgress.value = res.data;
}).catch((err) => console.error(err));

function progressPercent(entry) {
  if (!entry.totalChapters) return 0;
  return Math.round(((entry.chapterIndex + 1) / entry.totalChapters) * 100);
}

function removeFromLibrary(novelId) {
  axios.post('library/', { novel: novelId }).then(() => {
    library.value = library.value.filter((entry) => entry.novel.id !== novelId);
  }).catch((err) => console.error(err));
}

const deletingNovelId = ref(null);
function confirmDelete() {
  const novelId = deletingNovelId.value;
  axios.delete('novel/' + novelId).then(() => {
    userNovels.value = userNovels.value.filter((entry) => entry.novel.id !== novelId);
    deletingNovelId.value = null;
  }).catch((err) => console.error(err));
}

const deletingAccount = ref(false);
const deletingAccountLoading = ref(false);
const deleteAccountError = ref('');
function confirmDeleteAccount() {
  deletingAccountLoading.value = true;
  deleteAccountError.value = '';
  axios.delete('me').then(() => {
    logout();
  }).catch((err) => {
    deleteAccountError.value = err.response?.data?.message ?? "La suppression a échoué.";
  }).finally(() => {
    deletingAccountLoading.value = false;
  });
}

const credentialsForm = ref({ email: '', currentPassword: '', newPassword: '' });
const savingCredentials = ref(false);
const credentialsError = ref('');
const credentialsSaved = ref(false);

watch(user, (u) => {
  if (u) credentialsForm.value.email = u.email ?? '';
}, { immediate: true });

function saveCredentials() {
  credentialsError.value = '';
  credentialsSaved.value = false;
  if (!credentialsForm.value.currentPassword) {
    credentialsError.value = "Entrez votre mot de passe actuel pour confirmer.";
    return;
  }
  savingCredentials.value = true;
  axios.post('me/credentials', {
    email: credentialsForm.value.email,
    current_password: credentialsForm.value.currentPassword,
    new_password: credentialsForm.value.newPassword || undefined,
  }).then((res) => {
    authStore.user = { ...authStore.user, ...res.data };
    credentialsSaved.value = true;
    credentialsForm.value.currentPassword = '';
    credentialsForm.value.newPassword = '';
  }).catch((err) => {
    credentialsError.value = err.response?.data?.message ?? "La mise à jour a échoué.";
  }).finally(() => {
    savingCredentials.value = false;
  });
}

const sizeOptions = [
  { label: 'Petit', value: 16 },
  { label: 'Moyen', value: 20 },
  { label: 'Grand', value: 24 },
];
const themeOptions = [
  { key: 'papier', label: 'Papier', bg: '#FFFCF6', fg: '#101323' },
  { key: 'sepia', label: 'Sépia', bg: '#F3E7D3', fg: '#33271A' },
  { key: 'nuit', label: 'Nuit', bg: '#15161D', fg: '#E6E7EF' },
];

const readerSize = ref(Number(localStorage.getItem('reader_size')) || 20);
const readerTheme = ref(localStorage.getItem('reader_theme') || 'papier');
const readerFont = ref(localStorage.getItem('reader_font') || 'Newsreader');
watch(readerSize, (v) => localStorage.setItem('reader_size', v));
watch(readerTheme, (v) => localStorage.setItem('reader_theme', v));
watch(readerFont, (v) => localStorage.setItem('reader_font', v));

const currentThemeBg = computed(() => (themeOptions.find((t) => t.key === readerTheme.value) ?? themeOptions[0]).bg);
const currentThemeFg = computed(() => (themeOptions.find((t) => t.key === readerTheme.value) ?? themeOptions[0]).fg);
</script>
