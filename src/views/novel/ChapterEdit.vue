<template>
  <div class="min-h-screen bg-[#F3F4F8] font-figtree text-[#101323]">

    <div class="sticky top-0 z-30 bg-[#FFFCF6] border-b border-[#EADFCB]">
      <div class="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3.5">
        <RouterLink :to="{name: 'author_novel', params: {id: novelId}}" class="flex-none flex items-center justify-center w-[38px] h-[38px] rounded-lg border border-[#EADFCB] bg-white text-[#555D75] hover:border-[#E9A23B] hover:text-[#7A5313]">
          <iconify-icon icon="tabler:arrow-left" class="text-[19px]"></iconify-icon>
        </RouterLink>
        <div class="flex-1 basis-[260px] min-w-[200px]">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#7A5313]">{{ kicker }}</span>
          <span class="block font-sora text-[18px] font-semibold tracking-[-0.02em] mt-1">{{ title || "Chapitre sans titre" }}</span>
        </div>
        <div class="flex-none flex flex-wrap gap-2">
          <button type="button" class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#EADFCB] bg-white text-[15px] font-semibold text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]" @click="focus = !focus">
            <iconify-icon :icon="focus ? 'tabler:layout-sidebar-right-expand' : 'tabler:focus-centered'" class="text-[18px]"></iconify-icon>{{ focus ? "Tout afficher" : "Concentration" }}
          </button>
          <RouterLink v-if="chapterId && novel.slug" :to="{name: 'read_page', params: {slug: novel.slug, chapter_id: chapterId}}" class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#EADFCB] bg-white text-[15px] font-semibold text-[#333B54] hover:border-[#E9A23B] hover:text-[#7A5313]">
            <iconify-icon icon="tabler:eye" class="text-[18px]"></iconify-icon>Aperçu
          </RouterLink>
          <button type="button" class="flex items-center gap-2 px-5 py-2.5 rounded-lg border-0 bg-[#3138B0] text-white text-[15px] font-semibold hover:bg-[#232878] disabled:opacity-60" :disabled="saving" @click="chapterId ? updateChapter() : createChapter()">
            <iconify-icon icon="tabler:send" class="text-[18px]"></iconify-icon>{{ saving ? "Enregistrement…" : status === "scheduled" ? "Programmer" : (chapterId ? "Enregistrer les modifications" : "Créer le chapitre") }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 pb-24 flex flex-wrap gap-6 items-start">

      <div class="flex-[100_1_520px] min-w-[300px] flex flex-col gap-4">

        <div v-if="errorMsg" class="text-sm text-[#6B0504] bg-[#FBEAEA] border border-[#F1C7C7] rounded-lg px-3.5 py-2.5">{{ errorMsg }}</div>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <label class="block">
            <span class="flex justify-between gap-3 font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">
              <span>Titre du chapitre</span><span>{{ title.length }} / 255</span>
            </span>
            <input v-model="title" type="text" placeholder="Un titre, même provisoire" class="w-full mt-2 h-[46px] px-3.5 border border-[#DCDEE8] rounded-lg bg-white font-newsreader text-[20px] font-medium">
          </label>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Texte du chapitre</h2>
          <div class="chapter-editor mt-4">
            <QuillEditor
              v-model:content="html"
              ref="quillRef"
              theme="snow"
              contentType="html"
              :toolbar="toolbar"
              placeholder="Écrivez le chapitre…"
              @textChange="onEditorChange"
            />
          </div>
        </section>

        <section v-if="chapterId" class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-lg font-semibold tracking-[-0.02em]">Supprimer le chapitre</h2>
          <p class="text-[15px] leading-relaxed text-[#555D75] mt-2.5 max-w-[58ch]">Supprime le chapitre, définitivement.</p>
          <button type="button" class="mt-5 px-5 py-3 rounded-lg border border-[#E3C9C9] bg-white text-[15px] font-semibold text-[#9B2C2C] hover:bg-[#FCF3F3] hover:border-[#D9A9A9]" @click="deletingChapter = true">Supprimer le chapitre</button>
        </section>
      </div>

      <aside v-if="!focus" class="flex-[1_1_300px] min-w-[260px] flex flex-col gap-4 sticky top-[80px]">

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Ce chapitre</span>
          <dl class="mt-4 grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));">
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Mots</dt>
              <dd class="mt-1.5 font-sora text-xl font-semibold tracking-[-0.02em]">{{ fmt(wordCount) }}</dd>
            </div>
            <div>
              <dt class="font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Lecture</dt>
              <dd class="mt-1.5 font-sora text-xl font-semibold tracking-[-0.02em]">{{ readMinutes }} min</dd>
            </div>
          </dl>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-base font-semibold">Parution</h2>
          <div class="flex flex-wrap gap-1 mt-3.5 p-1 bg-[#F3F4F8] border border-[#E2E4EC] rounded-xl">
            <button v-for="s in statusOptions" :key="s.value" type="button" class="flex-auto px-1.5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap" :class="status === s.value ? 'bg-white border border-[#DCDEE8] text-[#101323]' : 'border border-transparent text-[#555D75]'" @click="selectStatus(s.value)">{{ s.label }}</button>
          </div>
          <div v-if="status === 'scheduled'" class="flex flex-wrap gap-3 mt-4">
            <label class="flex-1 basis-[130px] min-w-[120px]">
              <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Date</span>
              <input v-model="publishDate" type="date" :min="todayIso" class="w-full mt-2 h-[44px] px-2.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
            </label>
            <label class="flex-1 basis-[100px] min-w-[100px]">
              <span class="block font-plexmono text-[11px] tracking-wider uppercase text-[#6B7286]">Heure</span>
              <input v-model="publishTime" type="time" class="w-full mt-2 h-[44px] px-2.5 border border-[#DCDEE8] rounded-lg bg-white text-[15px]">
            </label>
          </div>
          <div class="flex items-start gap-3 mt-4 p-3.5 border border-[#EDEFF4] rounded-xl bg-[#F8F9FC]">
            <iconify-icon icon="tabler:calendar-event" class="text-[19px] text-[#3138B0] flex-none mt-0.5"></iconify-icon>
            <p class="text-sm leading-relaxed text-[#555D75]">{{ statusNote }}</p>
          </div>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-base font-semibold">Prix</h2>
          <p class="text-sm leading-relaxed text-[#555D75] mt-2">{{ novel.price ? "Le roman coûte " + novel.price + " pièces, le premier chapitre du roman est gratuit." : "" }}</p>
          <RouterLink :to="{name: 'author_novel', params: {id: novelId}}" class="inline-block text-sm font-semibold mt-2.5 text-[#3138B0] hover:text-[#232878]">Changer le prix du roman</RouterLink>
        </section>

        <section class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="font-sora text-base font-semibold">{{ chapterId ? "Avant de republier" : "Avant de publier" }}</h2>
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

        <section v-if="neighbours.length" class="bg-white border border-[#E2E4EC] rounded-2xl p-6">
          <h2 class="flex items-center gap-2 font-sora text-base font-semibold">
            <iconify-icon icon="tabler:list-numbers" class="text-[19px] text-[#3138B0]"></iconify-icon>Autour de ce chapitre
          </h2>
          <div class="flex flex-col mt-3">
            <RouterLink v-for="n in neighbours" :key="n.id" :to="{name: 'chapter_edit', params: {novel_id: novelId, chapter_id: n.id}}" class="flex items-center gap-3 py-3 border-b border-[#EDEFF4] last:border-b-0 text-inherit hover:text-[#3138B0]">
              <span class="flex-none w-[24px] font-plexmono text-[13px] text-[#868DA3]">{{ n.num }}</span>
              <span class="flex-1 min-w-0">
                <span class="block font-newsreader text-[16px] font-medium leading-tight">{{ n.title || "Sans titre" }}</span>
                <span class="block text-[13px] text-[#6B7286] mt-1">{{ n.status === 'published' ? 'Publié' : n.status === 'scheduled' ? `Programmé · ${formatPublishAt(n.publishAt)}` : 'En cours' }}</span>
              </span>
            </RouterLink>
          </div>
        </section>
      </aside>
    </main>

    <div v-if="deletingChapter" class="fixed inset-0 z-40 bg-[#101323]/50 flex items-center justify-center px-4" @click.self="deletingChapter = false">
      <div class="w-full max-w-[420px] bg-white rounded-2xl p-6">
        <h3 class="font-sora text-lg font-semibold text-center pb-3.5 border-b border-[#EEEFF4]">Supprimer le chapitre</h3>
        <p class="text-[#9B2C2C] font-semibold mt-4">Cette action est irréversible.</p>
        <p class="text-[#555D75] mt-1.5">Le texte de ce chapitre sera perdu.</p>
        <div class="flex justify-center gap-3 mt-5">
          <button type="button" class="px-5 py-2.5 rounded-lg border border-[#DCDEE8] bg-white text-sm font-semibold hover:border-[#3138B0]" @click="deletingChapter = false">Annuler</button>
          <button type="button" class="px-5 py-2.5 rounded-lg border-0 bg-[#9B2C2C] text-white text-sm font-semibold hover:bg-[#7C2222]" @click="confirmDeleteChapter">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import axios from "axios";
import { formatPublishAt } from "@/utils/rhythm.js";

const route = useRoute();
const router = useRouter();

const novelId = route.params.novel_id;
const chapterId = route.params.chapter_id ?? null;

const title = ref("");
const status = ref("in_progress");
const html = ref("");
const content = ref("");
const quillRef = ref(null);
const saving = ref(false);
const errorMsg = ref("");
const focus = ref(false);

const toolbar = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] }],
];

const statusOptions = [
  { value: "in_progress", label: "Brouillon" },
  { value: "scheduled", label: "Programmé" },
  { value: "published", label: "Publié" },
];

const publishDate = ref("");
const publishTime = ref("07:00");

function localIsoDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
const todayIso = localIsoDate(new Date());

function selectStatus(value) {
  status.value = value;
  if (value === "scheduled" && !publishDate.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    publishDate.value = localIsoDate(tomorrow);
  }
}

const statusNote = computed(() => {
  if (status.value === "scheduled") {
    if (!publishDate.value || !publishTime.value) return "Choisissez la date et l'heure de parution.";
    const date = new Date(`${publishDate.value}T${publishTime.value}`);
    return `Le chapitre paraîtra le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} à ${publishTime.value}. D'ici là, il reste invisible pour les lecteurs.`;
  }
  if (status.value === "published") return "Visible par les lecteurs (le chapitre 1 est gratuit, les suivants nécessitent l'achat du roman).";
  return "Le brouillon n'est visible que par vous.";
});

const novel = ref({ title: "", slug: null, price: null, chapters: [] });

axios.get("novel/" + novelId).then((res) => {
  novel.value.title = res.data.title;
  novel.value.slug = res.data.slug;
  novel.value.price = res.data.price;
  novel.value.chapters = res.data.chapters ?? [];
}).catch((e) => console.log(e));

if (chapterId) {
  axios.get("chapter/" + chapterId).then((res) => {
    title.value = res.data.title;
    status.value = res.data.status;
    if (res.data.publishAt) {
      const [date, time] = res.data.publishAt.split(" ");
      publishDate.value = date;
      publishTime.value = time.slice(0, 5);
    }
    html.value = res.data.html || "";
    content.value = res.data.content || "";
  }).catch((e) => console.log(e));
}

function onEditorChange() {
  if (!quillRef.value) return;
  content.value = quillRef.value.getText().trim();
}

const kicker = computed(() => {
  const position = novel.value.chapters.findIndex((c) => c.id == chapterId);
  const num = position >= 0 ? "Chapitre " + (position + 1) + " · " : chapterId ? "" : "Nouveau chapitre · ";
  return num + (novel.value.title || "");
});

const wordCount = computed(() => (content.value.trim() ? content.value.trim().split(/\s+/).length : 0));
const readMinutes = computed(() => Math.max(1, Math.round(wordCount.value / 200)));
function fmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const checklist = computed(() => {
  const titleOk = title.value.trim().length >= 3;
  const hasText = wordCount.value > 0;
  const lengthOk = wordCount.value >= 300;
  return [
    { label: "Un titre", ok: titleOk, note: titleOk ? "Modifiable après publication" : "Trois caractères au minimum" },
    { label: "Du texte", ok: hasText, note: hasText ? fmt(wordCount.value) + " mots" : "Écrivez le chapitre ci-dessus" },
    { label: "Une longueur confortable", ok: lengthOk, note: fmt(wordCount.value) + " mots pour l'instant" },
  ];
});

const neighbours = computed(() => {
  if (!chapterId) return [];
  const list = novel.value.chapters;
  const index = list.findIndex((c) => c.id == chapterId);
  if (index === -1) return [];
  const result = [];
  if (index > 0) result.push({ ...list[index - 1], num: index });
  if (index < list.length - 1) result.push({ ...list[index + 1], num: index + 2 });
  return result;
});

function buildPayload() {
  return {
    title: title.value,
    status: status.value,
    novel: novelId,
    content: content.value,
    html: html.value,
    publishAt: status.value === "scheduled" ? `${publishDate.value}T${publishTime.value}` : null,
  };
}

function createChapter() {
  if (!title.value.trim()) {
    errorMsg.value = "Le titre est requis.";
    return;
  }
  errorMsg.value = "";
  saving.value = true;
  axios.post("chapter", buildPayload()).then((res) => {
    router.push({ name: "chapter_edit", params: { novel_id: novelId, chapter_id: res.data.id } });
  }).catch((e) => {
    errorMsg.value = e.response?.data?.error ?? "La création a échoué.";
    console.log(e);
  }).finally(() => {
    saving.value = false;
  });
}

function updateChapter() {
  saving.value = true;
  axios.put("chapter/" + chapterId, buildPayload()).then(() => {
    errorMsg.value = "";
  }).catch((e) => {
    errorMsg.value = e.response?.data?.error ?? "L'enregistrement a échoué.";
    console.log(e);
  }).finally(() => {
    saving.value = false;
  });
}

const deletingChapter = ref(false);
function confirmDeleteChapter() {
  axios.delete("chapter/" + chapterId).then(() => {
    router.push({ name: "author_novel", params: { id: novelId } });
  }).catch((e) => console.log(e));
}
</script>

<style>
.chapter-editor .ql-toolbar.ql-snow {
  border: 1px solid #DCDEE8;
  border-radius: 10px 10px 0 0;
  background: #F8F9FC;
}
.chapter-editor .ql-container.ql-snow {
  border: 1px solid #DCDEE8;
  border-top: 0;
  border-radius: 0 0 10px 10px;
  min-height: 420px;
  font-family: "Newsreader", serif;
  font-size: 17px;
  line-height: 1.7;
  background: #FFFCF6;
}
.chapter-editor .ql-editor.ql-blank::before {
  color: #868DA3;
  font-style: normal;
}
</style>
