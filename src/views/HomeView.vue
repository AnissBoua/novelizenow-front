<script setup>
import Carousel from '../components/Carousel.vue';
import Chapter from '../components/Chapter.vue'
import Novel from '../components/Novel.vue';
import NovelReduced from '../components/NovelReduced.vue';
import Category from '../components/Category.vue';
import TopAuthor from '../components/home/TopAuthor.vue';
import Select from '../components/inputs/Select.vue';
import TopNovel from '../components/home/TopNovel.vue';
import NewRelease from '../components/home/NewRelease.vue';

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
    <Carousel/>
    <div class="flex justify-between px-8">
      <div class="w-full mx-auto">
        <div class="bg-neutral-800 rounded-lg py-2 px-4 my-8">
          <h3 class="text-xl font-semibold my-2">Last chapters</h3>
          <div class="grid grid-cols-2 gap-4 my-4">
            <div class="" v-for="(chapter, i) in chapters" :key="i">
              <Chapter :title="chapter.title" :novel="chapter.novel" :author="chapter.novel.author" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-8">
      <NewRelease />
    </div>
  </main>
</template>
