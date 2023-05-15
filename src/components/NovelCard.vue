<template>
  <div>
    <div class="relative h-56 w-full rounded-md">
      <img
        class="absolute w-full h-full object-cover rounded-md"
        :src="BACK_URL + novel.banner.filepath"
        alt=""
      />
      <div class="absolute w-full h-full top-0 bg-darklayer"></div>
      <div class="absolute w-6/12 bottom-3 left-6">
        <Category v-if="novel.categories" :name="novel.categories[0].name" color="text-novelize-secondary" />
        <RouterLink :to="{name: 'read_novel', params: { novel_slug: novel.slug }}" class="text-lg hover:text-novelize-primary">{{ novel.title }}</RouterLink>
        <div class="flex gap-10">
          <IconText :text="novel.quantiteChapitre + ' chapters'" color="bg-novelize-primary"/>
          <div class="flex gap-4">
            <IconText :text="novel.likesCount" icon="fa-solid fa-heart" color="text-novelize-secondary"/>
            <IconText :text="novel.commentsCount" icon="fa-solid fa-comment" color="text-novelize-secondary"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconText from "./IconText.vue";
import Category from "./Category.vue";
const BACK_URL = import.meta.env.VITE_BACK_URL;
const props = defineProps({
  novel: {
    type: Object,
    default: {
      title: "blabla",
      slug: "the-last-of-us",
      cover: {
        filename: "2.jpg",
        filepath: "imgs/2.jpg",
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
    },
  },
})
</script>
