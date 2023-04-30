<template>
  <div class="read_page">
    <div v-if="data" class="read_page_container h-full w-7/12 m-auto">
        <div class="read_page_container_header w-11/12 m-auto flex items-center h-20">
            <i class="fa-solid fa-angle-left fa-2xl cursor-pointer" style="color: #ffffff;" @click="$router.push({name:'read_novel',params:{novel_slug:$route.params.slug}})"></i>
            <h3 class="text-2xl ml-2 w-full">{{data.novelTitle}}</h3>
            <div class="flex justify-end w-full h-full items-center">
                <div class="rounded-full border border-2 w-8 h-8 flex justify-center items-center mr-1 cursor-pointer" @click="changePage('previous')"><i class="fa-solid fa-angle-left fa-xl" style="color: #ffffff;"></i></div>
                <div class="rounded-full border border-2 w-8 h-8 flex justify-center items-center ml-1 cursor-pointer" @click="changePage('next')"><i class="fa-solid fa-angle-right fa-xl" style="color: #ffffff;"></i></div>
            </div>
        </div>
        <div class="border"></div>
        <div class="read_page_body">
            <div class="read_page_body_html w-9/12 m-auto [&>p]:my-6">

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
export default {
    data(){
        return {
            chapterId: this.$route.params.chapter_id,
            pageParam:this.$route.query.page,
            novelSlug: this.$route.params.slug,
            data:null,
            error:"",
        }
    },
    async mounted(){
        await this.getPages();
        if(!this.pageParam){
            this.$router.push({ name: 'read_page',params:{chapter_id : this.chapterId}, query: { page: 1}})
            this.injectPage(this.pageParam);
        }
        if (this.data && this.pageParam) {
            this.injectPage(this.pageParam);
        }
    },
    methods:{
        async getPages(){
            try {
                let response = await axios.get(`chapter_pages/${this.chapterId}`);
                this.data = response.data;
                console.log(this.data);
            } catch (error) {
                console.log(error);
                this.error = error.response.data.detail;
            }
        },
        injectPage(page){
            let htmlContainer = document.querySelector(".read_page_body_html");
            let order = this.data.pageState;
            let selectedPage = order[page-1];
            const myPage = this.data.pages.find(obj => obj.id === selectedPage);
            htmlContainer.innerHTML = myPage.html;
        },
        changePage(type){
            switch (type){
                case "next":
                    if(this.pageParam < this.data.pages.length){
                        let nextPage = ++this.pageParam;
                        console.log(`param : ${this.pageParam}`);
                        this.$router.push({ name: 'read_page',params:{chapter_id : this.chapterId}, query: { page: nextPage}})
                    }
                    break;
                case "previous":
                    if(this.pageParam > 1){
                        let previousPage = --this.pageParam;
                        this.$router.push({ name: 'read_page',params:{chapter_id : this.chapterId}, query: { page: previousPage}})
                    }
                    break;
                default:
                    console.warn(`unknown case: ${type}`);
            }
        }
    },
    
}
</script>

<style lang="scss" scopped>
.read_page{
    height: 93dvh;
}
</style>