<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">

    <div class="sticky top-0 z-30 bg-[#FFFCF6] border-b border-[#EADFCB]">
      <div class="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3.5">
        <RouterLink :to="{name: 'account'}" class="flex-none flex items-center justify-center w-[38px] h-[38px] rounded-lg border border-[#EADFCB] bg-white text-[#555D75] hover:border-[#E9A23B] hover:text-[#7A5313]">
          <iconify-icon icon="tabler:arrow-left" class="text-[19px]"></iconify-icon>
        </RouterLink>
        <div class="flex-1 basis-[260px] min-w-[200px]">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313]">{{ novelId ? "Mon roman" : "Nouveau roman" }}</span>
          <span class="block font-sora text-[18px] font-semibold tracking-[-0.02em] mt-1">{{ novelId ? (novel.title || "Sans titre") : "Créer un roman" }}</span>
        </div>
        <span v-if="saved" class="flex-none flex items-center gap-1.5 text-[14px] font-semibold text-[#7A5313]">
          <iconify-icon icon="tabler:cloud-check" class="text-[18px] text-[#B4741A]"></iconify-icon>Enregistré
        </span>
        <div class="flex-none flex flex-wrap gap-2">
          <RouterLink v-if="novelId && novel.slug" :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#EADFCB] bg-white text-[15px] font-semibold text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]">
            <iconify-icon icon="tabler:eye" class="text-[18px]"></iconify-icon>Aperçu
          </RouterLink>
          <button type="button" class="flex items-center gap-2 px-5 py-2.5 rounded-lg border-0 bg-[#3138B0] text-white text-[15px] font-semibold hover:bg-[#232878] disabled:opacity-60" :disabled="saving" @click="novelId ? updateNovel() : createNovel()">
            <iconify-icon icon="tabler:send" class="text-[18px]"></iconify-icon>{{ saving ? "Enregistrement…" : (novelId ? "Enregistrer les modifications" : "Créer le roman") }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 pb-24 flex flex-wrap gap-6 items-start">

      <div class="flex-[100_1_520px] min-w-[300px] flex flex-col gap-4">

        <div v-if="errors.general" class="text-sm text-[#6B0504] bg-[#FBEAEA] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5">{{ errors.general }}</div>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-xl font-semibold tracking-[-0.02em]">Le roman</h2>
          <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Le titre et la couverture sont ce que les lecteurs voient dans la librairie.</p>

          <div class="flex flex-wrap gap-6 mt-6">
            <div class="flex-none w-[150px]">
              <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Couverture</span>
              <label class="flex flex-col items-center justify-center gap-2 mt-2.5 aspect-[2/3] rounded-xl border border-dashed border-[#D9C9A8] bg-[#F0EBE0] text-center p-3.5 cursor-pointer relative overflow-hidden">
                <img v-if="coverPreview" :src="coverPreview" class="absolute inset-0 w-full h-full object-cover" alt="" />
                <template v-else>
                  <iconify-icon icon="tabler:photo-up" class="text-[26px] text-[#B4741A]"></iconify-icon>
                  <span class="font-plexmono text-[11px] leading-relaxed text-[#9A8A6C]">1200×1800</span>
                </template>
                <input type="file" accept="image/*" class="hidden" @change="onFileUpload($event)">
              </label>
            </div>
            <div class="flex-1 basis-[300px] min-w-[260px] flex flex-col gap-4">
              <label class="block">
                <span class="flex justify-between gap-3 font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">
                  <span>Titre</span><span>{{ novel.title.length }} / 255</span>
                </span>
                <input v-model="novel.title" type="text" placeholder="Le titre de votre roman" @blur="checkTitleLenght" class="w-full mt-2 h-[46px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white font-sora text-[17px] font-semibold tracking-[-0.02em]">
              </label>
              <label class="block">
                <span class="flex justify-between gap-3 font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">
                  <span>Résumé</span><span>{{ novel.resume.length }} / 500</span>
                </span>
                <textarea v-model="novel.resume" rows="6" maxlength="500" placeholder="De quoi parle ce roman ? Qui est au centre, et qu'est-ce qui se met en travers ?" class="w-full mt-2 px-3.5 py-3 border border-[#DCDEE8] rounded-lg bg-white font-newsreader text-[17px] leading-relaxed resize-y"></textarea>
              </label>
            </div>
          </div>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Catégories</h2>
          <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Décide dans quelles listes de la librairie le roman apparaît.</p>

          <select class="w-full mt-5 h-[44px] px-3 border border-[#DCDEE8] rounded-lg bg-white text-[15px]" @change="onCategorySelect">
            <option value="" disabled selected>Choisir une catégorie</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
          <div class="flex flex-wrap items-center gap-2 mt-3">
            <span v-for="(category, index) in novel.categories" :key="category.id" class="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-[#F3F4F8] border border-[#E2E4EC] text-[14px] font-medium">
              {{ category.name }}
              <button type="button" class="flex p-0 border-0 bg-none text-[#868DA3] hover:text-[#101323]" @click="removeCategory(index)"><iconify-icon icon="tabler:x" class="text-[15px]"></iconify-icon></button>
            </span>
            <span v-if="!novel.categories.length" class="text-sm text-[#6B7286]">Aucune catégorie choisie.</span>
          </div>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">État</h2>
          <div class="flex flex-wrap gap-1.5 mt-5 p-1 bg-[#F3F4F8] border border-[#E2E4EC] rounded-xl max-w-[320px]">
            <button v-for="s in statusOptions" :key="s.value" type="button" class="flex-1 min-w-[110px] px-3 py-2.5 rounded-lg text-[15px] font-semibold" :class="novel.status === s.value ? 'bg-white border border-[#DCDEE8] text-[#101323]' : 'border border-transparent text-[#555D75]'" @click="novel.status = s.value">{{ s.label }}</button>
          </div>
          <p class="text-sm text-[#6B7286] mt-3">{{ novel.status === 'published' ? "Visible dans le fil et la librairie." : "Masqué du fil et de la librairie." }}</p>
        </section>

        <section class="bg-[#FFFBF4] border border-[#E9A23B] rounded-2xl p-6">
          <h2 class="flex items-center gap-2.5 font-sora text-lg font-semibold tracking-[-0.02em]">
            <iconify-icon icon="tabler:coins" class="text-[21px] text-[#B4741A]"></iconify-icon>Prix
          </h2>
          <p class="text-[15px] leading-relaxed text-[#555D75] mt-2 max-w-[56ch]">Le premier chapitre est toujours gratuit. Ce prix débloque tout le roman.</p>
          <label class="block mt-5 max-w-[220px]">
            <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313]">Pièces</span>
            <input v-model.number="novel.price" type="number" min="1" placeholder="Prix" @blur="checkPrice" class="w-full mt-2 h-[46px] px-3.5 border border-[#EADFCB] rounded-lg bg-white font-sora text-[17px] font-semibold">
          </label>
        </section>

        <section v-if="novelId" class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <div class="flex flex-wrap items-end gap-4">
            <div class="flex-1 basis-[240px] min-w-[220px]">
              <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Chapitres</h2>
              <p class="text-[15px] leading-relaxed text-[#555D75] mt-2">{{ publishedChaptersCount }} publié{{ publishedChaptersCount > 1 ? 's' : '' }} · {{ draftChaptersCount }} en cours</p>
            </div>
            <RouterLink :to="{name: 'chapter_edit', params: {novel_id: novelId}}" class="flex-none flex items-center gap-2 px-5 py-3 rounded-lg bg-[#3138B0] text-white text-[15px] font-semibold hover:bg-[#232878]">
              <iconify-icon icon="tabler:plus" class="text-[18px]"></iconify-icon>Nouveau chapitre
            </RouterLink>
          </div>

          <p v-if="chapters && !chapters.length" class="text-[#6B7286] mt-6">Aucun chapitre pour le moment.</p>

          <div v-if="chapters" class="flex flex-col mt-4">
            <div v-for="(ch, index) in chapters" :key="ch.id" class="flex flex-wrap items-center gap-3.5 py-3.5 border-b border-[#EDEFF4] last:border-b-0">
              <span class="flex-none w-[28px] font-plexmono text-[13px] text-[#868DA3]">{{ index + 1 }}</span>
              <RouterLink :to="{name: 'chapter_edit', params: {novel_id: novelId, chapter_id: ch.id}}" class="flex-1 basis-[200px] min-w-[160px] font-newsreader text-[17px] font-medium text-[#101323] hover:text-[#3138B0]">{{ ch.title || "Sans titre" }}</RouterLink>
              <span class="flex-none px-2.5 py-1 rounded-full font-plexmono text-[11px] tracking-wider uppercase" :class="ch.status === 'published' ? 'bg-[#E9EAF7] text-[#3138B0]' : 'bg-[#EDEFF4] text-[#555D75]'">{{ ch.status === 'published' ? 'Publié' : 'En cours' }}</span>
              <div class="flex-none flex gap-1.5">
                <RouterLink :to="{name: 'chapter_edit', params: {novel_id: novelId, chapter_id: ch.id}}" class="flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-[#D8DBE6] bg-white text-[#555D75] hover:border-[#3138B0] hover:text-[#3138B0]"><iconify-icon icon="tabler:pencil" class="text-[16px]"></iconify-icon></RouterLink>
                <button type="button" class="flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-[#D8DBE6] bg-white text-[#555D75] hover:border-[#B9BECD] hover:text-[#101323]" @click="deletingChapterId = ch.id"><iconify-icon icon="tabler:trash" class="text-[16px]"></iconify-icon></button>
              </div>
            </div>
          </div>
        </section>

        <section v-if="novelId" class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Supprimer le roman</h2>
          <p class="text-[15px] leading-relaxed text-[#555D75] mt-2.5 max-w-[58ch]">Supprime le roman et tous ses chapitres, définitivement.</p>
          <button type="button" class="mt-5 px-5 py-3 rounded-lg border border-[#E3C9C9] bg-white text-[15px] font-semibold text-[#9B2C2C] hover:bg-[#FCF3F3] hover:border-[#D9A9A9]" @click="deletingNovel = true">Supprimer définitivement</button>
        </section>
      </div>

      <aside class="flex-[1_1_300px] min-w-[260px] flex flex-col gap-4 sticky top-[80px]">

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Aperçu dans la librairie</span>
          <div class="flex gap-3.5 mt-4">
            <span class="flex-none w-[62px] aspect-[2/3] rounded-lg border border-[#EADFCB] bg-[#F0EBE0] bg-cover bg-center block" :style="coverPreview ? {backgroundImage: `url(${coverPreview})`} : {}"></span>
            <div class="flex-1 min-w-0">
              <span class="block font-sora text-[17px] font-semibold tracking-[-0.02em] leading-tight">{{ novel.title || "Titre du roman" }}</span>
              <span class="block text-[13px] text-[#555D75] mt-1.5">{{ novelId ? (chapters ? chapters.length : 0) + " chapitres" : "aucun chapitre" }}</span>
              <span class="flex flex-wrap gap-1.5 mt-2.5">
                <span class="px-2.5 py-1 rounded-full bg-[#F7E3C2] text-[#7A5313] text-[12px] font-semibold">{{ novel.categories[0] ? novel.categories[0].name : "Sans catégorie" }}</span>
                <span class="px-2.5 py-1 rounded-full bg-[#E9EAF7] text-[#3138B0] text-[12px] font-semibold">{{ novel.status === 'published' ? 'Publié' : 'Non publié' }}</span>
              </span>
            </div>
          </div>
          <p class="font-newsreader text-[15px] leading-relaxed text-[#3A4260] mt-3.5">{{ novel.resume ? novel.resume.slice(0, 140) + (novel.resume.length > 140 ? '…' : '') : "Le résumé apparaîtra ici." }}</p>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-base font-semibold">{{ novelId ? "État de la fiche" : "Pour créer le roman" }}</h2>
          <div class="flex flex-col gap-3 mt-4">
            <div v-for="c in checklist" :key="c.label" class="flex items-start gap-2.5">
              <iconify-icon :icon="c.ok ? 'tabler:circle-check-filled' : 'tabler:circle'" class="text-[19px] flex-none mt-px" :class="c.ok ? 'text-[#3138B0]' : 'text-[#B9BECD]'"></iconify-icon>
              <span class="flex-1 min-w-0">
                <span class="block text-sm font-semibold" :class="c.ok ? 'text-[#101323]' : 'text-[#555D75]'">{{ c.label }}</span>
                <span class="block text-[13px] leading-snug text-[#6B7286] mt-0.5">{{ c.note }}</span>
              </span>
            </div>
          </div>
        </section>

        <section v-if="novelId" class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-base font-semibold">Statistiques</h2>
          <dl class="mt-4 grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));">
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">J'aime</dt>
              <dd class="mt-1.5 font-sora text-xl font-semibold tracking-[-0.02em]">{{ novel.likesCount ?? 0 }}</dd>
            </div>
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Commentaires</dt>
              <dd class="mt-1.5 font-sora text-xl font-semibold tracking-[-0.02em]">{{ novel.commentsCount ?? 0 }}</dd>
            </div>
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Achats</dt>
              <dd class="mt-1.5 font-sora text-xl font-semibold tracking-[-0.02em]">{{ novel.ordersCount ?? 0 }}</dd>
            </div>
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Chapitres</dt>
              <dd class="mt-1.5 font-sora text-xl font-semibold tracking-[-0.02em]">{{ chapters ? chapters.length : 0 }}</dd>
            </div>
          </dl>
        </section>
      </aside>
    </main>

    <div v-if="deletingChapterId" class="fixed inset-0 z-40 bg-[#101323]/50 flex items-center justify-center px-4" @click.self="deletingChapterId = null">
      <div class="w-full max-w-[420px] bg-white rounded-2xl p-6">
        <h3 class="font-sora text-lg font-semibold text-center pb-3.5 border-b border-[#EEEFF4]">Supprimer le chapitre</h3>
        <p class="text-[#9B2C2C] font-semibold mt-4">Cette action est irréversible.</p>
        <p class="text-[#555D75] mt-1.5">Le chapitre et toutes ses pages seront supprimés.</p>
        <div class="flex justify-center gap-3 mt-5">
          <button type="button" class="px-5 py-2.5 rounded-lg border border-[#DCDEE8] bg-white text-sm font-semibold hover:border-[#3138B0]" @click="deletingChapterId = null">Annuler</button>
          <button type="button" class="px-5 py-2.5 rounded-lg border-0 bg-[#9B2C2C] text-white text-sm font-semibold hover:bg-[#7C2222]" @click="confirmDeleteChapter">Supprimer</button>
        </div>
      </div>
    </div>

    <div v-if="deletingNovel" class="fixed inset-0 z-40 bg-[#101323]/50 flex items-center justify-center px-4" @click.self="deletingNovel = false">
      <div class="w-full max-w-[420px] bg-white rounded-2xl p-6">
        <h3 class="font-sora text-lg font-semibold text-center pb-3.5 border-b border-[#EEEFF4]">Supprimer le roman</h3>
        <p class="text-[#9B2C2C] font-semibold mt-4">Cette action est irréversible.</p>
        <p class="text-[#555D75] mt-1.5">Êtes-vous sûr de vouloir supprimer ce roman et tous ses chapitres ?</p>
        <div class="flex justify-center gap-3 mt-5">
          <button type="button" class="px-5 py-2.5 rounded-lg border border-[#DCDEE8] bg-white text-sm font-semibold hover:border-[#3138B0]" @click="deletingNovel = false">Annuler</button>
          <button type="button" class="px-5 py-2.5 rounded-lg border-0 bg-[#9B2C2C] text-white text-sm font-semibold hover:bg-[#7C2222]" @click="confirmDeleteNovel">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuth } from "@/stores/auth.js";

const BACK_URL = import.meta.env.VITE_BACK_URL;
const authStore = useAuth();
const { me } = authStore;

const router = useRouter();
const route = useRoute();

const errors = ref({ general: null });
const saving = ref(false);
const saved = ref(false);

const novel = ref({
  title: "",
  resume: "",
  price: 0,
  status: "unpublished",
  image: null,
  categories: [],
  slug: null,
  likesCount: 0,
  commentsCount: 0,
  ordersCount: 0,
});
watch(novel, () => { saved.value = false; }, { deep: true });
const coverPreview = ref(null);
const chapters = ref(null);

const statusOptions = [
  { value: "unpublished", label: "Non publié" },
  { value: "published", label: "Publié" },
];

let novelId = null;
if (route.params.id) {
  novelId = route.params.id;
  let authorId = null;
  axios.get("novel/" + novelId).then(async (res) => {
    authorId = res.data.author.id;
    me().then((resjwt) => {
      if (resjwt.data.id === authorId) {
        novel.value.title = res.data.title;
        novel.value.resume = res.data.resume;
        novel.value.price = res.data.price;
        novel.value.status = res.data.status;
        novel.value.categories = res.data.categories;
        novel.value.slug = res.data.slug;
        novel.value.likesCount = res.data.likesCount;
        novel.value.commentsCount = res.data.commentsCount;
        novel.value.ordersCount = res.data.ordersCount;
        chapters.value = res.data.chapters ?? [];
        if (res.data.cover) coverPreview.value = BACK_URL + res.data.cover.filepath;
      } else {
        novelId = null;
        router.push({ name: "author_novel" });
      }
    });
  });
}
const categories = ref([]);
axios.get("category").then((res) => {
  categories.value = res.data;
}).catch((e) => console.log(e));

function onFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  novel.value.image = file;
  coverPreview.value = URL.createObjectURL(file);
}

function onCategorySelect(event) {
  const categoryId = parseInt(event.target.value);
  const category = categories.value.find((category) => category.id === categoryId);
  if (category && !novel.value.categories.some((c) => c.id === category.id)) {
    novel.value.categories.push(category);
  }
  event.target.value = "";
}

function removeCategory(index) {
  novel.value.categories.splice(index, 1);
}

function buildFormData() {
  const formData = new FormData();
  formData.append("title", novel.value.title);
  formData.append("resume", novel.value.resume);
  formData.append("price", novel.value.price);
  formData.append("status", novel.value.status);
  if (novel.value.image) formData.append("cover", novel.value.image);
  novel.value.categories.forEach((category) => {
    formData.append("category[]", category.id);
  });
  return formData;
}

function createNovel() {
  if (novel.value.title === "") {
    errors.value.general = "Le titre est requis";
    return;
  }
  if (novel.value.price < 1) {
    errors.value.general = "Le prix doit être supérieur à 0";
    return;
  }
  errors.value.general = null;
  saving.value = true;
  axios.post("novel/", buildFormData()).then((res) => {
    if (res.status === 201) {
      router.push({ name: "account" });
    }
  }).catch((e) => {
    errors.value.general = "La création a échoué.";
    console.log(e);
  }).finally(() => {
    saving.value = false;
  });
}

function updateNovel() {
  saving.value = true;
  errors.value.general = null;
  saved.value = false;
  axios.post("novel/" + novelId, buildFormData()).then(() => {
    saved.value = true;
  }).catch((e) => {
    errors.value.general = "L'enregistrement a échoué.";
    console.log(e);
  }).finally(() => {
    saving.value = false;
  });
}

function checkTitleLenght() {
  errors.value.general = novel.value.title.length < 1 ? "Le titre doit comporter au moins 1 caractère" : null;
}

function checkPrice() {
  errors.value.general = novel.value.price < 0 ? "Le prix doit être positif" : null;
}

const publishedChaptersCount = computed(() => (chapters.value ?? []).filter((c) => c.status === "published").length);
const draftChaptersCount = computed(() => (chapters.value ?? []).filter((c) => c.status !== "published").length);

const checklist = computed(() => {
  const titleOk = novel.value.title.trim().length >= 3;
  const resumeOk = novel.value.resume.trim().length >= 60;
  const categoryOk = novel.value.categories.length > 0;
  const coverOk = !!coverPreview.value;
  const chapter1Ok = !!(chapters.value && chapters.value[0] && chapters.value[0].status === "published");
  return [
    { label: "Un titre", ok: titleOk, note: titleOk ? "Modifiable à tout moment" : "Trois caractères au minimum" },
    { label: "Un résumé", ok: resumeOk, note: novel.value.resume.length + " / 500 caractères" },
    { label: "Une catégorie", ok: categoryOk, note: categoryOk ? novel.value.categories.map((c) => c.name).join(" · ") : "Aide au classement dans la librairie" },
    { label: "Une couverture", ok: coverOk, note: coverOk ? "1200×1800, remplaçable" : "Facultative, mais trois fois plus de clics" },
    ...(novelId ? [{ label: "Le chapitre 1", ok: chapter1Ok, note: chapter1Ok ? "Publié" : "À publier pour que le roman soit lisible" }] : []),
  ];
});

const deletingChapterId = ref(null);
function confirmDeleteChapter() {
  const id = deletingChapterId.value;
  axios.delete("chapter/" + id).then(() => {
    chapters.value = chapters.value.filter((c) => c.id !== id);
    deletingChapterId.value = null;
  }).catch((e) => console.log(e));
}

const deletingNovel = ref(false);
function confirmDeleteNovel() {
  axios.delete("novel/" + novelId).then(() => {
    router.push({ name: "account" });
  }).catch((e) => console.log(e));
}
</script>
