<script setup>
const props = defineProps({
    name : {
        type: String,
        default: 'Horror'
    },
    color: {
        type: String,
        default: 'text-novelize-primary'
    }
})
</script>
<template>
    <div>
        <p :class="'capitalize ' + color">{{ name }}</p>
    </div>
</template>