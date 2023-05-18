<script setup>
import Carousel from '../components/Carousel.vue';
import Chapter from '../components/Chapter.vue'
import Novel from '../components/Novel.vue';
import NovelReduced from '../components/NovelReduced.vue';
import PopularCategories from '../components/home/PopularCategories.vue';
import NewReleases from '../components/home/NewReleases.vue';

import axios from 'axios';
import { ref } from 'vue';

const carousel = ref([]);
const chapters = ref([]);
const categories = ref([]);
const newNovels = ref([]);

axios.get('/home').then(res => {
  console.log(res.data);
  carousel.value = res.data.carousel;
  chapters.value = res.data.chapters;
  categories.value = res.data.categories;
  newNovels.value = res.data.newNovels;
})


</script>

<template>
  <main>
    <Carousel :novels="carousel"/>
    <div class="flex justify-between md:px-8">
      <div class="w-full lg:w-10/12 mx-auto">
        <div class="bg-neutral-800 md:rounded-lg py-2 px-4 md:my-8">
          <h3 class="text-xl font-semibold my-2">Last chapters</h3>
          <div class="grid grid-cols-1 gap-4 my-4">
            <div class="" v-for="(chapter, i) in chapters" :key="i">
              <Chapter :title="chapter.title" :novel="chapter.novel" :author="chapter.novel.author" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-11/12 lg:px-8 mx-auto">
      <PopularCategories :categories="categories" />
    </div>
    <div class=" px-4 mx-auto">
      <NewReleases :novels="newNovels" />
    </div>
  </main>
</template>
