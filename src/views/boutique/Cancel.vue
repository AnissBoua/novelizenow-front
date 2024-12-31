<template>
    <div class="max-w-site mx-auto">
        <div class="flex bg-red-900/50 rounded overflow-hidden space-x-4">
            <div class="w-1.5 bg-red-500">
            </div>
            <div class="py-2 text-red-100">
                <p class="text-md font-semibold">Annuler</p>
                <p>Votre achat a été annulé. Vous serez redirigé vers la page d'accueil dans quelques secondes.</p>
                <h1></h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    setTimeout(() => {
        window.location.href = '/';
    }, 6000);
});
</script>