<script>
export default {
    props: {
        score: {
            type: Number,
            default: 4.2,
        }
    }
}
</script>
<template>
    <div class="flex items-center">
        <p class="mx-2">{{ score }}</p>
        <i class="fa-solid fa-star"></i>
    </div>
</template>