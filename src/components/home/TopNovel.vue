<template>
    <div>
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Romans populaires</h3>
            <div class="basis-2/6 flex justify-between text-novelize-primary cursor-pointer">
                <p class="hover:text-novelize-primarylight">Jour</p>
                <p class="hover:text-novelize-primarylight">Mois</p>
                <p class="hover:text-novelize-primarylight">Année</p>
            </div>
        </div>
        <div>
            <div v-for="(novel, index) in novels" :key="index">
                <NovelReduced 
                :novel="novel"
                />
            </div>
        </div>
    </div>
</template>

<script>
import NovelReduced from '../NovelReduced.vue';

export default {
    components: {
        NovelReduced,
    },
    data(){
        return{
            novels: [
                {
                    title:"Je ne sais pa sou je suis",
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
                },
                {
                    title:"Je ne sais pa sou je suis",
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
                },
                {
                    title:"Je ne sais pa sou je suis",
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
                },
                {
                    title:"Je ne sais pa sou je suis",
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
                },
                {
                    title:"Je ne sais pa sou je suis",
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
                },
            ]
        }
    },

}
</script>