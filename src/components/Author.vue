<template>
    <div class="flex items-center">
        <div v-if="img">
            <img class="w-14 h-14 object-cover rounded-full" :src="pathImg + img" alt="">
        </div>
        <div :class="img ? 'mx-2' : ''">
            <div>
                <p>{{ name + " " + lastname }}</p>
            </div>
            <div class="text-xs text-zinc-400" v-if="followers !== false">
                <p> {{followers }} followers</p>
            </div>
        </div>
    </div>
</template>

<script>
import helper from '../config/helper';
export default {
    props: {
        img: {
            type: String,
            default: "avatar.png"
        },
        name: {
            type: String,
            default: "Anisse"
        },
        lastname: {
            type: String,
            default: "Bouainbi"
        },
        followers: {
            type: Number,
            default: false
        }
    },
    data(){
        return {
            pathImg: helper.pathImg,
        }
    },
}
</script>