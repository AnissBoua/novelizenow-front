<template>
    <div class="max-w-site mx-auto">
        <div class="flex bg-red-900/50 rounded overflow-hidden space-x-4">
            <div class="w-1.5 bg-red-500">
            </div>
            <div class="py-2 text-red-100">
                <p class="text-md font-semibold">Cancel</p>
                <p>Your purchase has been cancelled., you'll be redirected to the home page in a few seconds.</p>
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