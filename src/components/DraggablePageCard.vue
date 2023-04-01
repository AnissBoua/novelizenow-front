<template>
  <div
    class="page_card"
    :class="{ dragging: isDragging }"
    draggable="true"
    ref="pageCard"
    :id="page.id"
  >
    <div class="page_title">
      <p class="text-black font-bold font">Page ID : {{ page.id }}</p>
      <p class="text-black font-bold font">Content :</p>
      <span class="text-black">{{ page.content.substring(0, 400) }}...</span>
    </div>
    <div class="btn_container flex justify-between">
      <div class="up_down_btns">
        <Button
          class="mx-1"
          label="Up"
          @click.prevent="$emit('up', { id: page.id, where: 'up' })"
        ></Button>
        <Button
          class="mx-1"
          label="Down"
          @click.prevent="$emit('down', { id: page.id, where: 'down' })"
        ></Button>
      </div>
      <div class="options_btns">
        <Button
          @click.prevent="
            $router.push({
              name: 'page_edit',
              params: {
                novel_id: novelId,
                chapter_id: chapterId,
                page_id: page.id,
              },
            })
          "
          label="Update"
        ></Button>
        <Button
          class="ml-2"
          bgColor="bg-red-600"
          label="Delete"
          @click.prevent="$emit('delete', page.id)"
        ></Button>
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

<style lang="scss" scoped>
.page_card {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 5px;
  padding: 10px;
  user-select: none;
  cursor: move;
  transition: transform 0.2s ease-in-out;
}

.page_card.dragging {
  transform: scale(1.05);
}
</style>
