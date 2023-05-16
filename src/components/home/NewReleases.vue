<template>
    <div>
        <h3 class="text-lg font-semibold my-4">New releases</h3>
        <div class="flex gap-5">
            <div v-for="(novel, index) in novels" :key="index" class="w-4/12">
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