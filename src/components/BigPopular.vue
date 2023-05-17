<script setup>
import Author from './Author.vue';
import Category from './Category.vue';
import IconText from './IconText.vue';
const BACK_URL = import.meta.env.VITE_BACK_URL;

const props = defineProps({
    category: {
        type: Object,
        default: {
            id: 1,
            name: "Horror",
        },
    },
    novel: {
        type: Object,
        default: {
            title: "blabla",
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
            // price: 8,
        },
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
})

console.log(props.novel);
</script>

<template>
    <div class="relative h-[25em] sm:h-[35em] md:h-[45em] w-full rounded-md">
      <img
        class="absolute w-full h-full object-cover rounded-md"
        :src="BACK_URL + novel.banner.filepath"
        :alt="novel.title + ' post image'"
      />
      <div class="absolute w-full h-full top-0 bg-darklayer"></div>
      <div class="absolute w-full sm:w-6/12 bottom-6 sm:bottom-14 left-6 sm:left-14">
        <Category :name="category.name" color="text-novelize-secondary" />
        <RouterLink :to="{name: 'read_novel', params: { novel_slug: novel.slug }}" class="text-lg hover:text-novelize-primary">{{ novel.title }}</RouterLink>
        <div class="flex items-center gap-10">
            <IconText :text="novel.quantiteChapitre + ' chapters'" color="bg-novelize-primary"/>
            <div class="flex gap-4">
                <IconText :text="novel.likesCount" color="text-novelize-secondary" icon="fa-solid fa-heart" />
                <IconText :text="novel.commentsCount" color="text-novelize-secondary" icon="fa-solid fa-comments"/>
            </div>
        </div>
        <p class="hidden sm:block min-h-max max-h-20 overflow-hidden my-4">{{ novel.resume }}</p>
        <Author class="hidden sm:block" :author="author"> </Author>
      </div>
    </div>
</template>