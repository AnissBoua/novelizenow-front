<template>
    <div class="flex flex-col sm:flex-row rounded-lg bg-gradient-to-br from-novelize-dark to-novelize-primarydark">
      <div class="w-full sm:w-1/3 p-1">
        <img
          class="w-full h-28 sm:h-44 rounded-lg object-cover"
          :src="BACK_URL + novel.cover.filepath"
          alt=""
        />
      </div>
      <div class="w-full sm:w-2/3 flex flex-col justify-between py-3 px-3">
        <div>
          <RouterLink :to="{name: 'read_novel', params: { novel_slug: novel.slug }}"
           class="text-xl hover:text-novelize-primary">{{ novel.title }}</RouterLink>
           <p class="text-zinc-300 my-1"> {{ novel.resume }} </p>
           <div class="flex gap-4">
             <div class="flex items-center gap-2">
               <IconText color="bg-novelize-primary" :text="novel.quantiteChapitre + ' chapters'" />
             </div>
             <div class="flex justify-between">
               <IconText :text="novel.likesCount" icon="fa-solid fa-heart" color="text-novelize-secondary"/>
             </div>
             <div class="flex justify-between">
               <IconText :text="novel.commentsCount" icon="fa-solid fa-comment" color="text-novelize-secondary"/>
             </div>
           </div>
        </div>
        <div class="flex justify-end gap-4 mt-2">
          <div class="flex gap-4">
            <router-link :to="{
                name: 'author_novel',
                params: { id: novel.id },
            }" class="!text-novelize-secondary">Edit</router-link>
            <p class="!text-red-500" @click="onDelete(novel.id)">Delete</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
  import IconText from "../../IconText.vue";
  import Button from "../../Button.vue";
  import Score from "../../Score.vue";
  
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
          likesCount: 1,
          commentsCount: 16,
          quantiteChapitre: 12,
          // price: 8,
        },
    },
    onDelete: {
      type: Function,
      default: () => {},
    },
  });
  </script>