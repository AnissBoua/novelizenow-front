<template>
  <div>
    <div class="relative h-40 w-full rounded-md">
      <img
        class="absolute w-full h-full object-cover rounded-md"
        :src="pathImg + novel.img"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    novel: {
      type: Object,
      default: {
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
    },
  },
  data() {
    return {
      pathImg: import.meta.env.VITE_BACK_URL + "imgs/",
    };
  },
};
</script>
