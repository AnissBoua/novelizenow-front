<template>
    <div class="flex justify-between items-center rounded-lg bg-gradient-to-r from-novelize-darklight/50 to-novelize-primary/50 py-4 px-4 m-4" @click="select">
        <div class="flex items-center">
            <div class="flex justify-center items-center bg-white rounded-full w-8 h-8">
                <i v-if="selected" class="fa-solid fa-check text-lg"></i>
            </div>
            <div class="mx-4">
                <h3 class="text-xl font-semibold ">{{ offer.name }}</h3>
                <p class="text-base text-zinc-300">{{ offer.price.toFixed(2) }} &euro;</p>
            </div>
        </div>
        <div>
            <div class="flex items-center">
                <CoinIcon />
                <p class="text-2xl font-semibold mx-2">{{ offer.coins }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import CoinIcon from '../CoinIcon.vue';
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    selected: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['select']);

const select = () => {
    emit('select', props.selected);
}

</script>