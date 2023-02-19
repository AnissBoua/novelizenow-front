<template>
    <div class="author">
        <div>
            <img class="author_img" :src="pathImg + img" alt="">
        </div>
        <div class="author_info">
            <div>
                <p>{{ name + " " + surname }}</p>
            </div>
            <div class="author_followers" v-if="followers !== false">
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
        surname: {
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

<style lang="scss" scoped>
.author{
    display: flex;
    align-items: center;
    &_img {
        width: 3.5em;
        height: 3.5em;
        object-fit: cover;
        border-radius: 100%;
    }
    &_info{
        margin: 0 1em;
    }
    &_info p {
        margin: 0.2em 0;
    }
    &_followers {
        font-size: 0.9em;
        color: $color-gray;
    }
}
</style>