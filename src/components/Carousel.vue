<template>
  <div>
    <div class="relative h-[25em] sm:h-[40em]">
      <div v-for="(novel, index) in novels" :key="index" :class="'absolute flex items-end w-full h-full opacity-0 transition-all ease-in-out duration-200 ' + (slide === index ? ' opacity-100 ' : '')" >
        <img class="absolute top-0 left-0 w-full h-full  object-cover " :src="novel.banner ? (BACK_URL + novel.banner.filepath) : ''" alt="" />
        <div class="absolute top-0 w-full h-full bg-darklayer opacity-75"></div>
        <div class="relative z-10 flex flex-col w-full sm:w-9/12 md:w-7/12 opacity-100 px-4 sm:px-10 py-20 lg:p-20  transition-all ease-in-out duration-200">
          <div>
            <Category :name="novel.categories[0].name" color="text-novelize-secondary" />
            <RouterLink :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="text-lg hover:text-novelize-primary">{{ novel.title }}</RouterLink>
            <div class="flex items-center gap-10">
              <IconText :text="novel.quantiteChapitre + ' chapters'" color="bg-novelize-primary"/>
              <div class="flex gap-4">
                  <IconText :text="novel.likesCount" color="text-novelize-secondary" icon="fa-solid fa-heart" />
                  <IconText :text="novel.commentsCount" color="text-novelize-secondary" icon="fa-solid fa-comments"/>
              </div>
            </div>
          </div>
          <div class="hidden sm:block w-full min-h-max max-h-20 overflow-hidden my-4">
            <p>{{ novel.resume }}</p>
          </div>
          <div class="hidden sm:block flex justify-between items-center">
            <Author :author="novel.author" />
          </div>
        </div>
      </div>
      <div class="absolute bottom-10 left-0 right-0 z-20 flex w-max mx-auto">
        <div
          @click="setSlide(index)"
          :class="'w-4 h-4 cursor-pointer border border-novelize-primarylight rounded-full mx-1 transition-all ease-in-out duration-500 ' + (slide === index ? ' border border-transparent bg-novelize-primary ' : '')"
          v-for="(novel, index) in novels"
          :key="index"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "./Button.vue";
import Category from "./Category.vue";
import IconText from "./IconText.vue";
import Author from "./Author.vue";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const BACK_URL = import.meta.env.VITE_BACK_URL;
const props = defineProps({
  novels: {
    type: Array,
    default: []
  }
})

const slide = ref(0);

setInterval(() => {
  slide.value = slide.value + 1 > props.novels.length - 1 ? 0 : slide.value + 1;
}, 5000);
    
function setSlide(index) {
  slide.value = index;
}
</script>