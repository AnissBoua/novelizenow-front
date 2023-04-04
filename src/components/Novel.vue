<script>
import Score from "./Score.vue";
import Author from "./Author.vue";
import Tag from "./Tag.vue";

export default {
  components: {
    Score,
    Author,
    Tag,
  },
  props: {
    novel: {
      type: Object,
      default: {
        title: "bla bla bla bla",
        img: "2.jpg",
        resume:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
        category: ["hello", "action", "fantasy"],
        score: 4.6,
        author: {
          avatar: "1.jpg",
          name: "Anisse",
          lastname: "Boua",
        },
        price: 8,
        stats: {
          readers: 98600,
        },
        date_creation: "04-03-2023",
      },
    },
  },
  data() {
    return {
      BASE_IMG_PATH: import.meta.env.VITE_BACK_URL + "imgs/",
    };
  },
  methods: {
    isNewNovel(date) {
      const postDate = new Date(date);
      const today = new Date();

      const difference = Math.floor((today - postDate) / (1000 * 60 * 60 * 24));

      if (difference <= 7) {
        return true;
      }

      return false;
    },
  },
};
</script>

<template>
    <div class="flex bg-gradient-to-br from-novelize-dark to-zinc-900 rounded-md">
        <div class="w-40 h-48">
            <img class="w-full h-full object-cover rounded-md rounded-r-none" :src="BASE_IMG_PATH + novel.img" alt="">
        </div>
        <div class="relative basis-3/4 flex flex-col justify-between py-3 px-4">
            <div v-if="isNewNovel(novel.date_creation)" class="absolute -top-2 right-2">
                <Tag />
            </div>
            <div>
                <div class="flex justify-between">
                    <h4 class="text-lg font-semibold">{{ novel.title }}</h4>
                    <Score 
                    :score="novel.score"
                    />
                </div>
                <p v-if="novel.resume" class="my-3">{{ novel.resume.length > 120 ? novel.resume.slice(0, 120) + '...' :  novel.resume }}</p>
            </div>
            <div>
                <Author
                :name="novel.author.name"
                :lastname="novel.author.lastname"
                :followers="4586"
                :img="''"
                />
            </div>
        </div>
    </div>
</template>
