<template>
    <div class="max-w-site mx-auto">
        <div class="flex bg-green-900/50 rounded overflow-hidden space-x-4">
            <div class="w-1.5 bg-green-500">
            </div>
            <div class="py-2 text-green-100">
                <p class="text-md font-semibold">Succès</p>
                <p>Merci pour votre achat ! Vous serez redirigé vers la page d'accueil dans quelques secondes.</p>
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