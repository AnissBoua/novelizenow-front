<template>
    <div>
        <h3 class="text-lg font-semibold my-4">New releases</h3>
        <div id="reduced_novels" class="flex gap-5 overflow-x-scroll">
            <div v-for="(novel, index) in novels" :key="index" class="w-96">
              <NovelReduced :novel="novel" />
            </div>
        </div>
    </div>
</template>

<script setup>
import NovelReduced from '../NovelReduced.vue';
import Novel from '../Novel.vue'
const props = defineProps({
    novels: {
        type: Array,
        default: [
          {
            title: "The last of us",
            slug: "the-last-of-us",
            cover: {
                filename: "2.jpg",
                filepath: "2.jpg",
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
          {
            title: "blabla",
            slug: "the-last-of-us",
            cover: {
                filename: "2.jpg",
                filepath: "2.jpg",
            },
            banner: {
                filename: "1.jpg",
                filepath: "imgs/1.jpg",
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
              avatar: "imgs/2.jpg",
              novelCount: 2,
            },
          },
        ]
    }
})

</script>

<style scoped>

#reduced_novels::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
#reduced_novels::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: transparent;
}
#reduced_novels::-webkit-scrollbar-thumb {
  border-radius: 100vh;
  border: 3px solid #1E1E1E;
}
#reduced_novels::-webkit-scrollbar-thumb:hover {
  background: #1E1E1E;
}
</style>