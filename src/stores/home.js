import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useHomeStore = defineStore('home', () => {
  const carousel = ref([]);
  const chapters = ref([]);
  const categories = ref([]);
  const newNovels = ref([]);

  async function get() {
    try {
      await axios.get('/home/').then(res => {
        carousel.value = res.data.carousel;
        chapters.value = res.data.chapters;
        categories.value = res.data.categories;
        newNovels.value = res.data.newNovels;
      })
    } catch (error) {
      console.error(error);      
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
    get
  }
})
