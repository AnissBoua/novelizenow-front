<template>
    <div>
        <select class="bg-novelize-dark text-novelize-primary font-bold outline-none">
            <option v-for="(option, index) in options" :key="index" :value="option">{{ option }}</option>
        </select>
    </div>
</template>

<script>
// TODO INCOMPLETE COMPONENT
export default {
    props:{
        options: {
            type: Array,
            default: [
                'Day',
                'Month',
                'Year',
            ]
        }
    },
    data(){
        return {

        }
    }
}
</script>