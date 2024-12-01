<script setup>
const props = defineProps({
    text : {
        type: [String, Number],
        default: 'Horror'
    },
    color: {
        type: String,
        default: 'bg-novelize-secondary'
    },
    icon: {
        type: String,
        default: ''
    }
})
</script>
<template>
    <div class="flex items-center gap-2">
        <div v-if="!icon" :class="'w-3 h-3 rounded-full ' + color"></div>
        <i v-else :class="color + ' ' + icon"></i>
        <p class="text-zinc-400">{{ text }}</p>
    </div>
</template>