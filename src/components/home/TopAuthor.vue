<template>
    <div>
        <h3 class="text-lg">Authors of the week</h3>
        <div class="my-6" v-for="(author, index) in authors" :key="index">
            <Author 
            :img="author.img"
            :name="author.name"
            :surname="author.surname"
            :followers="author.followers"
            />
        </div>
        <div class="flex justify-center">
            <Button
            :label="'Show more'"
            :btnStyle="1"
            />
        </div>
    </div>
</template>

<script>
import Author from '../Author.vue';
import Button from '../Button.vue';

export default {
    components: {
        Author,
        Button
    },
    data(){
        return {
            authors: [
                {
                    img: 'avatar.png',
                    name: 'John',
                    surname: 'Doe',
                    followers: 9586,
                },
                {
                    img: 'avatar.png',
                    name: 'Anisse',
                    surname: 'Bouainbi',
                    followers: 14562,
                },
                {
                    img: 'avatar.png',
                    name: 'Jonathan',
                    surname: 'Bho',
                    followers: 7852,
                },
                {
                    img: 'avatar.png',
                    name: 'Bla',
                    surname: 'Super',
                    followers: 185632,
                },
                {
                    img: 'avatar.png',
                    name: 'James',
                    surname: 'Bond',
                    followers: 974132,
                },
            ]
        }
    }
}
</script>