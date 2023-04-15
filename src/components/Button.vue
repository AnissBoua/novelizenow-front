<template>
    <router-link v-if="to" :to="to">
        <button class="btn" :class="{'btn_primary' : btnStyle === 1 && bgColor === undefined, 'btn_secondary' : btnStyle !== 1  && bgColor === undefined, [bgColor] : bgColor  }">
            <i v-if="icon" :class="'btn_icon ' + icon"></i>
            {{ label }}
        </button>
    </router-link>
    <button v-else class="btn" :class="{'btn_primary' : btnStyle === 1 && bgColor === undefined, 'btn_secondary' : btnStyle !== 1  && bgColor === undefined, [bgColor] : bgColor  }">
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
        to: {
            type: Object,
            default: {
                name: '',
                params: '',
            }
        },
        label: {
            type: String,
            default: "Click me"
        },
        icon: {
            type: String,
            default: ""
        },
        bgColor: {
            type: String,
            default: undefined
        }
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
    color: white;
    cursor: pointer;
    padding: 0.5em 1em;
    transition: all ease-in-out 0.3s;
    border-radius: $border-radius;
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
        cursor: pointer;
        padding: 0.5em 1em;
        transition: all ease-in-out 0.2s;
        &:hover {
            background-color: $color-primary-light;
        }
    }
}

</style>