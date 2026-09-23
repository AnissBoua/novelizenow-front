import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useHomeStore = defineStore('home', () => {
  const carousel = ref([]);
  const chapters = ref([]);
  const categories = ref([]);
  const newNovels = ref([]);
  const freeChaptersCount = ref(0);
  const publishedNovelsCount = ref(0);
  const totalCategoriesCount = ref(0);
  const hasMoreChapters = ref(true);
  const loadingMore = ref(false);

  async function get() {
    try {
      await axios.get('/home/').then(res => {
        carousel.value = res.data.carousel;
        chapters.value = res.data.chapters;
        categories.value = res.data.categories;
        newNovels.value = res.data.newNovels;
        freeChaptersCount.value = res.data.freeChaptersCount;
        publishedNovelsCount.value = res.data.publishedNovelsCount;
        totalCategoriesCount.value = res.data.totalCategoriesCount;
      })
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMoreChapters() {
    if (loadingMore.value || !hasMoreChapters.value) return;
    loadingMore.value = true;
    try {
      const res = await axios.get('/home/chapters', { params: { offset: chapters.value.length } });
      chapters.value = [...chapters.value, ...res.data.chapters];
      hasMoreChapters.value = res.data.hasMore;
    } catch (error) {
      console.error(error);
    } finally {
      loadingMore.value = false;
    }
  }

  if (!carousel.value.length) {
    get();
  }

  return {
    carousel,
    chapters,
    categories,
    newNovels,
    freeChaptersCount,
    publishedNovelsCount,
    totalCategoriesCount,
    hasMoreChapters,
    loadingMore,
    get,
    loadMoreChapters,
  }
})
