<template>
  <header class="relative flex justify-between items-center py-4 lg:py-6 px-4 sm:px-6 lg:px-20">
    <div class="flex items-center gap-10 w-10/12 lg:w-6/12">
        <div>
            <RouterLink to="/" @click="closeMenuUser">
                <img class="hidden lg:block lg:w-32" src="@/assets/logos/novelizelogo.svg" alt="logo" >
                <img class="block lg:hidden lg:w-32" src="@/assets/logos/LogoMobile.png" alt="logo" >
            </RouterLink>

        </div>
        <div class="hidden sm:block w-8/12">
            <input class="w-full bg-novelize-darklight !text-white rounded-lg  px-4 py-2" type="text" placeholder="Search">
        </div>
    </div>
    <div class="flex items-center gap-4 sm:gap-8">
        <div class="sm:hidden" @click="toggleSearchMobile">
            <i class="fa-solid fa-magnifying-glass text-white"></i>
        </div>
        <div class="flex items-center gap-2">
            <RouterLink :to="{name: 'shop_coins'}"  >
                <CoinIcon />
            </RouterLink>
            <p>{{coins}}</p>
        </div>
        <div v-if="token && user" class="relative w-12 h-12 rounded" >
            <div v-if="user.avatar" class="w-full h-full" @click="toggleMenuUser">
                <img class="w-full h-full rounded-full object-cover" :src="BACK_URL + user.avatar" alt="avatar">
            </div>
            <div v-else class="w-full h-full" @click="toggleMenuUser" >
                <div class="flex items-center justify-center w-full h-full bg-novelize-primary rounded-full ">
                    <p>{{user.username.slice(0, 1).toUpperCase()}}</p>
                </div>
            </div>
            <div v-if="menuUser" class="absolute right-0 w-60 h-40 z-50 bg-novelize-darklight rounded-lg my-2">
                <div class="my-3 px-4">
                    <p class="font-semibold"> {{ user.name }} {{ user.lastname }} </p>
                    <p class="text-zinc-300">{{ user.email }}</p>
                </div>
                <div class="w-full h-[1px] bg-zinc-600"></div>
                <div>
                    <RouterLink class="block hover:bg-novelize-primary/20 py-3 px-4" :to="{name: 'account'}" @click="closeMenuUser">My Account</RouterLink>
                </div>
                <div class="w-full h-[1px] bg-zinc-600"></div>
                <div>
                    <p class="cursor-pointer hover:bg-novelize-primary/20 py-3 px-4" @click="logout">Logout</p>
                </div>
            </div>
        </div>
        <div v-else>
            <RouterLink class="rounded-md hover:bg-novelize-primary/40 px-5 py-2" :to="{name: 'login'}">Login</RouterLink>
            <Button
                class="mx-4"
                :label="!token ? 'Sign in' : 'Account'"
                :btnStyle="1"
                :to="{name: 'register'}"
            >
            </Button>
        </div>

    </div>
    <div v-if="isSearchMobile" class="sm:hidden absolute left-0 z-10 flex items-center justify-between w-full h-full bg-novelize-dark px-6">
        <input class="w-10/12 bg-novelize-darklight !text-white rounded-lg px-4 py-2" type="text" placeholder="Search">
        <i class="fa-solid fa-xmark text-2xl text-white" @click="toggleSearchMobile"></i>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/stores/auth.js'
import Button from '../Button.vue';
import CoinIcon from '../CoinIcon.vue';
import { watch } from 'vue';
import { ref } from 'vue';

const BACK_URL = import.meta.env.VITE_BACK_URL;

const store = useAuth()
const { token, coins, user } = storeToRefs(store);
const { logout } = store;

const menuUser = ref(false);
const isSearchMobile = ref(false);


function toggleMenuUser(){
    menuUser.value = !menuUser.value;
}

function closeMenuUser(){
    menuUser.value = false;
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
