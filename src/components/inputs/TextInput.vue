<template>
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
    class="w-full h-8 bg-novelize-darklight !text-white rounded-md px-4" :type="type" :name="id" :id="id" :placeholder="placeholder">
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
    type: {
        type: String,
        default: 'text',
        validator: (value) => {
            const allowed = ['text', 'email', 'password'];

            return allowed.includes(value) ? value : 'text';
        }
    }
})

defineEmits(['update:modelValue'])

</script>