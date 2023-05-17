<template>
  <div>
    <div class="px-4 lg:px-0">
      <h3 class="text-lg font-semibold my-4">Popular categories</h3>
      <div class="my-4">
        <div class="flex gap-4" v-if="selectedCategory">
          <div v-for="(category, i) in categories" :key="i" @click="selectCategory(category)" class="cursor-pointer">
            <Category :name="category.name" :color="selectedCategory.id == category.id ? 'text-novelize-primary' : 'text-white'" />
          </div>
        </div>
      </div>
    </div>
    <BigPopular v-if="currentNovel" :novel="currentNovel" :author="currentNovel.author" :category="{id: selectedCategory.id, name: selectedCategory.name}" />
    <div v-if="novels" class="my-4 lg:my-6">
      <div class="hidden lg:grid grid-cols-3 gap-4">
        <div v-for="(novel, index) in novels.filter((nov) => nov.id != currentNovel.id)" :key="index" @click="selectNovel(novel)">
          <NovelCard class="" :novel="novel" />
        </div>
      </div>
      <div class="flex justify-center gap-4 lg:hidden">
        <div v-for="(novel, index) in novels" :key="index">
          <div :class="'w-10 h-3 rounded-full ' + (novel.id == currentNovel.id ? 'bg-novelize-primary' : ' bg-novelize-darklight')" >
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
import { ref, watch } from "vue";


const BACK_URL = import.meta.env.VITE_BACK_URL;

const props = defineProps({
  categories: {
    type: Array,
    default: [
      {
        id: 3,
        name: "Romance",
        novel: [
          {
            title: "The last of us",
            slug: "the-last-of-us",
            cover: {
                filename: "2.jpg",
                filepath: "2.jpg",
            },
            banner: {
                filename: "2.jpg",
                filepath: "2.jpg",
            },
            resume:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
            categories: [{id: 1, name: "hello"}, {id: 2, name: "action"}, {id: 3, name: "fantasy"}],
            likesCount: 1,
            commentsCount: 16,
            quantiteChapitre: 12,
            author: {
              id: 1,
              name: "Anisse",
              lastname: "Boua",
              username: "AnisseBoua",
              avatar: "1.jpg",
              novelCount: 2,
            },
          },
          {
            title: "The last of us",
            slug: "the-last-of-us",
            cover: {
                filename: "2.jpg",
                filepath: "2.jpg",
            },
            banner: {
                filename: "2.jpg",
                filepath: "2.jpg",
            },
            resume:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
            categories: [{id: 1, name: "hello"}, {id: 2, name: "action"}, {id: 3, name: "fantasy"}],
            likesCount: 1,
            commentsCount: 16,
            quantiteChapitre: 12,
            author: {
              id: 1,
              name: "Anisse",
              lastname: "Boua",
              username: "AnisseBoua",
              avatar: "1.jpg",
              novelCount: 2,
            },
          },
        ]
      },
    ]
  },
});

const selectedCategory = ref(null);
const novels = ref(null);
const currentNovel = ref(null);

watch(() => props.categories, (categories) => {
  selectedCategory.value = categories[0];
  currentNovel.value = selectedCategory.value.novel[0];
  novels.value = selectedCategory.value.novel
});

function selectCategory(category) {
  selectedCategory.value = category;
  novels.value = selectedCategory.value.novel
}

function selectNovel(novel) {
  currentNovel.value = novel;
}

setInterval(() => {
  const currentSlide = novels.value.indexOf(currentNovel.value);
  currentNovel.value = novels.value[(currentSlide + 1) % novels.value.length];
}, 5000);

</script>
