<script>
import helper from '../config/helper';
import Score from './Score.vue';
import Author from './Author.vue';

export default {
    components: {
        Score,
        Author,
    },
    props: {
        novel: {
            type: Object,
            default: {
                title:"bla bla bla bla",
                img: "2.jpg",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas fuga asperiores, amet laborum dolorem molestiae architecto quasi tempora obcaecati consequuntur repellendus vitae sed modi, cum maxime doloremque libero expedita quibusdam.",
                category: ["hello", "action", "fantasy"],
                score: 4.6,
                author: {
                    avatar: '1.jpg',
                    name: "Anisse",
                    surname: "Boua",
                },
                price: 8,
            }
        }
    },
    data(){
        return {
            BASE_IMG_PATH: helper.pathImg
        }
    }
}
</script>

<template>
    <div class="w-1/2 flex bg-gradient-to-br from-novelize-dark to-zinc-900 rounded-md">
        <div class="w-40 h-48">
            <img class="w-full h-full object-cover rounded-md rounded-r-none" :src="BASE_IMG_PATH + novel.img" alt="">
        </div>
        <div class="basis-3/4 flex flex-col justify-between py-3 px-2">
            <div>
                <div class="flex justify-between">
                    <h4 class="text-lg font-semibold">{{ novel.title }}</h4>
                    <Score 
                    :score="novel.score"
                    />
                </div>
                <p class="my-3">{{ novel.description.length > 120 ? novel.description.slice(0, 120) + '...' :  novel.description }}</p>
            </div>
            <div >
                <Author
                :name="novel.author.name"
                :surname="novel.author.surname"
                :followers="4586"
                :img="false"
                />
            </div>
        </div>
    </div>
</template>