<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">
   <template v-if="novel">

    <section class="bg-[#FFFCF6] border-b border-[#EADFCB]">
      <div class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-3.5 flex items-center gap-2 text-[13px] text-[#6B7286]">
        <RouterLink to="/" class="text-[#6B7286]">Le fil</RouterLink>
        <iconify-icon icon="tabler:chevron-right" class="text-[14px]"></iconify-icon>
        <RouterLink v-if="firstCategory" :to="{name: 'category', params: {id: firstCategory.id}}" class="text-[#6B7286] capitalize hover:text-[#3138B0]">{{ firstCategory.name }}</RouterLink>
        <iconify-icon v-if="firstCategory" icon="tabler:chevron-right" class="text-[14px]"></iconify-icon>
        <span class="text-[#333B54]">{{ novel.title }}</span>
      </div>

      <div class="max-w-[1340px] mx-auto px-4 sm:px-6 pt-7 pb-10 flex flex-wrap gap-10 items-start">
        <div class="flex-none basis-[248px] min-w-[176px]">
          <img
            v-if="novel.cover"
            class="block aspect-[2/3] w-full rounded-xl object-cover border border-[#EADFCB] shadow-lg"
            :src="BACK_URL + novel.cover.filepath"
            :alt="novel.title"
          >
          <span v-else class="block aspect-[2/3] rounded-xl bg-[#F0EBE0] border border-[#EADFCB]"></span>
        </div>

        <div class="flex-1 basis-[520px] min-w-[300px]">
          <div class="flex flex-wrap gap-2">
            <span v-for="cat in novel.categories" :key="cat.id" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7E3C2] text-[#7A5313] text-[13px] font-semibold capitalize">
              <iconify-icon icon="tabler:tag" class="text-[15px]"></iconify-icon>{{ cat.name }}
            </span>
            <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E9EAF7] text-[#3138B0] text-[13px] font-semibold">
              <iconify-icon :icon="novel.progress === 'completed' ? 'tabler:circle-check' : novel.progress === 'paused' ? 'tabler:player-pause' : 'tabler:progress'" class="text-[15px]"></iconify-icon>{{ progressBadge }}
            </span>
            <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBEEDA] text-[#7A5313] text-[13px] font-semibold">
              <iconify-icon icon="tabler:gift" class="text-[15px]"></iconify-icon>{{ freeChaptersLabel }}
            </span>
          </div>

          <h1 class="font-sora text-[clamp(30px,3.4vw,44px)] font-semibold tracking-[-0.03em] leading-[1.1] mt-4">{{ novel.title }}</h1>

          <div class="flex items-center gap-2.5 mt-3.5">
            <img v-if="novel.author.avatar" class="w-9 h-9 rounded-full object-cover flex-none" :src="BACK_URL + novel.author.avatar.filepath" alt="">
            <span v-else class="w-9 h-9 flex-none rounded-full bg-[#F7E3C2] flex items-center justify-center font-sora text-[13px] font-semibold text-[#7A5313]">{{ initials(novel.author) }}</span>
            <span class="text-[16px] text-[#3A4260]">par <RouterLink :to="{name: 'author', params: {id: novel.author.id}}" class="font-semibold text-[#101323] hover:text-[#3138B0]">{{ novel.author.name }} {{ novel.author.lastname }}</RouterLink> · {{ novel.author.novelCount }} {{ novel.author.novelCount > 1 ? 'romans publiés' : 'roman publié' }}</span>
          </div>

          <p v-if="novel.resume" class="font-newsreader text-[19px] leading-relaxed text-[#3A4260] mt-5 max-w-[62ch]">{{ novel.resume }}</p>

          <div class="flex flex-wrap gap-7 mt-6 py-4 border-t border-b border-[#EADFCB]">
            <span>
              <span class="block font-sora text-[22px] font-semibold tracking-[-0.02em]">{{ publishedChapters.length }}</span>
              <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313] mt-1">chapitres</span>
            </span>
            <span>
              <span class="block font-sora text-[22px] font-semibold tracking-[-0.02em]">{{ likesCount }}</span>
              <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313] mt-1">j'aime</span>
            </span>
            <span>
              <span class="block font-sora text-[22px] font-semibold tracking-[-0.02em]">{{ novel.commentsCount ?? 0 }}</span>
              <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313] mt-1">commentaires</span>
            </span>
          </div>

          <div class="flex flex-wrap gap-2.5 mt-6">
            <RouterLink v-if="firstChapter" :to="chapterLink(firstChapter)" class="px-5 py-3 rounded-lg bg-[#101323] text-white text-[16px] font-semibold hover:bg-[#262B45]">
              <span class="flex items-center gap-2"><iconify-icon icon="tabler:book-2" class="text-[19px]"></iconify-icon>Lire le chapitre 1</span>
            </RouterLink>
            <button v-if="token" type="button" class="px-4 py-3 rounded-lg text-[16px] font-semibold flex items-center gap-2 border" :class="novel.inLibrary ? 'bg-[#E9EAF7] text-[#3138B0] border-[#3138B0]' : 'border-[#E2E4EC] bg-white text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]'" @click="toggleLibrary">
              <iconify-icon :icon="novel.inLibrary ? 'tabler:bookmark-filled' : 'tabler:bookmark-plus'" class="text-[19px]"></iconify-icon>{{ novel.inLibrary ? 'Dans ma bibliothèque' : 'Ajouter à ma bibliothèque' }}
            </button>
            <button type="button" class="px-4 py-3 rounded-lg text-[16px] font-semibold flex items-center gap-2" :class="likeButtonClass" @click="like">
              <iconify-icon :icon="isLiked ? 'tabler:heart-filled' : 'tabler:heart'" class="text-[19px]"></iconify-icon>{{ likesCount }}
            </button>
            <a href="#sommaire" class="px-5 py-3 rounded-lg border border-[#EADFCB] bg-white text-[16px] font-semibold text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]">
              <span class="flex items-center gap-2"><iconify-icon icon="tabler:list-numbers" class="text-[19px]"></iconify-icon>Sommaire</span>
            </a>
            <RouterLink v-if="novel.isAuthor" :to="{name: 'author_novel', params: {id: novel.id}}" class="px-5 py-3 rounded-lg border border-[#DCDEE8] bg-white text-[16px] font-semibold text-[#333B54] hover:border-[#3138B0] hover:text-[#3138B0]">
              <span class="flex items-center gap-2"><iconify-icon icon="tabler:pencil" class="text-[19px]"></iconify-icon>Gérer le roman</span>
            </RouterLink>
          </div>
          <span class="block text-sm text-[#6B7286] mt-3.5">{{ accessNote }}</span>
        </div>
      </div>
    </section>

    <div class="max-w-[1340px] mx-auto px-4 py-6 flex flex-wrap gap-6 items-start">

      <main class="flex-[100_1_480px] min-w-[300px] flex flex-col gap-4">

        <div class="flex gap-2 flex-wrap">
          <button
            v-for="t in tabs"
            :key="t"
            type="button"
            class="px-4 py-2 rounded-full text-sm font-semibold border"
            :class="tab === t ? 'bg-[#101323] text-white border-[#101323]' : 'bg-white text-[#333B54] border-[#DCDEE8]'"
            @click="tab = t"
          >{{ t }}</button>
        </div>

        <section v-if="tab === 'Sommaire'" id="sommaire" class="bg-white border border-[#E2E4EC] rounded-2xl p-4">
          <div class="flex items-baseline justify-between gap-3.5 flex-wrap">
            <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
              <iconify-icon icon="tabler:list-numbers" class="text-[19px] text-[#3138B0]"></iconify-icon>{{ publishedChapters.length }} {{ publishedChapters.length > 1 ? 'chapitres' : 'chapitre' }} · {{ freeChaptersLabel }}
            </h2>
            <button type="button" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCDEE8] bg-white text-[13px] font-semibold text-[#333B54] hover:border-[#3138B0] hover:text-[#3138B0]" @click="ascending = !ascending">
              <iconify-icon icon="tabler:arrows-sort" class="text-[16px]"></iconify-icon>{{ ascending ? 'Du plus ancien' : 'Du plus récent' }}
            </button>
          </div>
          <div class="flex flex-col mt-2">
            <div
              v-for="entry in visibleChapters"
              :key="entry.chapter.id"
              class="flex items-center gap-3.5 py-3 border-b border-[#EEEFF4] last:border-b-0"
            >
              <RouterLink :to="entry.unlocked ? chapterLink(entry.chapter) : {}" class="flex-1 flex items-center gap-3.5 min-w-0" :class="entry.unlocked ? 'hover:text-[#3138B0]' : 'cursor-default'" @click="!entry.unlocked && $event.preventDefault()">
                <span class="flex-none w-8 font-plexmono text-[13px] text-[#868DA3]">{{ String(entry.num).padStart(2, '0') }}</span>
                <span class="flex-1 min-w-0">
                  <span class="block font-newsreader text-[18px] font-medium leading-tight truncate">{{ entry.chapter.title }}</span>
                  <span class="block text-[12px] text-[#6B7286] mt-0.5">{{ chapterMeta(entry) }}</span>
                </span>
              </RouterLink>
              <span v-if="entry.read" class="flex-none flex items-center gap-1.5 text-[13px] font-semibold px-2.5 py-1 rounded-md bg-[#E9EAF7] text-[#3138B0]">
                <iconify-icon icon="tabler:check" class="text-[15px]"></iconify-icon>Lu
              </span>
              <span v-else-if="entry.unlocked" class="flex-none flex items-center gap-1.5 text-[13px] font-semibold px-2.5 py-1 rounded-md bg-[#FBEEDA] text-[#7A5313]">
                <iconify-icon icon="tabler:book-2" class="text-[15px]"></iconify-icon>{{ entry.num === 1 ? 'Gratuit' : 'Débloqué' }}
              </span>
              <span v-else class="flex-none flex items-center gap-1.5 text-[13px] font-semibold px-2.5 py-1 rounded-md bg-[#F1F2F7] text-[#101323]">
                <iconify-icon icon="tabler:lock" class="text-[15px]"></iconify-icon>Verrouillé
              </span>
              <RouterLink v-if="novel.isAuthor" :to="{name: 'chapter_edit', params: {novel_id: novel.id, chapter_id: entry.chapter.id}}" class="flex-none text-[#868DA3] hover:text-[#3138B0]">
                <iconify-icon icon="tabler:pencil" class="text-[17px]"></iconify-icon>
              </RouterLink>
            </div>
          </div>
          <button v-if="displayChapters.length > 8" type="button" class="w-full text-center mt-3.5 py-3 rounded-lg border border-[#DCDEE8] text-[15px] font-semibold hover:border-[#3138B0]" @click="showAllChapters = !showAllChapters">
            <span class="flex items-center justify-center gap-2">
              {{ showAllChapters ? 'Réduire' : `Voir les ${displayChapters.length} chapitres` }}
              <iconify-icon :icon="showAllChapters ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="text-[18px]"></iconify-icon>
            </span>
          </button>
        </section>

        <section v-if="tab === 'Commentaires'" class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
          <h2 class="flex items-center gap-2 font-sora text-base font-semibold mb-4">
            <iconify-icon icon="tabler:message-circle" class="text-[19px] text-[#3138B0]"></iconify-icon>{{ novel.commentsCount ?? 0 }} commentaires
          </h2>
          <div v-if="token" class="flex gap-2.5 pb-5 border-b border-[#EEEFF4]">
            <span v-if="user?.avatar" class="w-[38px] h-[38px] flex-none rounded-full overflow-hidden"><img class="w-full h-full object-cover" :src="BACK_URL + user.avatar.filepath" alt=""></span>
            <span v-else class="w-[38px] h-[38px] flex-none rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-[13px] font-semibold text-[#3138B0]">{{ initials(user) }}</span>
            <label class="flex-1 flex items-center bg-[#F3F4F8] border border-[#E2E4EC] rounded-lg px-3.5 h-[44px]">
              <input v-model="comment" type="text" placeholder="Écrire un commentaire, sans spoiler" class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]" @keyup.enter="sendComment">
            </label>
            <button type="button" class="flex-none px-5 h-[44px] flex items-center justify-center rounded-lg border-0 bg-[#3138B0] text-white text-[15px] font-semibold hover:bg-[#232878]" @click="sendComment">Publier</button>
          </div>
          <div class="flex flex-col">
            <div v-for="(c, index) in novel.comments" :key="c.id" class="flex gap-2.5 py-4 border-b border-[#EEEFF4] last:border-b-0">
              <span v-if="c.user.avatar" class="w-[38px] h-[38px] flex-none rounded-full overflow-hidden"><img class="w-full h-full object-cover" :src="BACK_URL + c.user.avatar.filepath" alt=""></span>
              <span v-else class="w-[38px] h-[38px] flex-none rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-[13px] font-semibold text-[#3138B0]">{{ initials(c.user) }}</span>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-[#6B7286]"><span class="font-semibold text-[#101323]">{{ c.user.username || c.user.name }}</span><template v-if="relativeTime(c.dateCreation)"> · {{ relativeTime(c.dateCreation) }}</template></div>
                <p class="font-newsreader text-[18px] leading-relaxed text-[#3A4260] mt-1">{{ c.content }}</p>
                <div class="flex items-center gap-4 mt-2.5">
                  <button type="button" class="flex items-center gap-1.5 text-[13px] font-semibold" :class="c.isLiked ? 'text-[#7A5313]' : 'text-[#555D75] hover:text-[#7A5313]'" @click="toggleCommentLike(c)">
                    <iconify-icon :icon="c.isLiked ? 'tabler:heart-filled' : 'tabler:heart'" class="text-[16px] text-[#B4741A]"></iconify-icon>{{ c.likesCount ?? 0 }}
                  </button>
                  <button v-if="token" type="button" class="text-[13px] font-semibold text-[#555D75] hover:text-[#3138B0]" @click="toggleAnswerInput(index)">Répondre</button>
                  <button v-if="c.comments && c.comments.length" type="button" class="flex items-center gap-1.5 text-[13px] font-semibold text-[#3138B0] hover:text-[#232878]" @click="toggleAnswers(index)">
                    {{ c.comments.length }} réponse{{ c.comments.length > 1 ? 's' : '' }}
                    <iconify-icon :icon="c.showAnswers ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="text-[15px]"></iconify-icon>
                  </button>
                </div>

                <div v-if="c.showAnswerInput" class="flex gap-2.5 mt-3.5">
                  <span v-if="user?.avatar" class="w-8 h-8 flex-none rounded-full overflow-hidden"><img class="w-full h-full object-cover" :src="BACK_URL + user.avatar.filepath" alt=""></span>
                  <span v-else class="w-8 h-8 flex-none rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-xs font-semibold text-[#3138B0]">{{ initials(user) }}</span>
                  <label class="flex-1 flex items-center bg-[#F3F4F8] border border-[#E2E4EC] rounded-lg px-3 h-[40px]">
                    <input v-model="answer" type="text" placeholder="Écrire une réponse..." class="flex-1 min-w-0 border-0 bg-transparent outline-none text-sm" @keyup.enter="sendAnswer(index)">
                  </label>
                  <button type="button" class="flex-none px-3.5 rounded-lg border-0 bg-[#3138B0] text-white text-sm font-semibold hover:bg-[#232878]" @click="sendAnswer(index)">Envoyer</button>
                </div>

                <div v-if="c.showAnswers" class="flex flex-col gap-3 mt-3.5">
                  <div v-for="a in c.comments" :key="a.id" class="flex gap-2.5">
                    <span v-if="a.user.avatar" class="w-8 h-8 flex-none rounded-full overflow-hidden"><img class="w-full h-full object-cover" :src="BACK_URL + a.user.avatar.filepath" alt=""></span>
                    <span v-else class="w-8 h-8 flex-none rounded-full bg-[#E9EAF7] flex items-center justify-center font-sora text-xs font-semibold text-[#3138B0]">{{ initials(a.user) }}</span>
                    <div class="min-w-0">
                      <div class="text-sm text-[#6B7286]"><span class="font-semibold text-[#101323]">{{ a.user.username || a.user.name }}</span><template v-if="relativeTime(a.dateCreation)"> · {{ relativeTime(a.dateCreation) }}</template></div>
                      <p class="font-newsreader text-[16px] leading-relaxed text-[#3A4260] mt-0.5">{{ a.content }}</p>
                      <button type="button" class="flex items-center gap-1.5 text-[13px] font-semibold mt-1.5" :class="a.isLiked ? 'text-[#7A5313]' : 'text-[#555D75] hover:text-[#7A5313]'" @click="toggleCommentLike(a)">
                        <iconify-icon :icon="a.isLiked ? 'tabler:heart-filled' : 'tabler:heart'" class="text-[15px] text-[#B4741A]"></iconify-icon>{{ a.likesCount ?? 0 }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!novel.comments || !novel.comments.length" class="text-center text-[#6B7286] py-8">Aucun commentaire pour le moment.</p>
          </div>
        </section>

        <section v-if="tab === 'À propos'" class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
          <h2 class="flex items-center gap-2 font-sora text-base font-semibold mb-1">
            <iconify-icon icon="tabler:info-circle" class="text-[19px] text-[#3138B0]"></iconify-icon>À propos de ce roman
          </h2>
          <p v-if="novel.resume" class="font-newsreader text-[18px] leading-relaxed text-[#3A4260] mt-3 max-w-[64ch]">{{ novel.resume }}</p>
          <div class="grid gap-4 mt-5 pt-5 border-t border-[#EEEFF4]" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
            <div>
              <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Statut</div>
              <div class="text-[15px] font-semibold mt-1">{{ progressLabels[novel.progress] ?? progressLabels.ongoing }}</div>
            </div>
            <div>
              <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Chapitres</div>
              <div class="text-[15px] font-semibold mt-1">{{ publishedChapters.length }} {{ publishedChapters.length > 1 ? 'publiés' : 'publié' }}</div>
            </div>
            <div v-if="rhythmFact">
              <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Rythme</div>
              <div class="text-[15px] font-semibold mt-1">{{ rhythmFact }}</div>
            </div>
            <div v-if="publishedDate">
              <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Première parution</div>
              <div class="text-[15px] font-semibold mt-1">{{ publishedDate }}</div>
            </div>
            <div v-if="novel.wordCount">
              <div class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Longueur</div>
              <div class="text-[15px] font-semibold mt-1">≈ {{ fmtNum(novel.wordCount) }} mots</div>
            </div>
          </div>
          <div v-if="novel.categories.length" class="flex flex-wrap gap-2 mt-5">
            <RouterLink v-for="cat in novel.categories" :key="cat.id" :to="{name: 'category', params: {id: cat.id}}" class="px-3 py-1.5 rounded-full border border-[#E2E4EC] bg-[#F7F8FC] text-[13px] font-medium text-[#333B54] capitalize hover:border-[#3138B0] hover:text-[#3138B0]">{{ cat.name }}</RouterLink>
          </div>
        </section>
      </main>

      <aside class="flex-1 basis-[300px] min-w-[260px] grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">

        <section v-if="novel.readingProgress" class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
          <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
            <iconify-icon icon="tabler:bookmark" class="text-[19px] text-[#3138B0]"></iconify-icon>Votre lecture
          </h2>
          <p class="text-sm text-[#555D75] mt-2">Chapitre {{ novel.readingProgress.chapterIndex + 1 }} · {{ novel.readingProgress.chapterTitle }}</p>
          <span class="block h-1.5 rounded-full bg-[#E6E7EE] mt-3">
            <span class="block h-1.5 rounded-full bg-[#E9A23B]" :style="{ width: readingProgressPercent + '%' }"></span>
          </span>
          <div class="flex justify-between font-plexmono text-[11px] text-[#6B7286] mt-2">
            <span>{{ novel.readingProgress.chapterIndex + 1 }} / {{ publishedChapters.length }}</span><span>{{ readingProgressPercent }} %</span>
          </div>
          <RouterLink :to="chapterLink({id: novel.readingProgress.chapterId})" class="block text-center mt-3.5 px-4 py-2.5 rounded-lg bg-[#3138B0] text-white text-sm font-semibold hover:bg-[#232878]">Reprendre au chapitre {{ novel.readingProgress.chapterIndex + 1 }}</RouterLink>
        </section>

        <section v-if="token && !novel.userBought && !novel.isAuthor" id="pieces" class="bg-[#FFFBF4] border border-[#E9A23B] rounded-2xl p-5">
          <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
            <iconify-icon icon="tabler:coins" class="text-[19px] text-[#B4741A]"></iconify-icon>Débloquer le roman
          </h2>
          <p class="text-sm leading-relaxed text-[#555D75] mt-2">Achetez le roman une fois pour lire tous les chapitres, sans limite.</p>
          <div class="flex items-baseline gap-2.5 mt-4">
            <span class="font-sora text-[30px] font-semibold tracking-[-0.02em]">{{ novel.price }}</span>
            <span class="text-[15px] font-semibold text-[#7A5313]">pièces</span>
          </div>
          <button type="button" class="block w-full text-center mt-4 px-4 py-3 rounded-lg border-0 bg-[#E9A23B] text-[#2A1B05] text-[15px] font-semibold hover:bg-[#F2B558]" @click="buyModal">
            Débloquer pour {{ novel.price }} pièces
          </button>
          <span class="block text-[13px] text-[#6B7286] mt-2.5">Solde : {{ coins ?? 0 }} pièces. Il vous restera {{ Math.max(0, (coins ?? 0) - novel.price) }} pièces.</span>
        </section>

        <section v-else-if="!token" id="pieces" class="bg-[#FFFBF4] border border-[#E9A23B] rounded-2xl p-5">
          <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
            <iconify-icon icon="tabler:coins" class="text-[19px] text-[#B4741A]"></iconify-icon>Débloquer le roman
          </h2>
          <p class="text-sm leading-relaxed text-[#555D75] mt-2">Le premier chapitre est gratuit, sans compte. Créez un compte pour débloquer le roman entier pour {{ novel.price }} pièces.</p>
          <RouterLink :to="{name: 'register'}" class="block text-center mt-4 px-4 py-3 rounded-lg bg-[#E9A23B] text-[#2A1B05] text-[15px] font-semibold hover:bg-[#F2B558]">Créer un compte</RouterLink>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
          <div class="flex items-center gap-3">
            <img v-if="novel.author.avatar" class="w-[46px] h-[46px] rounded-full object-cover flex-none" :src="BACK_URL + novel.author.avatar.filepath" alt="">
            <span v-else class="w-[46px] h-[46px] flex-none rounded-full bg-[#F7E3C2] flex items-center justify-center font-sora text-[15px] font-semibold text-[#7A5313]">{{ initials(novel.author) }}</span>
            <span class="flex-1 min-w-0">
              <RouterLink :to="{name: 'author', params: {id: novel.author.id}}" class="block font-sora text-[16px] font-semibold text-[#101323] hover:text-[#3138B0]">{{ novel.author.name }} {{ novel.author.lastname }}</RouterLink>
              <span class="block text-[13px] text-[#555D75] mt-0.5">{{ novel.author.novelCount }} {{ novel.author.novelCount > 1 ? 'romans' : 'roman' }} · {{ fmtNum(novel.author.totalLikesReceived ?? 0) }} j'aime</span>
            </span>
          </div>
          <p v-if="novel.author.bio" class="font-newsreader text-[15px] leading-relaxed text-[#3A4260] mt-3">{{ novel.author.bio }}</p>
          <div class="flex gap-2 mt-3.5">
            <button
              v-if="!novel.isAuthor"
              type="button"
              class="flex-1 px-3.5 py-2.5 rounded-lg border text-sm font-semibold"
              :class="novel.author.isFollowing ? 'border-[#3138B0] bg-[#E9EAF7] text-[#3138B0]' : 'border-[#DCDEE8] bg-white text-[#555D75]'"
              @click="toggleFollow"
            >{{ novel.author.isFollowing ? 'Suivi' : 'Suivre' }}</button>
            <RouterLink :to="{name: 'author', params: {id: novel.author.id}}" class="flex-1 text-center px-3.5 py-2.5 rounded-lg border border-[#E2E4EC] bg-white text-sm font-semibold text-[#101323] hover:border-[#3138B0] hover:text-[#3138B0]">Ses romans</RouterLink>
          </div>
        </section>

        <section v-if="similarNovels.length" class="bg-white border border-[#E2E4EC] rounded-2xl p-5">
          <h2 class="flex items-center gap-2 font-sora text-base font-semibold mb-1">
            <iconify-icon icon="tabler:sparkles" class="text-[19px] text-[#B4741A]"></iconify-icon>À lire ensuite
          </h2>
          <div class="flex flex-col">
            <RouterLink v-for="n in similarNovels" :key="n.id" :to="{name: 'read_novel', params: {novel_slug: n.slug}}" class="flex items-center gap-3 py-3 border-b border-[#EEEFF4] last:border-b-0 text-[#101323] hover:text-[#3138B0]">
              <img v-if="n.cover" class="w-10 flex-none aspect-[2/3] object-cover rounded-md border border-[#E2E4EC]" :src="BACK_URL + n.cover.filepath" :alt="n.title">
              <span v-else class="w-10 flex-none aspect-[2/3] rounded-md bg-[#E6E7EE] border border-[#E2E4EC] block"></span>
              <span class="flex-1 min-w-0">
                <span class="block font-newsreader text-[17px] font-medium leading-tight truncate">{{ n.title }}</span>
                <span class="block text-xs text-[#555D75] mt-1">{{ n.categories?.[0]?.name }}<template v-if="n.quantiteChapitre"> · {{ n.quantiteChapitre }} {{ n.quantiteChapitre > 1 ? 'chapitres' : 'chapitre' }}</template></span>
              </span>
            </RouterLink>
          </div>
        </section>
      </aside>
    </div>

    <div v-if="toggleBuyingModal" class="fixed inset-0 z-40 bg-[#101323]/50 flex items-center justify-center px-4" @click.self="toggleBuyingModal = false">
      <div class="w-full max-w-[420px] bg-white rounded-2xl p-6">
        <h3 class="font-sora text-lg font-semibold text-center pb-3.5 border-b border-[#EEEFF4]">Débloquer le roman</h3>
        <div v-if="!isOrderSuccess">
          <div v-if="orderError" class="flex bg-[#FBEAEA] text-[#6B0504] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5 my-4 text-sm">{{ orderError }}</div>
          <p class="text-center text-[#555D75] py-4">Êtes-vous sûr de vouloir débloquer ce roman ?</p>
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold">{{ novel.title }}</p>
              <p class="text-[#6B7286] text-sm">{{ novel.author.name }} {{ novel.author.lastname }}</p>
            </div>
            <div class="flex items-center gap-2">
              <iconify-icon icon="tabler:coin" class="text-[20px] text-[#B4741A]"></iconify-icon>
              <p class="font-sora font-semibold">{{ novel.price }}</p>
            </div>
          </div>
          <div class="flex justify-center gap-3 mt-5">
            <button type="button" class="px-5 py-2.5 rounded-lg border border-[#DCDEE8] bg-white text-sm font-semibold hover:border-[#3138B0]" @click="toggleBuyingModal = false">Annuler</button>
            <button type="button" class="px-5 py-2.5 rounded-lg border-0 bg-[#3138B0] text-white text-sm font-semibold hover:bg-[#232878] disabled:opacity-60" :disabled="isBuying" @click="buyNovel">{{ isBuying ? 'Achat en cours…' : 'Débloquer' }}</button>
          </div>
        </div>
        <div v-else>
          <p class="text-center text-[#555D75] py-4">Votre commande a été traitée avec succès !</p>
          <div class="flex justify-center">
            <button type="button" class="px-5 py-2.5 rounded-lg border-0 bg-[#3138B0] text-white text-sm font-semibold hover:bg-[#232878]" @click="toggleBuyingModal = false">Fermer</button>
          </div>
        </div>
      </div>
    </div>
   </template>
   <div v-else-if="notFound" class="flex items-center justify-center py-32 text-[#555D75]">Ce roman est introuvable.</div>
   <div v-else class="flex items-center justify-center py-32">
     <iconify-icon icon="tabler:loader-2" class="text-[28px] text-[#3138B0] animate-spin"></iconify-icon>
   </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuth } from "@/stores/auth.js";
import { useHomeStore } from "@/stores/home.js";
import { progressLabels, rhythmLabel } from "@/utils/rhythm.js";
import axios from "axios";

const authStore = useAuth();
const { user, token, coins } = storeToRefs(authStore);
const homeStore = useHomeStore();

const BACK_URL = import.meta.env.VITE_BACK_URL;

const novel = ref(null);
const router = useRouter();
const route = useRoute();
const novelSlug = ref(route.params.novel_slug);

const tabs = ["Sommaire", "Commentaires", "À propos"];
const tab = ref(tabs.includes(route.query.tab) ? route.query.tab : "Sommaire");
const ascending = ref(true);
const showAllChapters = ref(false);

const toggleBuyingModal = ref(false);
const isBuying = ref(false);
const isOrderSuccess = ref(false);
const orderError = ref("");

const FREE_CHAPTERS_COUNT = 1;
const freeChaptersLabel = `${FREE_CHAPTERS_COUNT} chapitre${FREE_CHAPTERS_COUNT > 1 ? 's' : ''} gratuit${FREE_CHAPTERS_COUNT > 1 ? 's' : ''}`;

const isLiked = ref(false);
const likesCount = ref(0);
const notFound = ref(false);

const comment = ref("");
const answer = ref("");

function initials(person) {
  if (!person) return "";
  return (person.name?.slice(0, 1) ?? "").toUpperCase() + (person.lastname?.slice(0, 1) ?? "").toUpperCase();
}

function fmtNum(n) {
  return new Intl.NumberFormat("fr-FR").format(n ?? 0);
}

function relativeTime(value) {
  if (!value) return "";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} jours`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function toggleLibrary() {
  axios.post("library/", { novel: novel.value.id }).then((res) => {
    novel.value.inLibrary = res.data.inLibrary;
  });
}

function toggleFollow() {
  if (!token.value) {
    router.push({ name: "login" });
    return;
  }
  axios.post(`follow/${novel.value.author.id}`).then((res) => {
    novel.value.author.isFollowing = res.data.following;
    novel.value.author.followersCount = res.data.followersCount;
  });
}

function toggleCommentLike(c) {
  if (!token.value) {
    router.push({ name: "login" });
    return;
  }
  axios.post(`comment/${c.id}/like`).then((res) => {
    c.isLiked = res.data.liked;
    c.likesCount = res.data.likesCount;
  });
}

if (novelSlug.value) {
  axios.get(`novel/bySlug/${novelSlug.value}`).then((res) => {
    novel.value = res.data;
    likesCount.value = novel.value.likesCount ?? 0;

    if (token.value) {
      axios.get(`like/liked/${novel.value.id}`).then((res) => {
        isLiked.value = res.data.liked;
      });
    }
  }).catch(() => {
    notFound.value = true;
  });
}

const publishedChapters = computed(() => {
  if (!novel.value) return [];
  return novel.value.isAuthor ? novel.value.chapters : novel.value.publishedChapters;
});

const firstChapter = computed(() => publishedChapters.value[0] ?? null);

const firstCategory = computed(() => novel.value?.categories?.[0] ?? null);

const chaptersWithLock = computed(() => publishedChapters.value.map((chapter, index) => ({
  chapter,
  num: index + 1,
  unlocked: index === 0 || novel.value.userBought || novel.value.isAuthor || isOrderSuccess.value,
  read: novel.value.readingProgress != null && index <= novel.value.readingProgress.chapterIndex,
})));

const displayChapters = computed(() => (ascending.value ? chaptersWithLock.value : [...chaptersWithLock.value].reverse()));
const visibleChapters = computed(() => (showAllChapters.value ? displayChapters.value : displayChapters.value.slice(0, 8)));

function chapterMeta(entry) {
  const parts = [];
  if (entry.chapter.dateCreation) {
    const date = new Date(entry.chapter.dateCreation.replace(" ", "T"));
    if (!Number.isNaN(date.getTime())) parts.push(date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }));
  }
  if (entry.chapter.wordCount) parts.push(`${new Intl.NumberFormat("fr-FR").format(entry.chapter.wordCount)} mots`);
  return parts.join(" · ");
}

const progressBadge = computed(() => {
  const progress = novel.value?.progress ?? "ongoing";
  const label = progressLabels[progress] ?? progressLabels.ongoing;
  const rhythm = novel.value?.rhythm;
  if (progress !== "ongoing" || (rhythm !== "weekly" && rhythm !== "biweekly")) return label;
  return `${label} · ${rhythmLabel(rhythm, novel.value.releaseDay)}`;
});

const rhythmFact = computed(() => {
  if ((novel.value?.progress ?? "ongoing") !== "ongoing" || !novel.value?.rhythm) return "";
  const label = rhythmLabel(novel.value.rhythm, novel.value.releaseDay);
  return label.charAt(0).toUpperCase() + label.slice(1);
});

const readingProgressPercent = computed(() => {
  if (!novel.value?.readingProgress || !publishedChapters.value.length) return 0;
  return Math.round(((novel.value.readingProgress.chapterIndex + 1) / publishedChapters.value.length) * 100);
});

const publishedDate = computed(() => {
  if (!novel.value?.publishedAt) return "";
  const date = new Date(novel.value.publishedAt.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
});

const accessNote = computed(() => {
  if (!novel.value) return "";
  if (novel.value.isAuthor) return "Vous êtes l'auteur de ce roman.";
  if (novel.value.userBought) return "Vous avez débloqué l'intégralité de ce roman.";
  if (!token.value) return "1er chapitre gratuit, sans compte. Créez un compte pour débloquer le roman entier.";
  return `1er chapitre gratuit. Le roman entier : ${novel.value.price} pièces · ${coins.value ?? 0} pièces sur votre solde.`;
});

const likeButtonClass = computed(() => (isLiked.value
  ? "bg-[#FBEEDA] text-[#7A5313] border border-[#F7E3C2] hover:bg-[#F7E3C2]"
  : "border border-[#E2E4EC] bg-white text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]"));

const similarNovels = computed(() => homeStore.newNovels.filter((n) => n.slug !== novelSlug.value).slice(0, 4));

function chapterLink(chapter) {
  return { name: "read_page", params: { slug: novel.value.slug, chapter_id: chapter.id } };
}

function like() {
  if (!token.value) {
    router.push({ name: "login" });
    return;
  }
  axios.post("like/", { novel: novel.value.id }).then((res) => {
    if (res.data.response) {
      isLiked.value = false;
      likesCount.value--;
    } else {
      isLiked.value = true;
      likesCount.value++;
    }
  });
}

function buyModal() {
  toggleBuyingModal.value = !toggleBuyingModal.value;
  orderError.value = "";
}

function buyNovel() {
  isBuying.value = true;
  axios
    .post("order/", { novel: novel.value.id })
    .then(() => {
      isOrderSuccess.value = true;
      novel.value.userBought = true;
    })
    .catch((err) => {
      orderError.value = err.response?.data?.message ?? "L'achat a échoué.";
      isBuying.value = false;
    });
}

function sendComment() {
  if (comment.value === "") return;
  axios.post("comment/", { content: comment.value, novel: novel.value.id }).then((res) => {
    novel.value.comments.unshift(res.data);
    novel.value.commentsCount = (novel.value.commentsCount ?? 0) + 1;
    comment.value = "";
  });
}

function sendAnswer(index) {
  if (answer.value === "") return;
  axios
    .post("comment/", { novel: novel.value.id, content: answer.value, parent: novel.value.comments[index].id })
    .then((res) => {
      novel.value.comments[index].comments.unshift(res.data);
      novel.value.comments[index].showAnswerInput = false;
      novel.value.comments[index].showAnswers = true;
      novel.value.commentsCount = (novel.value.commentsCount ?? 0) + 1;
      answer.value = "";
    });
}

function toggleAnswers(index) {
  novel.value.comments[index].showAnswers = !novel.value.comments[index].showAnswers;
}

function toggleAnswerInput(index) {
  novel.value.comments[index].showAnswerInput = !novel.value.comments[index].showAnswerInput;
}
</script>
