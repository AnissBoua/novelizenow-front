<template>
  <div class="read_book_page">
    <div class="relative">
      <img v-if="novel && novel.banner" class="absolute w-full h-full object-cover" :src="BACK_URL + novel.banner.filepath" alt="">
      <div class="absolute w-full h-full bg-novelize-dark/50"></div>
      <div class="absolute w-full h-full bg-darklayer opacity-20"></div>
      <div class="relative z-10 grid grid-cols-12 h-full py-20 ">
        <img v-if="novel.cover.filepath" class="col-start-3 col-span-2 w-60 h-80 rounded-lg object-cover" :src="BACK_URL + novel.cover.filepath" alt="novel cover"/>
        <div v-if="novel" :class="(novel.cover.filepath ? 'col-start-5' : 'col-start-4') + ' col-span-6'">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <h1 class="text-3xl font-semibold">{{ novel.title }}</h1>
              <router-link v-if="isAuthor" :to="{ name: 'author_novel', params: { id: novel.id }}">
                <div class="flex items-center justify-center cursor-pointer bg-novelize-primary hover:[&>*]:text-novelize-primarylight w-8 h-8 rounded-full mx-4"><i class="fa-solid fa-pen text-white "></i></div>
              </router-link>
            </div>
            <div class="flex items-center gap-4" v-if="likesUpdated"><p class="text-lg font-bold">{{likesCount}}</p> <i class="fa-heart text-3xl cursor-pointer" :class="{'fa-regular': !isLiked, 'fa-solid': isLiked}" @click="like"></i></div>
          </div>
          <div>
            <p class="text-zinc-200 my-6">
              {{ novel.resume.length < 300 || showMore ? novel.resume.slice(0, 700) :  novel.resume.slice(0, 300) + '...' }}
              <span v-if="novel.resume.length > 300" class="text-novelize-primary hover:text-novelize-primarylight cursor-pointer font-semibold" @click="showMoreResume">{{ showMore ? 'Show less' : 'Show more'}}</span>
            </p>
          </div>
          <Author 
          :name="novel.author.name"
          :lastname="novel.author.lastname"/>
        </div>
      </div>
    </div>
  </div>
  <div class="w-1/2 mx-auto my-4">
    <div class="flex justify-between items-center my-4">
      <h1 class="text-2xl py-2">Chapters</h1>
      <Button 
      label="Add chapter"
      :to="{ name: 'chapter_edit', params: { novel_id: novel.id }}"
      ></Button>
    </div>
    <div class="">
      <div class="grid grid-cols-2 gap-4">
          <div v-for="(chapter, index) in ( isAuthor ? novel.chapters : novel.publishedChapters)" :key="index" class="w-full text-xs text-zinc-300 bg-novelize-darklight rounded-lg py-2 px-2">
            <div class="flex justify-between items-center">
              <p>Chapter {{index + 1}} :
                <router-link :to="{ name: 'read_page', params: { slug: novel.slug, chapter_id: chapter.id }}" class="text-sm text-white font-semibold hover:text-novelize-primary">{{ chapter.title }}
                </router-link>
              </p>
              <router-link  :to="{ name: 'chapter_edit', params: { novel_id: novel.id, chapter_id: chapter.id }}">
                <i class="fa-solid fa-pen text-white hover:text-novelize-primary cursor-pointer"></i>
              </router-link>
            </div> 
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import {useAuth} from "@/stores/auth.js";
import axios from "axios";
import Author from "../../../components/Author.vue";

const authStore = useAuth();
const { me } = authStore;


const novel = ref(null);
const route = useRoute();
const novelSlug = ref(route.params.novel_slug);
const BACK_URL = import.meta.env.VITE_BACK_URL;

const showMore = ref(false);

const isAuthor = ref(null);

const isLiked = ref(false)
const likesCount = ref(0);
const likesUpdated = ref(false);



if (novelSlug.value) {
  axios.get(`novel/bySlug/${novelSlug.value}`).then((res) => {
    novel.value = res.data;
    console.log(novel.value);
    me().then((res) => {
      isAuthor.value = res.data.id === novel.value.author.id;
    });
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
</script>