<template>
    <div class="max-w-site mx-auto">
        <div class="flex bg-green-900/50 rounded overflow-hidden space-x-4">
            <div class="w-1.5 bg-green-500">
            </div>
            <div class="py-2 text-green-100">
                <p class="text-md font-semibold">Success</p>
                <p>Thank you for your purchase!, you'll be redirected to the home page in a few seconds.</p>
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