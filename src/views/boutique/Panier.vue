<template>
    <div>
        <Button @click="getPaymentIntent"
        label="elements">
        </Button>
        <Button label="checkout" @click="createCheckoutSession"></Button>

        <div id="payment-element"></div>  
        <Button v-if="paymentElement !== false " @click="validatePaymentIntent"
        label="Payer">
        </Button>
    </div>
</template>
 
<script setup>
import axios from 'axios'; 
import { loadStripe } from '@stripe/stripe-js';
import { ref } from 'vue';


const stripe = ref(null);

loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY).then((res) => {
    stripe.value = res
    console.log(stripe);
});

const JWTToken = localStorage.getItem('token');
const PaymentIntent = ref(null);

let elements = ref(null);
let paymentElement = false;
function getPaymentIntent(){
    if (!stripe.value) {
        
    }
    axios.post(import.meta.env.VITE_BACK_URL + 'api/stripe/payment-intent', {
        headers: {
            'Authorization': 'Bearer ' + JWTToken
        } 
    })
    .then((res) => {
        console.log(res.data)
        PaymentIntent.value = res.data;
        console.log(stripe);
        elements = stripe.value.elements({
            clientSecret: PaymentIntent.value.client_secret
        })
        paymentElement = elements.create('payment');
    }).then((res) => {
        paymentElement.mount('#payment-element');
    })
    .catch((e) => console.error(e))
}

function validatePaymentIntent(){
    if (!stripe.value || !elements) {
        return;
    }

    const { error } = stripe.value.confirmPayment({
        elements,
        confirmParams: {
            return_url: 'http://127.0.0.1:5173/panier'
        },
    }).then((res) => {
        console.log(res);
    })

    if (error.type === "card_error" || error.type === "validation_error") {
        console.log(error);
    } else {
        console.log(error);
    }
}

function createCheckoutSession(){
    axios.post(import.meta.env.VITE_BACK_URL + 'api/stripe/checkout-session', {
        headers: {
            'Authorization': 'Bearer ' + JWTToken
        } 
    }).then((res) => {
        stripe.value.redirectToCheckout({
            sessionId: res.data.id
        })
    })
}

</script>