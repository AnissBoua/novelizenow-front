<template>
  <div
    class="bg-novelize-darklight rounded-lg cursor-move transition-all suration-200 ease-in-out my-4 p-3"
    :class="{' scale-105': isDragging }"
    draggable="true"
    ref="pageCard"
    :id="page.id"
  >
    <div class="page_title">
      <p class="font-bold font">Page ID : {{ page.id }}</p>
      <p class="font-bold font">Content :</p>
      <span>{{ page.content.substring(0, 400) }}...</span>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex gap-4 text-xl cursor-pointer">
        <i class="fa-solid fa-caret-up text-white hover:text-zinc-500" @click.prevent="$emit('up', { id: page.id, where: 'up' })"></i>
        <i class="fa-solid fa-caret-down text-white hover:text-zinc-500" @click.prevent="$emit('up', { id: page.id, where: 'up' })"></i>
      </div>
      <div class="flex gap-4">
        <RouterLink :to="{ name: 'page_edit', params: { novel_id: novelId, chapter_id: chapterId, page_id: page.id, } }" class="!text-novelize-secondary hover:!text-novelize-secondarylight2">Edit</RouterLink>
        <button @click.prevent="$emit('delete', page.id)" class="!text-red-600 hover:!text-red-400">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      required: true,
    },
    chapterId: {
      type: String,
      required: true,
    },
    novelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isDragging: false,
    };
  },
  mounted() {},
  methods: {},
};
</script>