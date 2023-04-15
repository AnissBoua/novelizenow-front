<template>
    <div class="mx-10 my-10">
        <h3 class="font-bold text-lg">{{ novelId ? 'Mis a jour du novel' : 'Creation du novel' }}</h3>
        <div class="flex flex-col my-4">
            <div class="w-full my-2">
                <input v-model="novel.title" class="w-full h-8 rounded-md px-4" type="text" name="titre" id="titre" placeholder="Titre Novel">
            </div>
            <div class="w-full my-2">
                <textarea v-model="novel.resume" class="w-full rounded-md px-4 py-2" name="resume" id="resume" cols="30" rows="5" placeholder="Résumé du Novel"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-8">
                <div class="flex flex-col">
                    <label class="my-2" for="cover">Cover :</label>
                    <input class="flex-1 rounded-lg bg-novelize-darklight cursor-pointer outline outline-offset outline-1 outline-novelize-primary
                    file:bg-novelize-primary file:border-0 file:px-3 file:py-2 file:text-white file:mr-4 hover:file:bg-novelize-primarylight" type="file" @change="onFileUpload($event, 'cover')" name="cover" id="cover">
                </div>
                <div class="flex flex-col">
                    <label class="my-2" for="banner">Banner :</label>
                    <input class="flex-1 rounded-lg bg-novelize-darklight cursor-pointer outline outline-offset outline-1 outline-novelize-primary
                    file:bg-novelize-primary file:border-0 file:px-3 file:py-2 file:text-white file:mr-4 hover:file:bg-novelize-primarylight" type="file" @change="onFileUpload($event, 'banner')" name="banner" id="banner">
                </div>
            </div>
            <div class="my-4">
                <p class="my-2">Categories</p>
                <select class="bg-novelize-darklight border border-novelize-primary text-gray-900 text-sm rounded-lg rounded-b-none block w-full p-2.5 dark:text-white outline-none" name="categories" id="categories" @change="onCategorySelect">
                    <option v-for="(category, index ) in categories" :key="index" :value="category.id">{{ category.name }} </option>
                </select>
                <div class="flex my-2">
                    <div class="flex items-baseline bg-novelize-primarylight border border-novelize-primary rounded-full py-1 px-2 mr-2" v-for="(category, index) in novel.categories" :key="index">
                        <p>{{category.name}}</p>
                        <i class="fa-solid fa-x fa-2xs cursor-pointer font-bold ml-2 text-novelize-primary"  @click="removeCategory(index)"></i>
                    </div>
                </div>
            </div>
            <div class="self-end my-4">
                <Button 
                :label="'Create!'"
                @click="(novelId ? updateNovel() : createNovel())"
                ></Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';
import {useAuth} from "@/stores/auth.js";

const authStore = useAuth();
const { me } = authStore;

const router = useRouter();
const route = useRoute();

const novel = ref({
    title: '',
    resume: '',
    image: null,
    banner: null,
    categories: []
})
let novelId = null;
if (route.params.id) {
    novelId = route.params.id;
    let authorId = null;
    axios.get(import.meta.env.VITE_BACK_URL + 'api/novel/' + novelId)
    .then(async (res) => {
        authorId = res.data.author.id;
        const isAuthor = await me().then((res) => {
            res.data.id === authorId ? true : false;
        });

        if (isAuthor) {
            novel.value.title = res.data.title;
            novel.value.resume = res.data.resume;
            novel.value.categories = res.data.categories;
        } else {
            novelId = null;
            router.push({ name: 'author_novel' });
        }
        
    })


}
const categories = ref(null);

axios.get(import.meta.env.VITE_BACK_API_URL + 'category',)
.then(res => {
    categories.value = res.data
})
.catch(e => console.log(e))

function onFileUpload(event, type) {
    const file = event.target.files[0];
    switch (type) {
        case 'cover':
            novel.value.image = file;
            break;
        case 'banner':
            novel.value.banner = file;
            break;
    }
}

function onCategorySelect(event) {
    const categoryId = parseInt(event.target.value);
    const category = categories.value.find((category) => category.id === categoryId);
    if (category && !novel.value.categories.includes(category)) {
        novel.value.categories.push(category)
    }
    console.log(novel.value);
}

function removeCategory(index) {
    novel.value.categories.splice(index, 1);
}

function createNovel(){
    const JWTToken = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', novel.value.title)
    formData.append('resume', novel.value.resume)
    formData.append('cover', novel.value.image)
    formData.append('banner', novel.value.banner)

    novel.value.categories.forEach((category) => {
        formData.append('category[]', category.id)
    })
    console.log([...formData.entries()]);
    axios.post(import.meta.env.VITE_BACK_API_URL + 'novel/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + JWTToken
        }
    })
    .then((res) => {  router.push({ name: 'account' })})
    .catch((e) => console.log(e))
}

function updateNovel(){
    const JWTToken = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', novel.value.title)
    formData.append('resume', novel.value.resume)
    formData.append('cover', novel.value.image)
    formData.append('banner', novel.value.banner)

    novel.value.categories.forEach((category) => {
        formData.append('category[]', category.id)
    })
    axios.post(import.meta.env.VITE_BACK_API_URL + 'novel/' + novelId, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + JWTToken
        }
    })
    .then((res) => {  router.push({ name: 'account' })})
    .catch((e) => console.log(e))
}

</script>