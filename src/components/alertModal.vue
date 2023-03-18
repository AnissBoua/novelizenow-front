<template>
  <div
    @click="closeEvent"
    class="modal"
    :class="{ 'show-modal': alertModalState.open }"
  >
    <div ref="targetDiv" class="modal-content">
      <span @click="alertModalState.open = false" class="close-button"
        >&times;</span
      >
      <h1 class="text-black">{{ alertModalState.title }}</h1>
      <p class="text-black">{{ alertModalState.content }}</p>
      <div v-if="alertModalState.emits !== undefined" class="btn-container">
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
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem 1.5rem;
  width: 24rem;
  border-radius: 0.5rem;
}

.close-button {
  float: right;
  width: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: lightgray;
}

.close-button:hover {
  background-color: darkgray;
}

.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
  z-index: 1;
}
</style>
