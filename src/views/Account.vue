<template>
    <section class="mx-20">
        <h3>Account</h3>
        <div>
            <div>
                <div class="flex">
                    <h4>My novels</h4>
                    <Button 
                    :to="{
                        name: 'author_novel',
                    }"
                    :label="'Create Novel'"
                    ></Button>
                </div>
                <div>
                    <div class="my-4">
                        <div class="flex items-center bg-novelize-primary h-8 rounded-t-md">
                            <div class="flex justify-center w-1/12"><h3>Manage</h3></div>
                            <div class="w-6/12"><h3>Novel</h3></div>
                            <div class="w-1/12"><h3>Chapitre</h3></div>
                            <div class="w-2/12"><h3>Readers(TODO)</h3></div>
                            <div class="w-2/12"><h3>Date creation</h3></div>
                        </div>
                        <div>
                            <div class="group flex items-center hover:bg-novelize-primary/20 py-2" v-for="(userNovel, index) in userNovels" :key="index" @mouseleave="isNovelOptionVisible = false">
                                <div class="w-1/12">
                                    <div class="relative flex justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <i class="fa-solid fa-ellipsis-vertical cursor-pointer" @click="showNovelOptions"></i>
                                        <div class="absolute top-0 left-16 w-28 bg-novelize-darklight text-sm rounded-md" :class="{'hidden': !isNovelOptionVisible}">
                                            <div class="w-full hover:bg-novelize-primary/20 py-2 px-4">
                                                <router-link :to="{
                                                    name: 'author_novel',
                                                    params: { id: userNovel.novel.id },
                                                }"><i class="fa-solid fa-pen mr-2"></i> Edit</router-link>
                                            </div>
                                            <div class="w-full hover:bg-novelize-primary/20 py-2 px-4" @click="deleteNovel(userNovel.novel.id)">
                                                <p><i class="fa-solid fa-trash mr-2"></i> Delete</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-6/12 pr-4">
                                    <div class="flex items-center">
                                        <img class="max-h-16 w-28 h-16 object-cover" :src="BACK_URL + 'uploads/novels/' + getCover(userNovel.novel.novelImages)" alt="">
                                        <div class="flex-1 px-2">
                                            <router-link :to="{
                                                name: 'read_novel',
                                                params: { novel_slug: userNovel.novel.slug },
                                            }">
                                            {{ userNovel.novel.title }} <br><span class="text-xs text-zinc-400">{{ userNovel.novel.resume ? userNovel.novel.resume.slice(0, 150) : '' }}</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-1/12">{{ userNovel.novel.quantiteChapitre}}</div>
                                <div class="w-2/12">TODO</div>
                                <div class="w-2/12">{{ userNovel.novel.date_creation }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script setup>
import { ref } from 'vue';
import Button from '../components/Button.vue'
import axios from 'axios';

const BACK_URL = import.meta.env.VITE_BACK_URL;
const JWTToken = localStorage.getItem('token');


const userNovels = ref(null);
axios.get(import.meta.env.VITE_BACK_URL + 'api/user/novels', {
    headers: {
        'Authorization': 'Bearer ' + JWTToken
    } 
})
.then((res) => {
    userNovels.value = res.data
})
.catch((e) => console.error(e))

function getCover(novelImages){
    if (novelImages.length === 0) {
        return false;
    }
    const cover = novelImages.find(image => image.imgPosition === 'cover');

    if (!cover) {
        return false;
    }
    const filename = cover.image.filename;
    return filename;
}

let isNovelOptionVisible = ref(false);

const showNovelOptions = () => {
    return isNovelOptionVisible.value = !isNovelOptionVisible.value;
}

function deleteNovel(novelId){
    axios.delete(import.meta.env.VITE_BACK_URL + 'api/novel/' + novelId, {
        headers: {
            'Authorization': 'Bearer ' + JWTToken
        } 
    })
    .then((res) => {
        console.log(res.data)
    })
    .catch((e) => console.error(e))
}
</script>