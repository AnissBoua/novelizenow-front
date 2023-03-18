<template>
    <a v-if="href" :href="href">
        <button :class="'btn ' +  (btnStyle ? (btnStyle === 1 ? 'btn_primary' : 'btn_secondary') : '' )">
            <i v-if="icon" :class="'btn_icon ' + icon"></i>
            {{ label }}
        </button>
    </a>
    <button v-else :class="'btn ' +  (btnStyle ? (btnStyle === 1 ? 'btn_primary' : 'btn_secondary') : '' )">
        <i v-if="icon" :class="'btn_icon ' + icon"></i>
        {{ label }}
    </button>
</template>
<script>
export default {
    props: {
        btnStyle: {
            type: Number,
            default: 1
        },
        href: {
            type: String,
            default: ""
        },
        label: {
            type: String,
            default: "Click me"
        },
        icon: {
            type: String,
            default: ""
        },
        
    },
    data(){
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
.btn{
    font-weight: 600;
    border: 0.1em solid transparent;
    border-radius: 0.7em;
    background-color: $color-primary;
    color: white;
    cursor: pointer;
    padding: 0.5em 1em;
    transition: all ease-in-out 0.3s;
    &_primary:hover {
        background-color: white;
        color: $color-primary;
    }
    &_secondary {
        background-color: white;
        color: $color-primary;
        &:hover{
            box-shadow: 0 0 0.3em 0.1em $color-primary;
        }
    }
    &_icon{
        margin:  0 0.5em 0 0;
    }
    &_primary {
        font-family: $font-family;
        font-weight: 500;
        color: $color-text-primary;
        background-color: $color-primary;
        border: 0;
        border-radius: $border-radius;
        cursor: pointer;
        padding: 0.5em 1em;
        transition: all ease-in-out 0.2s;
        &:hover {
            background-color: $color-primary-light;
        }
    }
}

</style>