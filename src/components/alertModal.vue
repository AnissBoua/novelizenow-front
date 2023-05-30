<template>
  <div
    @click="closeEvent"
    class="fixed left-0 top-0 w-full h-full bg-black/50 opacity-0 invisible scale-105 transition-all"
    :class="{ 'show-modal': alertModalState.open }"
  >
    <div ref="targetDiv" class="absolute w-11/12 sm:w-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-novelize-darklight rounded-md shadow-md py-2 px-4"
    >
     <div class="flex justify-between my-1">
       <h1 >{{ alertModalState.title }}</h1>
       <span @click="alertModalState.open = false" class="w-6 h-6 text-center cursor-pointer rounded-md bg-zinc-600 hover:bg-zinc-500"
         >&times;</span
       >
     </div>
      <p class="my-4">{{ alertModalState.content }}</p>
      <div v-if="alertModalState.emits !== undefined">
        <Button @click="accept(alertModalState.emits)" :label="'Confirmer'"/>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/modals.js";
import Button from './Button.vue';

export default {
  components: { Button },
  setup() {
    let store = useModalStore();
    const { alertModalState } = storeToRefs(store);
    return {
      store,
      alertModalState,
    };
  },
  emits: ["acceptWarning"],
  methods: {
    closeEvent(e) {
      let targetElement = e.target;
      if (!this.$refs.targetDiv.contains(targetElement)) {
        this.closeModal();
      }
    },
    closeModal() {
      this.store.resetAlertModal();
    },
    accept(emitEvent) {
      this.$emit("acceptWarning", emitEvent);
      this.closeModal();
    },
  },
};
</script>

<style>
.show-modal {
  opacity: 1;
  visibility: visible !important;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
  z-index: 1;
}
</style>
