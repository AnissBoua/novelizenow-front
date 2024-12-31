<template>
    <section class="relative">
        <div class="mx-4 md:mx-20">
            <div class="relative">
                <div class="flex bg-blue-500/20 text-blue-500 rounded-md overflow-hidden space-x-4 my-4">
                    <div class="w-1 bg-blue-500"></div>
                    <div class="py-2">
                        <p class="font-bold">Créer et gérer vos romans depuis le tableau de bord</p>
                        <p>Depuis votre tableau de bord, vous avez la possibilité de créer vos romans en quelques étapes simples. Une fois votre roman créé, vous pouvez ensuite ajouter différents chapitres et pages pour le structurer comme vous le souhaitez.</p>
                        <p>Les utilisateurs pourront acheter votre roman, mais aussi le commenter et le liker pour interagir avec votre contenu. Cela vous permet de gérer et de suivre l'engagement des lecteurs directement depuis la plateforme.</p>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <h4>Mes romans</h4>
                    <Button 
                    :to="{
                        name: 'author_novel',
                    }"
                    :label="'Créer un roman'"
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
        <div v-if="deletingNovelId" class="absolute top-0 w-full h-full bg-novelize-dark/70 px-4">
            <div class="w-full md:w-6/12 bg-novelize-darklight rounded-lg mx-auto py-2">
                <div class="flex justify-center items-center py-2 px-4">
                    <h4 class="text-xl">Supprimer le roman</h4>
                </div>
                <div class="border border-1 border-zinc-700"></div>
                <div class="px-4 py-2">
                    <p class="text-novelize-secondary font-semibold">Supprimer un roman est une action irréversible, nous ne pourrons pas le restaurer.</p>
                    <p class="text-zinc-300">Êtes-vous sûr de vouloir supprimer ce roman ?</p>
                </div>
                <div class="flex justify-end gap-4 py-2 px-4">
                    <p class="text-novelize-secondary cursor-pointer" @click="deletingNovelId = null">Annuler</p>
                    <p class="text-red-500 cursor-pointer" @click="confirmDelete(deletingNovelId)">Supprimer !</p>
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