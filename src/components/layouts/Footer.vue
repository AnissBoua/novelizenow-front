<template>
    <div class="flex flex-wrap gap-4 justify-between items-center bg-novelize-darklight py-4 sm:py-6 px-4 sm:px-20 mt-8">
        <RouterLink to="/">
            <img class="hidden lg:block lg:w-32" src="@/assets/logos/novelizelogo.svg" alt="logo" >
            <img class="block lg:hidden lg:w-32" src="@/assets/logos/LogoMobile.png" alt="logo" >
        </RouterLink>
        <div>
            <p class="text-xs text-zinc-300">@ 2023 All rights reverved</p>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <div class="flex items-center space-x-2">
                <p class="text-zinc-300">Hugo tran</p>
                <div class="flex gap-4 text-2xl">
                    <a href="https://github.com/Tran-Hugo">
                        <i class="fa-brands fa-github hover:text-novelize-primarylight"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/hugo-tran-202569233/">
                        <i class="fa-brands fa-linkedin hover:text-novelize-primarylight"></i>
                    </a>
                </div>
            </div>
            <p class="hidden sm:block"> | </p>
            <div class="flex items-center space-x-2">
                <p class="text-zinc-300">Anisse Bouainbi</p>
                <div class="flex gap-4 text-2xl">
                    <a href="https://github.com/AnissBoua">
                        <i class="fa-brands fa-github hover:text-novelize-primarylight"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/anisse-bouainbi/">
                        <i class="fa-brands fa-linkedin hover:text-novelize-primarylight"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>