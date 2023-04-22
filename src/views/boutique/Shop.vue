<template>
    <div class="w-2/6">
        <Offer v-for="(offerObj, index) in offers" :key="index"
        :offer="offerObj"
        :selected="offerObj.selected"
        @select="setSelected(offerObj.id)"
        />
        <Button 
        label="Choose offer"
        @click="initializeCheckout"></Button>

        <div id="payment-element"></div>  
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
        console.log(offers.value);
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
            console.log(res.data);
            const clientSecret = res.data.client_secret;
            paymentElement = await stripeStore.initElements(clientSecret);
            console.log(paymentElement);
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