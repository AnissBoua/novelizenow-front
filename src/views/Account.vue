<template>
    <section class="relative">
        <div class="mx-4 md:mx-20">
            <div class="relative">
                <div class="flex items-center justify-between">
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
                        <div v-for="(userNovel, index) in userNovels" :key="index" class="my-4">
                            <Novel :novel="userNovel.novel" :onDelete="deleteNovel" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="deletingNovelId" class="absolute top-0 w-full h-full bg-novelize-dark/70">
            <div class="w-6/12 bg-novelize-primarydark mx-auto py-2">
                <div class="flex justify-center items-center py-2 px-4">
                    <h4 class="text-xl">Delete Novel</h4>
                </div>
                <div class="border border-1 border-zinc-700"></div>
                <div class="px-4 py-2">
                    <p class="text-novelize-secondarylight2 font-semibold">Deleting a Novel it's a irriversible action, we won't be able to restore it</p>
                    <p class="text-zinc-300">Are you sure you want to delete this Novel ?</p>
                </div>
                <div class="flex justify-end gap-4 py-2 px-4">
                    <p class="text-novelize-secondarylight2" @click="deletingNovelId = null">Undo</p>
                    <p class="text-red-400" @click="confirmDelete(deletingNovelId)">Delete !</p>
                </div> 
            </div>
        </div>
    </section>
</template>
  
<script setup>
import { ref } from 'vue';
import Button from '@/components/Button.vue'
import Novel from '@/components/backoffice/author/Novel.vue';
import axios from 'axios';

const userNovels = ref(null);
axios.get('user/novels')
.then((res) => {
    userNovels.value = res.data
})
.catch((e) => console.error(e))

const deletingNovelId = ref(null);

function deleteNovel(novelId){
    deletingNovelId.value = novelId;
}

function confirmDelete(novelId){
    axios.delete('novel/' + novelId)
    .then((res) => {
        userNovels.value = userNovels.value.filter((userNovel) => userNovel.novel.id !== novelId);
        deletingNovelId.value = null;
    })
    .catch((e) => console.error(e))
}
</script>