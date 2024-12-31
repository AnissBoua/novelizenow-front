<template>
  <div>
    <div class="px-4 lg:px-0">
      <h3 class="text-lg font-semibold my-4">Popular categories</h3>
      <div class="my-4">
        <div class="flex flex-wrap gap-4" v-if="category">
          <div v-for="(cat, i) in categories" :key="i" @click="selectCategory(cat)" class="cursor-pointer">
            <Category :name="cat.name" :color="category.id == cat.id ? 'text-novelize-primary' : 'text-white'" />
          </div>
        </div>
      </div>
    </div>
    <BigPopular v-if="novel" :novel="novel" :author="novel.author" :category="{id: category.id, name: category.name}" />
    <div v-if="novels" class="my-4 lg:my-6">
      <div class="hidden lg:grid grid-cols-3 gap-4">
        <div v-for="(nov, index) in novels.filter((nov) => nov.id != novel.id)" :key="index" @click="selectNovel(nov)">
          <NovelCard class="" :novel="nov" />
        </div>
      </div>
      <div class="flex justify-center gap-4 lg:hidden">
        <div v-for="(nov, index) in novels" :key="index">
          <div :class="'w-10 h-3 rounded-full ' + (nov.id == novel.id ? 'bg-novelize-primary' : ' bg-novelize-darklight')" >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Category from "../Category.vue";
import NovelCard from "../NovelCard.vue";
import BigPopular from "../BigPopular.vue";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    default: []
  },
});

const category = ref(null);
const novels = ref(null);
const novel = ref(null);

onMounted(() => {
  if (props.categories.length > 0) {
    category.value = props.categories[0];
    novel.value = category.value.novel[0];
    novels.value = category.value.novel;
  }
});

watch(() => props.categories, (categories) => {
  category.value = categories[0];
  novel.value = category.value.novel[0];
  novels.value = category.value.novel
});

function selectCategory(cat) {
  category.value = cat;
  novels.value = category.value.novel;
  novel.value = novels.value[0];
}

function selectNovel(novel) {
  novel.value = novel;
}

setInterval(() => {
  const currentSlide = novels.value.indexOf(novel.value);
  novel.value = novels.value[(currentSlide + 1) % novels.value.length];
}, 5000);

</script>
