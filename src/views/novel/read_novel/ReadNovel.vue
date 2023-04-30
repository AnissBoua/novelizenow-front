<template>
  <div v-if="novel" class="relative">
    <div class="read_book_page">
      <div class="relative">
        <img v-if="novel && novel.banner" class="absolute w-full h-full object-cover" :src="BACK_URL + novel.banner.filepath" alt="">
        <div class="absolute w-full h-full bg-novelize-dark/50"></div>
        <div class="absolute w-full h-full bg-darklayer opacity-20"></div>
        <div class="relative z-10 grid grid-cols-12 h-full py-20 ">
          <img v-if="novel.cover.filepath" class="col-start-3 col-span-2 w-60 h-80 rounded-lg object-cover" :src="BACK_URL + novel.cover.filepath" alt="novel cover"/>
          <div v-if="novel" :class="'flex flex-col ' + (novel.cover.filepath ? 'col-start-5' : 'col-start-4') + ' col-span-6'">
            <div>
              <div class="flex items-center justify-between">
            <div class="flex items-center">
                  <h1 class="text-3xl font-semibold">{{ novel.title }}</h1>
                  <router-link v-if="novel.isAuthor" :to="{ name: 'author_novel', params: { id: novel.id }}">
                    <div class="flex items-center justify-center cursor-pointer bg-novelize-primary hover:[&>*]:text-novelize-primarylight w-8 h-8 rounded-full mx-4"><i class="fa-solid fa-pen text-white "></i></div>
                  </router-link>
                </div>
                <div class="flex items-center gap-4" v-if="likesUpdated"><p class="text-lg font-bold">{{likesCount}}</p> <i class="fa-heart text-3xl cursor-pointer" :class="{'fa-regular': !isLiked, 'fa-solid': isLiked}" @click="like"></i></div>
          </div>
          <div>
                <p class="text-zinc-200 my-6">
                  {{ novel.resume.length < 300 || showMore ? novel.resume.slice(0, 500) :  novel.resume.slice(0, 300) + '...' }}
                  <span v-if="novel.resume.length > 300" class="text-novelize-primary hover:text-novelize-primarylight cursor-pointer font-semibold" @click="showMoreResume">{{ showMore ? 'Show less' : 'Show more'}}</span>
                </p>
              </div>
              <Author 
              :name="novel.author.name"
              :lastname="novel.author.lastname"/>
            </div>
            
            <div class="my-4" v-if="!isOrderSuccess && !novel.userBought && !novel.isAuthor">
              <Button
                label="Buy Now"
                @click="buyModal"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 mx-auto my-4">
      <div class="flex justify-between items-center my-4">
        <h1 class="text-2xl py-2">Chapters</h1>
        <div v-if="novel.isAuthor">
          <Button 
          label="Add chapter"
          :to="{ name: 'chapter_edit', params: { novel_id: novel.id }}"
        ></Button>
        </div>
        
      </div>
      <div class="">
        <div class="grid grid-cols-2 gap-4">
            <div v-for="(chapter, index) in ( novel.isAuthor ? novel.chapters : novel.publishedChapters)" :key="index" class="w-full text-xs text-zinc-300 bg-novelize-darklight rounded-lg py-2 px-2">
              <div v-if="index == 0 || novel.userBought || novel.isAuthor || isOrderSuccess" class="flex justify-between items-center">
                <p>Chapter {{index + 1}} :
                  <router-link :to="{ name: 'read_page', params: { slug: novel.slug, chapter_id: chapter.id }}" class="text-sm text-white font-semibold hover:text-novelize-primary">{{ chapter.title }} 
                  </router-link>
                </p>
                <router-link v-if="novel.isAuthor"  :to="{ name: 'chapter_edit', params: { novel_id: novel.id, chapter_id: chapter.id }}">
                  <i class="fa-solid fa-pen text-white hover:text-novelize-primary cursor-pointer"></i>
                </router-link>
              </div> 
              <div v-else class="flex justify-between items-center">
                <p>Chapter {{index + 1}} :
                  <span class="text-sm text-white font-semibold hover:text-zinc-500">{{ chapter.title }}
                  </span>
                </p>
                <div>
                  <i class="fa-solid fa-lock text-white hover:text-zinc-500 "></i>
                </div>
              </div> 
            </div>
        </div>
      </div>
    </div>
    <div v-if="toggleBuyingModal" class="flex justify-center items-center absolute top-0 w-full h-full m-auto bg-novelize-dark/70 z-40">
      <div class="w-1/3 bg-novelize-darklight rounded-lg px-4 py-2">
        <h3 class="text-center font-semibold border-b border-b-zinc-500 py-2">Buying Novel</h3>
        <div v-if="!isOrderSuccess">
          <p class="text-center text-zinc-300 py-2">Are you sure you want to buy this novel ?</p>
          <div class="flex justify-center items-center">
            <Button
              label="Cancel"
              @click="toggleBuyingModal = false"
              class="mr-2"
            ></Button>
            <Button
              v-if="!isBuying"
              label="Buy"
              @click="buyNovel"
            ></Button>
            <Button
              v-else
              label="Buying..."
            >
            </Button>
          </div>
          <p v-if="orderError.length > 0" class="mt-4 mb-2">{{ orderError }}</p>
        </div>
        <div v-if="isOrderSuccess">
          <p class="text-center text-zinc-300 py-2">Your order has been successfully processed !</p>
          <div class="flex justify-center items-center">
            <Button
              label="Ok"
              @click="toggleBuyingModal = false"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {useAuth} from "@/stores/auth.js";
import axios from "axios";
import Author from "../../../components/Author.vue";

const authStore = useAuth();
const { me } = authStore;


const novel = ref(null);
const router = useRouter();
const route = useRoute();
const novelSlug = ref(route.params.novel_slug);
const BACK_URL = import.meta.env.VITE_BACK_URL;

const showMore = ref(false);

const toggleBuyingModal = ref(false);
const isBuying = ref(false);
const isOrderSuccess = ref(false);
const orderError = ref('');

const isLiked = ref(false)
const likesCount = ref(0);
const likesUpdated = ref(false);


if (novelSlug.value) {
  axios.get(`novel/bySlug/${novelSlug.value}`).then((res) => {
    novel.value = res.data;
    console.log(novel.value);

    if (novel.value.status === "unpublished" && !novel.value.isAuthor) {
      router.push({ name: "home" }); 
    }
    axios.get(`like/count/${novel.value.id}`)
      .then((res)=>{
        likesCount.value = res.data.count;
      axios.get(`like/liked/${novel.value.id}`)
        .then((res)=>{
          console.log(res.data.liked);
          isLiked.value = res.data.liked
          likesUpdated.value = true;
        })
      });
  });
}

function like(){
  let obj = {
    "novel": novel.value.id
  }
  axios.post(`like/`, obj).then((res)=>{
    if(res.data.response){
      isLiked.value = false;
      likesCount.value--;
    } else {
      isLiked.value = true;
      likesCount.value++;
    }
  })
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
  axios.post('order/', data).then((res) => {
    isOrderSuccess.value = true;
    console.log(res.data);
  }).catch((err) => {
    console.log(err);
    orderError.value = err.response.data.detail;
    isBuying.value = false;
  })
}
</script>