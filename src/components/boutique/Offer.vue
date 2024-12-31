<template>
    <div class="rounded-lg bg-gradient-to-br from-novelize-dark to-novelize-primarydark" @click="select">
        <div class="text-center my-2">
            <h3 class="text-xl font-semibold text-novelize-secondary">{{ offer.name }}</h3>
        </div>
        <div class="w-full h-0.5 bg-zinc-700"></div>
        <div class="flex flex-col items-center w-full text-center my-4">
            <CoinIcon />
            <p class="text-2xl font-semibold m-2">{{ offer.coins }} Pièces</p>
        </div>
        <div class="flex justify-center rounded-b-lg py-2 bg-gradient-to-r from-novelize-secondarylight to-novelize-secondary  cursor-pointer" @click="initializeCheckout(offer.id)">
            <p class="text-base">{{ offer.price.toFixed(2) }} &euro;</p>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import CoinIcon from '../CoinIcon.vue';
import { useStripe } from '@/stores/stripe.js' 

const stripeStore = useStripe();
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

const initializeCheckout = (offerId) => {
    stripeStore.initCheckout(offerId);
}

const select = () => {
    emit('select', props.selected);
}

</script>