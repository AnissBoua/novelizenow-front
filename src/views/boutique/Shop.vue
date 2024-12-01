<template>
    <div class="sm:w-10/12 lg:w-1/2 mx-4 sm:mx-auto">
        <h2 class="text-xl font-semibold my-6">Recharge</h2>
        <div class="grid sm:grid-cols-2 gap-6">
            <Offer v-for="(offerObj, index) in offers" :key="index"
            :offer="offerObj"
            :selected="offerObj.selected"
            @select="setSelected(offerObj.id)"
            />
            <div id="payment-element"></div>  
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useStripe } from '@/stores/stripe.js' 
import Offer from '@/components/boutique/Offer.vue';

const stripeStore = useStripe();
let paymentElement = ref(false);
const offers = ref([]);
axios.get(import.meta.env.VITE_BACK_URL + 'api/offer')
    .then((res) => {
        offers.value = res.data;
        offers.value.forEach((offer) => {
            offer.selected = false;
        });
    })
    .catch((e) => console.error(e));

const setSelected = (id) => {
    offers.value.forEach((offer) => {
        if (offer.id === id) {
            offer.selected = true;
        } else {
            offer.selected = false;
        }
    });
}

const initializePayment = () => {
    const selectedOffer = offers.value.find((offer) => offer.selected);
    if (selectedOffer) {
        axios.post(import.meta.env.VITE_BACK_URL + 'api/stripe/payment-intent', {
            offerId: selectedOffer.id
        }).then(async (res) => {
            const clientSecret = res.data.client_secret;
            paymentElement = await stripeStore.initElements(clientSecret);
            paymentElement.mount('#payment-element');
        })
        .catch((e) => console.error(e));
    }
}

const initializeCheckout = () => {
    const selectedOffer = offers.value.find((offer) => offer.selected);
    if (selectedOffer) {
        stripeStore.initCheckout(selectedOffer.id);
    }
}
</script>