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
                stats: {
                    readers: 98600,
                },
            }
        }
    },
    data(){
        return {
            BASE_IMG_PATH: helper.pathImg
        }
    },
    methods: {
        numberFormatter(number){
            if (number >= 1000000) {
                return (number / 1000000).toFixed(1) + 'M';
            } else if (number >= 1000) {
                return (number / 1000).toFixed(1) + 'K';
            } else {
                return number
            }
        }
    }
}
</script>

<template>
    <div class="w-1/2 flex bg-gradient-to-br from-novelize-dark to-zinc-900 rounded-md mt-8">
        <div class="w-40 h-32 relative">
            <img class="absolute inset-x-0 bottom-2 w-28 h-36 object-cover rounded-md mx-auto" :src="BASE_IMG_PATH + novel.img" alt="">
        </div>
        <div class="basis-3/4 flex flex-col justify-between py-3 px-2">
            <div>
                <div class="flex justify-between">
                    <h4 class="text-lg font-semibold">{{ novel.title }}</h4>
                    <Score 
                    :score="novel.score"
                    />
                </div>
            </div>
            <div class="flex items-center">
                <div class="rounded-full bg-novelize-primary w-2 h-2 mr-2"></div>
                <p class="text-zinc-400">{{ numberFormatter(novel.stats.readers) }} readers</p>
            </div>
            <div>
                <Author
                :name="novel.author.name"
                :surname="novel.author.surname"
                :followers="4586"
                :img="''"
                />
            </div>
        </div>
    </div>
</template>