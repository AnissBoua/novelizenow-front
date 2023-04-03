<template>
  <div>
    <h3 class="text-lg font-semibold my-4">New releases</h3>
    <div class="relative h-[40em] w-full rounded-md">
      <img
        class="absolute w-full h-full object-cover rounded-md"
        :src="pathImg + novels[0].img"
        :alt="novels[0].title + ' post image'"
      />
      <div class="absolute w-full h-full top-0 bg-darklayer opacity-60"></div>
      <div class="absolute top-2/3 left-20">
        <Category :category="novels[0].category[0]" />
        <h4>{{ novels[0].title }}</h4>
        <div class="flex items-center">
          <div class="rounded-full bg-novelize-primary w-2 h-2 mr-2"></div>
          <p class="text-zinc-400">{{ novels[0].stats.readers }} readers</p>
        </div>
        <Author />
      </div>
    </div>
    <div class="my-6">
      <div class="grid grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i">
          <NovelCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Category from "../Category.vue";
import Author from "../Author.vue";
import NovelCard from "../NovelCard.vue";
export default {
  components: {
    Category,
    Author,
    NovelCard,
  },
  props: {
    novels: {
      type: Array,
      default: [
        {
          title: "Test Title",
          img: "2.jpg",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
          category: ["hello", "action", "fantasy"],
          author: {
            avatar: "1.jpg",
            name: "Anisse Boua",
          },
          price: 8,
          stats: {
            readers: 98600,
          },
        },
        {
          title: "Second",
          img: "1.jpg",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
          category: ["hello", "action", "fantasy"],
          author: {
            avatar: "2.jpg",
            name: "Anisse Boua",
          },
          price: 8,
          stats: {
            readers: 98600,
          },
        },
      ],
    },
  },
  data() {
    return {
      pathImg: import.meta.env.VITE_BACK_URL + "imgs/",
    };
  },
};
</script>
