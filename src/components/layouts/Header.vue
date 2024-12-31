<template>
  <header class="relative flex justify-between items-center py-4 lg:py-6 px-4 sm:px-6 lg:px-20">
    <div class="flex items-center gap-10 w-8/12 lg:w-9/12">
        <div>
            <RouterLink to="/">
                <img class="hidden lg:block lg:w-32" src="@/assets/logos/novelizelogo.svg" alt="logo" >
                <img class="block lg:hidden lg:w-32" src="@/assets/logos/LogoMobile.png" alt="logo" >
            </RouterLink>

        </div>
        <div class="hidden md:block relative w-8/12">
            <input v-model="search" class="w-full bg-novelize-darklight !text-white rounded-lg  px-4 py-2" type="text" placeholder="Rechercher" @input="debounceSeach" @focusin="toggleSearch" @focusout="toggleSearch">
            <div v-if="isSearching && novels && novels.length > 0" class="absolute z-50 flex flex-col gap-2 w-full bg-novelize-darklight rounded-lg my-2 p-1 lg:p-4">
                <div v-for="(novel, index) in novels" :key="index" class="flex gap-4">
                    <img class="w-16 h-24 object-cover rounded-lg" :src="novel.cover ? (BACK_URL + novel.cover.filepath) : ''" alt="">
                    <div class="col-span-5">
                        <div class="flex gap-2 mb-2">
                            <p v-for="(category, index) in novel.categories" :key="index" class="text-novelize-secondary text-xs">{{ category.name }}</p>
                        </div>
                        <RouterLink :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="hover:text-novelize-primary">{{ novel.title }}</RouterLink>
                        <div class="flex gap-2 text-xs">
                            <IconText :text="novel.quantiteChapitre + ' Chapitres'" color="bg-novelize-primary"/>
                            <p>-</p>
                            <p class="text-zinc-300">{{ novel.author.name }} {{ novel.author.lastname }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex items-center gap-4 sm:gap-8">
        <div class="md:hidden" @click="toggleSearchMobile">
            <i class="fa-solid fa-magnifying-glass text-white"></i>
        </div>
        <div>
            <RouterLink class="block bg-indigo-800 hover:bg-indigo-900 rounded-md !text-white py-2 px-4" :to="{name: 'account'}">Tableau de bord</RouterLink>
        </div>
        <div v-if="token" class="flex items-center gap-2">
            <RouterLink :to="{name: 'shop_coins'}"  >
                <CoinIcon />
            </RouterLink>
            <p>{{coins}}</p>
        </div>

        <div v-if="token && user" class="relative w-12 h-12 rounded" >
            <div v-if="user.avatar" class="w-full h-full cursor-pointer" @mouseover="toggleMenuUser" @mouseleave="closeMenuUser">
                <img class="w-full h-full rounded-full object-cover" :src="BACK_URL + user.avatar.filepath" alt="avatar" fetchpriority="high">
            </div>
            <div v-else class="w-full h-full cursor-pointer" @click="toggleMenuUser" @mouseover="toggleMenuUser" @mouseleave="closeMenuUser">
                <div class="flex items-center justify-center w-full h-full bg-novelize-primary rounded-full ">
                    <p>{{ user.name.slice(0, 1).toUpperCase() + user.lastname.slice(0, 1).toUpperCase()}}</p>
                </div>
            </div>
            <div v-if="menuUser" class="absolute right-0 w-60 z-50 bg-novelize-darklight rounded-lg my-2" @mouseover="toggleMenuUser" @mouseleave="closeMenuUser">
                <div class="my-3 px-4">
                    <p class="font-semibold"> {{ user.name }} {{ user.lastname }} </p>
                    <p class="text-zinc-300">{{ user.email }}</p>
                </div>
                <div class="w-full h-[1px] bg-zinc-600"></div>
                <div>
                    <p class="cursor-pointer hover:bg-novelize-primary/20 py-3 px-4" @click="logout">Se déconnecter</p>
                </div>
            </div>
        </div>
        <div v-else class="flex items-center">
            <RouterLink class="rounded-md hover:bg-novelize-primary/40 px-5 py-2" :to="{name: 'login'}">Se connecter</RouterLink>
            <Button
                class="hidden md:block mx-4"
                label="Sign up"
                :btnStyle="1"
                :to="{name: 'register'}"
            >
            </Button>
        </div>

    </div>
    <div v-if="isSearchMobile" class="md:hidden absolute left-0 z-50 flex items-center justify-between w-full h-full bg-novelize-dark px-6">
        <input v-model="search" class="w-10/12 bg-novelize-darklight !text-white rounded-lg px-4 py-2" type="text" placeholder="Search" @input="debounceSeach" @focusin="toggleSearch" @focusout="toggleSearch">
        <i class="fa-solid fa-xmark text-2xl text-white" @click="toggleSearchMobile"></i>
        <div v-if="isSearching && novels && novels.length > 0" class="absolute top-16 left-0 z-50 flex flex-col gap-2 w-full bg-novelize-darklight my-2 p-1 lg:p-4">
            <div v-for="(novel, index) in novels" :key="index" class="flex gap-4">
                <img class="w-16 h-24 object-cover rounded-lg" :src="novel.cover ? (BACK_URL + novel.cover.filepath) : ''" alt="">
                <div class="col-span-5">
                    <div class="flex gap-2 mb-2">
                        <p v-for="(category, index) in novel.categories" :key="index" class="text-novelize-secondary text-xs">{{ category.name }}</p>
                    </div>
                    <RouterLink :to="{name: 'read_novel', params: {novel_slug: novel.slug}}" class="hover:text-novelize-primary">{{ novel.title }}</RouterLink>
                    <div class="flex gap-2 text-xs">
                        <IconText :text="novel.quantiteChapitre + ' Chapitres'" color="bg-novelize-primary"/>
                        <p>-</p>
                        <p class="text-zinc-300">{{ novel.author.name }} {{ novel.author.lastname }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/stores/auth.js'
import Button from '../Button.vue';
import CoinIcon from '../CoinIcon.vue';
import IconText from '../IconText.vue';
import { watch } from 'vue';
import { ref } from 'vue';

import axios from 'axios';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const store = useAuth()
const { token, coins, user } = storeToRefs(store);
const { logout } = store;

const novels = ref();
const isSearching = ref(false);
const debounceTimer = ref(null);
const search = ref('');

function debounceSeach(){
    clearTimeout(debounceTimer.value);
    debounceTimer.value = setTimeout(() => {
        searchNovels();
    }, 500);
}

function toggleSearch(){
    setTimeout(() => {
        isSearching.value = !isSearching.value;
    }, 1000);
}

function searchNovels(){
    axios.get('/novel/search?search=' + search.value )
    .then(res => {
        novels.value = res.data;
    })
    .catch(err => {
        console.log(err);
    })
}

const menuUser = ref(false);
const isSearchMobile = ref(false);
const timer = ref(false);


function toggleMenuUser() {
    menuUser.value = true;
    clearTimeout(timer.value);
}

function closeMenuUser(){
    timer.value = setTimeout(() => {
        menuUser.value = false;
    }, 300);
}

function toggleSearchMobile(){
    isSearchMobile.value = !isSearchMobile.value;
}

watch(token, (newToken) => {
    token.value = newToken;
})
</script>

<style scoped lang="scss">
a.router-link-exact-active{
    color: $color-primary;
}
</style>
