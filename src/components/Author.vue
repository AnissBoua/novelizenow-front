<template>
  <div class="flex items-center gap-2">
    <div v-if="author.avatar"> 
      <img
        class="w-12 h-12 object-cover rounded-full"
        :src="BACK_URL + author.avatar"
        alt=""
      />
    </div>
    <div>
      <div>
        <p>{{ author.name + " " + author.lastname }}</p>
      </div>
      <IconText :text="author.novelCount + ' novels'" color="bg-novelize-primary" />
    </div>
  </div>
</template>

<script setup>
import IconText from './IconText.vue';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const props = defineProps({
  author: {
    type: Object,
    default: {
      id: 1,
      name: "Anisse",
      lastname: "Boua",
      username: "AnisseBoua",
      avatar: "imgs/1.jpg",
      novelCount: 2,
    },
  },
});
</script>
