<script setup>
import Carousel from '../components/Carousel.vue';
import Chapter from '../components/Chapter.vue'
import Novel from '../components/Novel.vue';
import NovelReduced from '../components/NovelReduced.vue';
import Category from '../components/Category.vue';
</script>

<template>
  <main>
    <Carousel/>
    <div class="grid grid-cols-12 gap-4 px-8">
      <div class="col-span-8 my-8">
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
      <div class="col-span-8 bg-neutral-800 rounded-lg py-2 px-4 my-8">
        

        <h3 class="text-xl font-semibold my-2">Last chapters</h3>
        <div class="my-4">
          <div class="my-4" v-for="i in 5" :key="i">
            <Chapter />
          </div>
        </div>
      </div>
      <div>
        part 2 (right)
      </div>
    </div>
  </main>
</template>
