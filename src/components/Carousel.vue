<template>
    <div>
        <div class="carousel_container">
            <div :class="'carousel_item ' + (slide === index ? 'carousel_item_active' : '')" v-for="(novel, index) in novels" :key="index">
                <img class="carousel_img" :src="pathImg + novel.img" alt="">
                <div class="carousel_layer"></div>
                <div class="carousel_novel">
                    <div>
                        <p>{{ novel.score }}</p>
                    </div>
                    <div>
                        <h2>{{ novel.title }}</h2>
                        <p>{{ novel.description }}</p>
                    </div>
                    <div class="novel_bottom">
                        <div class="novel_author">
                            <img class="novel_author_avatar" :src="pathImg + novel.author.avatar" alt="">
                            <p>By : <span class="novel_author_name">{{ novel.author.name }}</span></p>
                        </div>
                        <div>
                            <button class="novel_bottom_btn">Read it</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dot_wrapper">
                <div @click="setSlide(index)" :class="'dot ' + (slide === index ? 'dot_active' : '')" v-for="(novel, index) in novels" :key="index"></div>
            </div>
        </div>
    </div>
</template>
<script>
import helper from '../config/helper';
    export default {
        props: {
            novels: {
                type: Array,
                default: [
                    {
                        title:"Test Title",
                        img: "2.jpg",
                        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
                        caregoty: ["hello", "action", "fantasy"],
                        score: 4.7,
                        author: {
                                avatar: '1.jpg',
                                name: "Anisse Boua"
                        },
                        price: 8,
                    },
                    {
                        title:"Second",
                        img: "1.jpg",
                        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
                        caregoty: ["hello", "action", "fantasy"],
                        score: 4.7,
                        author: {
                                avatar: '2.jpg',
                                name: "Anisse Boua"
                        },
                        price: 8,
                    }
                ]
            }
            
        },
        data() {
            return {
                pathImg: helper.pathImg,
                slide: 0,

            }
        },
        mounted(){
            setInterval(() => {
                this.slide = this.slide + 1 > (this.novels.length - 1) ? 0 : this.slide + 1;
            }, 5000);
        },
        methods: {
            setSlide(index){
                this.slide = index;
            }
        }
        
    }
</script>
<style lang="scss" scoped>
.carousel{
    &_container{
        // display: flex;
        position: relative;
        height: 30em;

    }
    &_item{
        position: absolute;
        width: 100%;
        max-width: 100%;
        height: 100%;
        opacity: 0;
        transition: all ease-in-out 0.2s;
        transition-delay: 0.2s;
        &_active{
            opacity: 1;
            transition-delay: 0s;
            & .carousel_novel{
                opacity: 1;
                transition-delay: 0s;
                transform: translate(0, 0);
            }
        }
    }
    &_img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    &_layer{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: $color-gradient-dark;
        opacity: 0.75;
    }
    &_novel{
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        width: 40%;
        color: white;
        opacity: 0;
        padding: 5em;
        transform: translate(0, 10%);
        transition: all ease-in-out 2s;
        transition-delay: 0.2s;
    }
}
.novel{
    &_bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        &_btn{
            font-weight: 600;
            border: 0;
            border-radius: 0.5em;
            background-color: $color-primary;
            color: white;
            cursor: pointer;
            padding: 0.7em 1.2em;
            transition: all ease-in-out 0.3s;
            &:hover{
                background-color: white;
                color: $color-primary;
            }
        }
    }
    &_author{
        display: flex;
        align-items: center;
        &_avatar{
            width: 3em;
            height: 3em;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 1em 0 0
        }
        &_name{
            color: $color-primary-lightest;
        }
    }
}
.dot{
    width: 1em;
    height: 1em;
    cursor: pointer;
    border: 0.1em solid $color-secondary;
    // background-color: $color-secondary;
    border-radius: 50%;
    margin: 0 0.3em;
    transition: all ease-in-out 0.5s;
    &_wrapper{
        position: absolute;
        bottom: 10%;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        width: max-content;
        margin: 0 auto;
    }
    &_active{
        border: 0.1em solid transparent;
        background-color: $color-primary-light;
    }
}
</style>