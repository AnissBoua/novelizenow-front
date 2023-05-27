<script setup>
import IconText from "./IconText.vue";
import Category from "./Category.vue";

const BACK_URL = import.meta.env.VITE_BACK_URL;

const props = defineProps({
  novel: {
    type: Object,
    default: {
      title: "The last of us but what happen with a longer text ?",
      slug: "the-last-of-us",
      cover: {
          filename: "2.jpg",
          filepath: "imgs/2.jpg",
      },
      banner: {
          filename: "2.jpg",
          filepath: "imgs/2.jpg",
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
        avatar: "imgs/1.jpg",
        novelCount: 2,
      },
    },
  }
})

function numberFormatter(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number;
  }
}
</script>

<template>
  <div class="flex items-center bg-gradient-to-br from-novelize-dark to-novelize-primarydark gap-4 rounded-md mt-14 mb-4">
    <div class="w-36 h-32 relative">
      <img
        class="absolute left-2 bottom-2 w-32 h-40 object-cover rounded-md mx-auto"
        :src="BACK_URL + novel.cover.filepath"
        alt=""
      />
    </div>
    <div class="basis-3/4 flex flex-col justify-between py-3">
      <div>
        <div class="">
          <Category :name="novel.categories[0].name" color="text-novelize-secondary" />
          <RouterLink :to="{name: 'read_novel', params: { novel_slug: novel.slug }}" class="block max-h-14 overflow-y-hidden hover:text-novelize-primary text-lg font-semibold">{{ novel.title }}</RouterLink>
          <div class="flex items-center gap-6">
            <IconText color="bg-novelize-primary" :text="novel.quantiteChapitre + ' Chapters'" />
            <div class="flex items-center gap-4">
              <IconText :text="novel.likesCount" color="text-novelize-secondary" icon="fa-solid fa-heart" />
              <IconText :text="novel.commentsCount" color="text-novelize-secondary" icon="fa-solid fa-comments"/>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
      </div>
    </div>
  </div>
</template>
