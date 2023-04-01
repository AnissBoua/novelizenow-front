<template>
  <div class="read_book_page">
    <div class="banner grid grid-cols-12">
      <div class="novel_infos col-start-4 col-end-10">
        <img src="#" alt="tempo" />
        <div v-if="data" class="novel_infos_desc">
          <h1>{{ data.title }}</h1>
          <p>Author: {{ data.author.lastname }} {{ data.author.name }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="page_content w-1/2 m-auto" style="">
    <div class="page_content_header m-l">
      <h1 class="text-2xl p-2">Chapters</h1>
    </div>
    <hr>
    <div class="page_content_chapters h-full border">
      <div class="page_content_chapters_container  h-full w-10/12 m-auto grid grid-cols-2 gap-x-[20px] gap-y-[10px]">
        <div v-for="i in 20" :key="i" class="test w-full border h-16">test {{i}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data: null,
      title: null,
      novelId: this.$route.params.novel_id,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      if (this.novelId) {
        let response = await axios.get(`novel/${this.novelId}`);
        this.data = response.data;
        this.title = response.data.title;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.banner {
  height: 30rem;
  border: 1px solid white;
}

.novel_infos {
  display: flex;
  align-items: center;
  padding-inline: 5rem;
  img {
    border: 1px solid white;
    height: 20rem;
    width: 15rem;
  }
  &_desc {
    flex-grow: 1;
    height: 20rem;
    margin-left: 2rem;
    h1 {
      font-size: 2rem;
    }
  }
}
</style>
