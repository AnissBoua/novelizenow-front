<template>
    <input class="flex-1 rounded-full cursor-pointer !text-white file:bg-novelize-primarydark file:border-0 file:rounded-full file:px-3 file:py-1.5 file:text-novelize-primary file:mr-4 hover:file:bg-novelize-primary/30" type="file" @change="fileUpload" :name="id" :id="id">
</template>

<script setup>
const props = defineProps({
    fileUpload: {
        type: Function,
        required: true
    },
    placeholder: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    },
})

</script>