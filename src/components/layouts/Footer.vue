<template>
    <div class="flex flex-wrap gap-4 justify-between items-center bg-novelize-darklight py-4 sm:py-6 px-4 sm:px-20 mt-8">
        <RouterLink to="/">
            <img class="hidden lg:block lg:w-32" src="@/assets/logos/novelizelogo.svg" alt="logo" >
            <img class="block lg:hidden lg:w-32" src="@/assets/logos/LogoMobile.png" alt="logo" >
        </RouterLink>
        <div>
            <p class="text-xs text-zinc-300">@ 2023 All rights reverved</p>
        </div>
        <div class="flex gap-4 text-2xl">
            <a href="https://www.facebook.com/">
                <i class="fa-brands fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/">
                <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.twitter.com/">
                <i class="fa-brands fa-twitter"></i>
            </a>
        </div>
    </div>
</template>