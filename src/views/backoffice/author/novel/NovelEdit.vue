<template>
    <div class="mx-10 my-10">
        <NovelForm 
        title="Update your novel"
        :novel="{

        }"
        :submit="updateNovel"
        />
    </div>
</template>

<script setup>
import NovelForm from '@/components/forms/NovelForm.vue';
import { useRouter } from 'vue-router'
import axios from 'axios';

const props = defineProps({
    novel: {
        type: Object,
    }
})
console.log(props.novel);

const router = useRouter();

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

</script>