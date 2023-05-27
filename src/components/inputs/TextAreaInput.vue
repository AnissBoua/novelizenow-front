<template>
    <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="w-full bg-novelize-darklight rounded-md px-4 py-2" :name="id" :id="id" cols="30" rows="5" :placeholder="placeholder"></textarea>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
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

defineEmits(['update:modelValue'])
</script>