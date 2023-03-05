<template>
    <div class="flex rounded-lg novel">
        <img class="w-1/3 h-40 rounded-lg object-cover" :src="pathImg + novel.img" alt="">
        <div class="novel_data">
            <div class="novel_head">
                <Category
                :category="novel.category[0]"
                :btnStyle="false"
                />
                <Score 
                :score="novel.score"
                />
            </div>
            <div>
                <h3>{{ novel.title }}</h3>
            </div>
            <div class="novel_details">
                <Author
                :followers="4586"
                >
                </Author>
                <Button
                :label="'Read it'"
                :btnStyle="1"
                >
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
import helper from '../config/helper';
import Category from './Category.vue';
import Button from './Button.vue';
import Author from './Author.vue';
import Score from './Score.vue';

export default {
    components: {
        Category,
        Button,
        Author,
        Score,
    },
    props: {
        novel: {
            type: Object,
            default: {
                title:"bla bla bla bla",
                img: "2.jpg",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
                category: ["hello", "action", "fantasy"],
                score: 4.7,
                author: {
                    avatar: '1.jpg',
                    name: "Anisse Boua"
                },
                price: 8,
            }
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
.novel{
    background-color: $dark-theme;
    padding: 0.5em;
    &_img{
        width: 18%;
        height: 12em;
        object-fit: cover;
        border-radius: $border-radius;
    }
    &_data{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-basis: 80%;
        padding: 0.5em 1em;
    }
    &_head{
        display: flex;
        justify-content: space-between;
        align-items: center;
        &_score{
            display: flex;
            align-items: center;
            & p {
                margin: 0 1em;
            }
        }
    }
    &_details{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>