import { defineStore } from "pinia";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';

export const useStripe = defineStore("stripe", {
    state: () => {
        return {
            stripe: loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY),
        }
    },
    getters: {
        getStripe: (state) => state.stripe,
        getElements: (state) => state.elements,
    },
    actions: {
        async initElements(client_secret) {
            if (!client_secret) {
                throw new Error('No client secret provided');
            }
            const stripe = await this.stripe;
            const elements = stripe.elements({
                clientSecret: client_secret
            })
            const paymentElement = elements.create('payment');

            return paymentElement;
        },

        async initCheckout(offerId) {
            const stripe = await this.stripe;
            const JWTToken = localStorage.getItem('token');
            axios.post(import.meta.env.VITE_BACK_URL + 'api/stripe/checkout-session', {
                offerId: offerId,
                headers: {
                    'Authorization': 'Bearer ' + JWTToken
                } 
            }).then((res) => {
                stripe.redirectToCheckout({
                    sessionId: res.data.id
                })
            })
        }

    },
})