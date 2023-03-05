<script>
export default {
    props: {
        category: {
            type: String,
            default: 'Romance'
        },
        btnStyle: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'text-novelize-primary'
        }
    }
}
</script>
<template>
    <div>
        <div v-if="btnStyle" :class="'w-max ' + color + ' rounded-full text-center px-4'">
            <p class="font-medium text-white capitalize">{{ category }}</p>
        </div>
        <div v-else>
            <p :class="'text-base ' + color + ' capitalize '">{{ category }}</p>
        </div>
    </div>
</template>