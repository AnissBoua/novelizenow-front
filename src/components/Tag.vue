<script>
export default {
    props: {
        tag: {
            type: String,
            default: 'New'
        }
    }
}
</script>

<template>
    <div class="bg-novelize-primary rounded-full px-3">
        <p class="text-white">{{ tag }}</p>
    </div>
</template>