<template>
    <div>
        <h3 class="text-lg font-semibold my-4">Nouveautés</h3>
        <div id="reduced_novels" class="flex gap-5 overflow-x-scroll">
            <div v-for="(novel, index) in novels" :key="index" class="w-96">
              <NovelReduced :novel="novel" />
            </div>
        </div>
    </div>
</template>

<script setup>
import NovelReduced from '../NovelReduced.vue';
const props = defineProps({
    novels: {
      type: Array,
      default: []
    }
})

</script>

<style scoped>

#reduced_novels::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
#reduced_novels::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: transparent;
}
#reduced_novels::-webkit-scrollbar-thumb {
  border-radius: 100vh;
  border: 3px solid #1E1E1E;
}
#reduced_novels::-webkit-scrollbar-thumb:hover {
  background: #1E1E1E;
}
</style>