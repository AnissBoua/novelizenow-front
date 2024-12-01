<template>
  <div>
    <div v-if="data" class="h-full w-full lg:w-7/12 m-auto">
        <div class="w-12/12 flex items-center justify-between gap-4 my-4 px-4">
            <div class="flex items-center gap-4 w-full lg:w-8/12">
                <i class="hidden sm:block fa-solid fa-angle-left fa-xl lg:fa-2xl text-novelize-primarylight cursor-pointer" @click="$router.push({name:'read_novel',params:{novel_slug:$route.params.slug}})"></i>
                <RouterLink :to="{name:'read_novel',params:{novel_slug: $route.params.slug}}" class="flex items-center gap-2">
                    <h3 class="text-base sm:text-xl lg:text-2xl ml-2 w-full">{{data.novelTitle}}</h3>
                </RouterLink>
            </div>
            <div class="flex justify-end w-3/12 h-full items-center">
                <div class="rounded-full border border-2 border-novelize-primary w-8 h-8 flex justify-center items-center mr-1 cursor-pointer" :class="{'border-neutral-700': page == 1}" @click="changePage('previous')">
                    <i class="fa-solid fa-angle-left fa-xl text-white" :class="{'text-neutral-700': page == 1}"></i>
                </div>
                <div class="rounded-full border border-2 border-novelize-primary w-8 h-8 flex justify-center items-center ml-1 cursor-pointer" :class="{'border-neutral-700': page == data.pages.length}" @click="changePage('next')">
                    <i class="fa-solid fa-angle-right fa-xl text-white" :class="{'text-neutral-700': page == data.pages.length}" ></i>
                </div>
            </div>
        </div>
        <div class="border border-zinc-700"></div>
        <div class="w-full lg:w-10/12 m-auto my-4 px-4 lg:px-0 lg:my-10">
            <h4 class="text-lg sm:text-xl text-novelize-secondary text-center my-4">{{data.chapterTitle}}</h4>
            <div class="read_page_body_html [&>p]:my-6">

            </div>
        </div>
    </div>
    <div v-if="error" class="h-full w-full flex flex-col items-center bg-novelize-darklight py-20">
        <h1 class="text-2xl text-center">Oopsy</h1>
        <p class="text-center">{{ error }} you can <router-link class="!text-novelize-primary hover:!text-novelize-primarylight" :to="{
            name: 'read_novel',
            params: { novel_slug: novelSlug },
        }">buy it here</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { RouterLink } from "vue-router";
export default {
    data() {
        return {
            novelSlug: this.$route.params.slug,
            chapterId: this.$route.params.chapter_id,
            page: 0,
            data: null,
            error: "",
        };
    },
    async mounted() {
        document.addEventListener("keydown", this.SHORTCUT_KEYs);
        await this.getPages();
        if (!this.page) {
            this.changePath(1);
        }
    },
    methods: {
        async getPages() {
            try {
                let response = await axios.get(`chapter_pages/${this.chapterId}`);
                this.data = response.data;
            }
            catch (error) {
                console.log(error);
                this.error = error.response.data.detail;
            }
        },
        injectPage() {
            let htmlContainer = document.querySelector(".read_page_body_html");
            let order = this.data.pageState;
            let selectedPage = order[this.page - 1];
            const doc = this.data.pages.find(obj => obj.id === selectedPage);
            htmlContainer.innerHTML = doc.html;
        },
        changePage(type) {
            switch (type) {
                case "next":
                    if (this.page < this.data.pages.length) this.changePath(++this.page);
                    break;
                case "previous":
                    if (this.page > 1) this.changePath(--this.page);
                    break;
                default:
                    console.warn(`unknown case: ${type}`);
            }
        },
        changePath(page) {
            const url = this.$router.resolve({
                name: "read_page",
                params: { chapter_id: this.chapterId },
                query: { page }
            }).href;

            window.history.replaceState(null, '', url);
            this.page = page;
            this.injectPage();
        },
        SHORTCUT_KEYs: function (event) {
            if (event.keyCode === 37) {
                this.changePage('previous');
            }
            if (event.keyCode === 39) {
                this.changePage('next');
            }
        },
    },
    components: { RouterLink }
}
</script>