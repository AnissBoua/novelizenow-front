<template>
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
    class="w-full h-8 bg-novelize-darklight !text-white rounded-md px-4" type="number" min="1" :name="id" :id="id" :placeholder="placeholder">
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Number,
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