<template>
  <div class="flex flex-col sm:flex-row rounded-lg bg-gradient-to-br from-novelize-dark to-novelize-primarydark">
    <div class="w-full sm:w-1/3 p-1">
      <img
        class="w-full h-28 sm:h-44 rounded-lg object-cover"
        :src="novel.cover ? (BACK_URL + novel.cover.filepath) : ''"
        alt=""
      />
    </div>
    <div class="w-full sm:w-2/3 flex flex-col justify-between py-3 px-3">
      <div class="flex justify-between">
        <Category :name="novel.categories[0].name" color="text-novelize-secondary" />
        <IconText :text="novel.likesCount" icon="fa-solid fa-heart" color="text-novelize-secondary"/>

      </div>
      <div>
        <RouterLink :to="{name: 'read_novel', params: { novel_slug: novel.slug }}"
         class="text-lg hover:text-novelize-primary">{{ title }}</RouterLink>
        <div class="flex items-center gap-2">
          <IconText color="bg-novelize-secondary" :text="novel.title + ' - ' + novel.quantiteChapitre + ' Chapitres'" />
        </div>
      </div>
      <div class="flex justify-between">
        <Author :author="author"> </Author>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconText from "./IconText.vue";
import Category from "./Category.vue";
import Button from "./Button.vue";
import Author from "./Author.vue";
import Score from "./Score.vue";

const BACK_URL = import.meta.env.VITE_BACK_URL;

const props = defineProps({
  novel: {
    type: Object,
    default: {
        title: "The last of us",
        slug: "the-last-of-us",
        cover: {
          filename: "2.jpg",
          filepath: "2.jpg",
        },
        resume:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
        categories: [{id: 1, name: "hello"}, {id: 2, name: "action"}, {id: 3, name: "fantasy"}],
        likesCount: 1,
        commentsCount: 16,
        quantiteChapitre: 12,
        // price: 8,
      },
  },
  title: {
      type: String,
      default: "Chapter title",
    },
  author: {
    type: Object,
    default: {
      id: 1,
      name: "Anisse",
      lastname: "Boua",
      username: "AnisseBoua",
      avatar: "1.jpg",
      novelCount: 2,
    },
  },
});
</script>