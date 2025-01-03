<template>
  <div v-if="novel" class="relative">
    <div class="read_book_page">
      <div class="relative">
        <img
          v-if="novel && novel.banner"
          class="absolute w-full h-full object-cover"
          :src="novel.banner ? BACK_URL + novel.banner.filepath : ''"
          alt=""
        />
        <div class="absolute w-full h-full bg-novelize-dark/50"></div>
        <div class="absolute w-full h-full bg-darklayer opacity-20"></div>
        <div
          class="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-10 max-w-site h-full py-5 md:py-20 px-2 mx-auto"
        >
          <img
            v-if="novel.cover?.filepath"
            class="w-60 h-80 rounded-lg object-cover"
            :src="novel.cover ? BACK_URL + novel.cover.filepath : ''"
            alt="novel cover"
          />
          <div v-if="novel" :class="'flex flex-1 flex-col'">
            <div>
              <div
                class="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div class="flex items-center">
                  <h1 class="text-2xl lg:text-3xl font-semibold">
                    {{ novel.title }}
                  </h1>
                  <router-link
                    v-if="novel.isAuthor"
                    :to="{ name: 'author_novel', params: { id: novel.id } }"
                  >
                    <div
                      class="hidden md:flex items-center justify-center cursor-pointer bg-novelize-primary hover:[&>*]:text-novelize-primarylight w-8 h-8 rounded-full mx-4"
                    >
                      <i class="fa-solid fa-pen text-white"></i>
                    </div>
                  </router-link>
                </div>
                <div class="flex items-center gap-4 my-2">
                  <router-link
                    v-if="novel.isAuthor"
                    :to="{ name: 'author_novel', params: { id: novel.id } }"
                  >
                    <div
                      class="flex md:hidden items-center justify-center cursor-pointer bg-novelize-primary hover:[&>*]:text-novelize-primarylight w-8 h-8 rounded-full"
                    >
                      <i class="fa-solid fa-pen text-white"></i>
                    </div>
                  </router-link>
                  <div class="flex items-center gap-4" v-if="likesUpdated">
                    <p class="text-base md:text-lg font-bold">
                      {{ likesCount }}
                    </p>
                    <i
                      class="fa-heart text-2xl md:text-3xl cursor-pointer"
                      :class="{ 'fa-regular': !isLiked, 'fa-solid text-red-600': isLiked }"
                      @click="like"
                    ></i>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-zinc-200 my-2 md:my-6">
                  {{
                    novel.resume.length < 300 || showMore
                      ? novel.resume.slice(0, 500)
                      : novel.resume.slice(0, 300) + "..."
                  }}
                  <span
                    v-if="novel.resume.length > 300"
                    class="text-novelize-primary hover:text-novelize-primarylight cursor-pointer font-semibold"
                    @click="showMoreResume"
                    >{{ showMore ? "Afficher moins" : "Afficher plus" }}</span
                  >
                </p>
              </div>
              <Author :author="novel.author" />
            </div>

            <div
              class="flex justify-end md:block my-4"
              v-if="!isOrderSuccess && !novel.userBought && !novel.isAuthor"
            >
              <Button label="Acheter" @click="buyModal"></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-site px-2 md:px-20 mx-auto my-4">
      <div class="flex justify-between items-center my-4">
        <h1 class="text-2xl py-2">Chapitres</h1>
        <div v-if="novel.isAuthor">
          <Button
            label="Ajouter un chapitre"
            :to="{ name: 'chapter_edit', params: { novel_id: novel.id } }"
          ></Button>
        </div>
      </div>
      <div class="">
        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="(chapter, index) in novel.isAuthor
              ? novel.chapters
              : novel.publishedChapters"
            :key="index"
            class="w-full text-xs text-zinc-300 bg-novelize-darklight rounded-lg py-2 px-2"
          >
            <div
              v-if="
                index == 0 ||
                novel.userBought ||
                novel.isAuthor ||
                isOrderSuccess
              "
              class="flex justify-between items-center"
            >
              <p>
                Chapter {{ index + 1 }} :
                <router-link
                  :to="{
                    name: 'read_page',
                    params: { slug: novel.slug, chapter_id: chapter.id },
                  }"
                  class="text-sm text-white font-semibold hover:text-novelize-primary"
                  >{{ chapter.title }}
                </router-link>
              </p>
              <router-link
                v-if="novel.isAuthor"
                :to="{
                  name: 'chapter_edit',
                  params: { novel_id: novel.id, chapter_id: chapter.id },
                }"
              >
                <i
                  class="fa-solid fa-pen text-white hover:text-novelize-primary cursor-pointer"
                ></i>
              </router-link>
            </div>
            <div v-else class="flex justify-between items-center">
              <p>
                Chapitre {{ index + 1 }} :
                <span
                  class="text-sm text-white font-semibold hover:text-zinc-500"
                  >{{ chapter.title }}
                </span>
              </p>
              <div>
                <i class="fa-solid fa-lock text-white hover:text-zinc-500"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-site px-2 mx-auto my-4">
      <h1 class="text-base font-semibold">Commentaires</h1>
      <div v-if="token">
        <div class="flex items-center gap-4 my-4">
          <div class="w-12 h-12">
            <img
              v-if="user.avatar"
              class="w-full h-full rounded-full object-cover object-top"
              :src="BACK_URL + user.avatar.filepath"
              alt="user avatar"
            />
            <div
              v-else
              class="flex items-center justify-center font-semibold text-lg w-full h-full bg-novelize-primary rounded-full"
            >
              <span>
                {{
                  user.username
                    ? user.username.slice(0, 1).toUpperCase()
                    : user.name.slice(0, 1).toUpperCase()
                }}
              </span>
            </div>
          </div>
          <div class="w-full">
            <div>
              <input
                class="w-full bg-novelize-darklight rounded-lg p-2 !text-white"
                v-model="comment"
                type="text"
                name="comment"
                id="comment"
                placeholder="Écrire un commentaire..."
              />
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <Button label="Envoyer" @click="sendComment"></Button>
        </div>
      </div>
      <div>
        <div
          v-for="(comment, index) in novel.comments"
          :key="index"
          class="flex gap-4 my-4"
        >
          <div>
            <div class="w-14 h-14">
              <img
                v-if="comment.user.avatar"
                class="w-full h-full rounded-full object-cover object-top"
                :src="BACK_URL + comment.user.avatar.filepath"
                alt=""
              />
              <div
                v-else
                class="flex items-center justify-center font-semibold text-lg w-full h-full bg-novelize-primary rounded-full"
              >
                <span>
                  {{
                    comment.user.username
                      ? comment.user.username.slice(0, 1).toUpperCase()
                      : comment.user.name.slice(0, 1).toUpperCase()
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="w-full">
            <div>
              <p class="text-zinc-300">{{ comment.user.username }}</p>
              <p
                :class="
                  'overflow-hidden' + (comment.showMore ? ' ' : ' max-h-10 ')
                "
              >
                {{ comment.content }}
              </p>
              <p
                @click="toggleCommentExpand(index)"
                v-if="comment.content.length > 50"
                class="md:hidden text-zinc-300 my-2"
              >
                {{ comment.showMore ? "Afficher moins" : "Afficher plus" }}
              </p>
            </div>
            <div>
              <div class="flex gap-2 text-xs">
                <p
                  v-if="token"
                  class="text-novelize-primary hover:text-novelize-primarylight cursor-pointer"
                  @click="toggleAnswerInput(index)"
                >
                  Répondre
                </p>
                <div
                  v-if="comment.comments && comment.comments.length > 0"
                  class="flex items-center gap-1 text-novelize-primarylight hover:text-novelize-primary cursor-pointer"
                  @click="toggleAnswers(index)"
                >
                  <p
                    class="text-novelize-primarylight hover:text-novelize-primary"
                  >
                    {{ comment.comments.length }} Réponses
                  </p>
                  <i class="fa-sharp fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div class="w-full">
                <div v-if="comment.showAnswerInput">
                  <div class="flex flex-col gap-4 my-4">
                    <div class="flex gap-4">
                      <div class="w-10 h-10">
                        <img
                          v-if="user.avatar"
                          class="w-full h-full rounded-full object-cover object-top"
                          :src="BACK_URL + user.avatar.filepath"
                          alt="user avatar"
                        />
                        <div
                          v-else
                          class="flex items-center justify-center font-semibold text-lg w-full h-full bg-novelize-primary rounded-full"
                        >
                          <span>
                            {{
                              user.username
                                ? user.username.slice(0, 1).toUpperCase()
                                : user.name.slice(0, 1).toUpperCase()
                            }}
                          </span>
                        </div>
                      </div>
                      <input
                        class="w-full bg-novelize-darklight rounded-lg p-2 !text-white"
                        v-model="answer"
                        type="text"
                        name="answer"
                        id="answer"
                        placeholder="Écrire une réponse..."
                      />
                    </div>
                    <div class="flex justify-end">
                      <Button label="Envoyer" @click="sendAnswer(index)"></Button>
                    </div>
                  </div>
                </div>
                <div v-if="comment.showAnswers">
                  <div
                    v-for="(answer, index) in comment.comments"
                    :key="index"
                    class="flex items-center gap-4 my-4"
                  >
                    <div class="w-10 h-10">
                      <img
                        v-if="answer.user.avatar"
                        class="w-full h-full rounded-full object-cover object-top"
                        :src="BACK_URL + answer.user.avatar.filepath"
                        alt="user avatar"
                      />
                      <div
                        v-else
                        class="flex items-center justify-center font-semibold text-lg w-full h-full bg-novelize-primary rounded-full"
                      >
                        <span>
                          {{
                            answer.user.username
                              ? answer.user.username.slice(0, 1).toUpperCase()
                              : answer.user.name.slice(0, 1).toUpperCase()
                          }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p class="text-zinc-300">{{ answer.user.username }}</p>
                        <p>{{ answer.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="toggleBuyingModal"
      class="absolute top-0 w-full h-full m-auto bg-novelize-dark/70 z-40"
    >
      <div class="flex justify-center items-center h-96">
        <div
          class="w-full lg:w-3/6 bg-novelize-darklight rounded-lg mx-2 sm:mx-6 lg:mx-0 px-4 py-2"
        >
          <h3
            class="text-lg text-center text-novelize-primary font-semibold border-b border-b-zinc-500 py-2"
          >
            Acheter le roman
          </h3>
          <div v-if="!isOrderSuccess">
            <div v-if="orderError.length > 0" class="flex bg-red-500/20 text-red-500 rounded-md overflow-hidden space-x-4 my-4">
              <div class="w-1 bg-red-500"></div>
              <div class="py-2">
                <p class="">
                  {{ orderError }}
                </p>
              </div>
            </div>
            <p class="text-center text-zinc-300 py-4">
              Êtes-vous sûr de vouloir acheter ce roman ?
            </p>
            <div class="flex justify-between">
              <div>
                <p class="font-semibold">{{ novel.title }}</p>
                <p class="text-zinc-300">{{ novel.author.name }}</p>
              </div>
              <div class="flex items-center gap-2 my-2">
                <p class="text-novelize-secondary font-semibold">
                  {{ novel.price }}
                </p>
                <div class="scale-75">
                  <CoinIcon />
                </div>
              </div>
            </div>
            <div class="flex justify-center items-center my-2">
              <Button
                label="Annuler"
                @click="toggleBuyingModal = false"
                class="mr-2"
                bgColor="bg-red-700"
              ></Button>
              <Button v-if="!isBuying" label="Acheter" @click="buyNovel"></Button>
              <Button v-else label="Achat en cours..."> </Button>
            </div>
          </div>
          <div v-if="isOrderSuccess">
            <p class="text-center text-zinc-300 py-2">
              Votre commande a été traitée avec succès !
            </p>
            <div class="flex justify-center items-center">
              <Button label="Fermer" @click="toggleBuyingModal = false"></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuth } from "@/stores/auth.js";
import axios from "axios";
import Author from "../../../components/Author.vue";
import CoinIcon from "../../../components/CoinIcon.vue";

const authStore = useAuth();
const { user } = storeToRefs(authStore);
const { me } = authStore;
const token = localStorage.getItem("token");

const novel = ref(null);
const router = useRouter();
const route = useRoute();
const novelSlug = ref(route.params.novel_slug);
const BACK_URL = import.meta.env.VITE_BACK_URL;

const showMore = ref(false);

const toggleBuyingModal = ref(false);
const isBuying = ref(false);
const isOrderSuccess = ref(false);
const orderError = ref("");

const isLiked = ref(false);
const likesCount = ref(0);
const likesUpdated = ref(false);

const comment = ref("");
const answer = ref("");

if (novelSlug.value) {
  axios.get(`novel/bySlug/${novelSlug.value}`).then((res) => {
    novel.value = res.data;

    if (novel.value.status === "unpublished" && !novel.value.isAuthor) {
      router.push({ name: "home" });
    }
    axios.get(`like/count/${novel.value.id}`).then((res) => {
      likesCount.value = res.data.count;
      if (token) {
        axios.get(`like/liked/${novel.value.id}`).then((res) => {
          isLiked.value = res.data.liked;
          likesUpdated.value = true;
        });
      }
    });
  });
}

function like() {
  let obj = {
    novel: novel.value.id,
  };
  axios.post(`like/`, obj).then((res) => {
    if (res.data.response) {
      isLiked.value = false;
      likesCount.value--;
    } else {
      isLiked.value = true;
      likesCount.value++;
    }
  });
}

function showMoreResume() {
  showMore.value = !showMore.value;
}

function buyModal() {
  toggleBuyingModal.value = !toggleBuyingModal.value;
}

function buyNovel() {
  isBuying.value = true;
  const data = {
    novel: novel.value.id,
  };
  axios
    .post("order/", data)
    .then((res) => {
      isOrderSuccess.value = true;
    })
    .catch((err) => {
      console.log(err);
      orderError.value = err.response.data.message;
      isBuying.value = false;
    });
}

function sendComment() {
  if (comment.value === "") {
    return;
  }
  const data = {
    content: comment.value,
    novel: novel.value.id,
  };
  axios
    .post("comment/", data)
    .then((res) => {
      novel.value.comments.unshift(res.data);
      comment.value = "";
    })
    .catch((err) => {
      console.log(err);
    });
}

function sendAnswer(index) {
  if (novel.value.comments[index].answer === "") {
    return;
  }
  const data = {
    novel: novel.value.id,
    content: answer.value,
    parent: novel.value.comments[index].id,
  };
  axios
    .post("comment/", data)
    .then((res) => {
      novel.value.comments[index].comments.unshift(res.data);
      novel.value.comments[index].showAnswerInput = false;
      novel.value.comments[index].showAnswers = true;
      answer.value = "";
    })
    .catch((err) => {
      console.log(err);
    });
}

function toggleCommentExpand(index) {
  novel.value.comments[index].showMore = !novel.value.comments[index].showMore;
}

function toggleAnswers(index) {
  novel.value.comments[index].showAnswers =
    !novel.value.comments[index].showAnswers;
}

function toggleAnswerInput(index) {
  novel.value.comments[index].showAnswerInput =
    !novel.value.comments[index].showAnswerInput;
}
</script>
