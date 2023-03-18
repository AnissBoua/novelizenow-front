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
</script>

<template>
  <main>
    <Carousel/>
    <div class="flex justify-between px-8">
      <div class="w-8/12">
        <div class="my-8">
          <div class="flex">
            <Category 
            class="mr-4"
            color="white"
            />
            <Category 
            class="mr-4"
            category="Adventure"
            :active="true"
            />
            <Category 
            class="mr-4"
            category="Horror"
            color="white"
            />
            <Category 
            class="mr-4"
            category="Action"
            color="white"
            />
          </div>
          <div class="flex overflow-x-scroll py-4 scrollbar">
            <div class="min-w-[40em] mr-4">
              <Novel />
            </div>
            <div class="min-w-[40em] mr-4">
              <Novel />
            </div>
            <div class="min-w-[40em] mr-4">
              <Novel />
            </div>
          </div>
        </div>
        <div class="bg-neutral-800 rounded-lg py-2 px-4 my-8">
          <h3 class="text-xl font-semibold my-2">Last chapters</h3>
          <div class="my-4">
            <div class="my-4" v-for="i in 8" :key="i">
              <Chapter />
            </div>
          </div>
        </div>
      </div>
      <div class="w-4/12 my-8 mx-8">
        <div class="h-max bg-neutral-800 rounded-lg py-2 px-4 ">
          <TopAuthor/>
        </div>
        <div class="h-max bg-neutral-800 rounded-lg py-2 px-4 my-4">
          <TopNovel />
        </div>
      </div>      
    </div>
    <div class="px-8">
      <NewRelease />
    </div>
  </main>
</template>
