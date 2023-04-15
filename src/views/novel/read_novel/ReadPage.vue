<template>
  <div class="read_page">
    <div v-if="data" class="read_page_container h-full w-7/12 m-auto">
        <div class="read_page_container_header w-11/12 m-auto flex items-center h-20">
            <i class="fa-solid fa-angle-left fa-2xl" style="color: #ffffff;"></i>
            <h3 class="text-2xl ml-2 w-full">{{data.novelTitle}}</h3>
            <div class="flex justify-end w-full h-full items-center">
                <div class="rounded-full border border-2 w-8 h-8 flex justify-center items-center mr-1"><i class="fa-solid fa-angle-left fa-xl" style="color: #ffffff;"></i></div>
                <div class="rounded-full border border-2 w-8 h-8 flex justify-center items-center ml-1"><i class="fa-solid fa-angle-right fa-xl" style="color: #ffffff;"></i></div>
            </div>
        </div>
        <div class="border"></div>
        <div class="read_page_body">
            <div class="read_page_body_html w-9/12 m-auto [&>p]:my-6">

            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
    data(){
        return {
            chapterId: this.$route.params.chapter_id,
            data:null,
        }
    },
    mounted(){
        this.getPages();
        
    },
    methods:{
        async getPages(){
            let response = await axios.get(`chapter_pages/${this.chapterId}`);
            this.data = response.data;
        },
        injectPage(page){
            let htmlContainer = document.querySelector(".read_page_body_html");
            htmlContainer.innerHTML = this.data.pages[0].html;
        }
    },
    updated() {
        this.injectPage();
    }
}
</script>

<style lang="scss" scopped>
.read_page{
    height: 93dvh;
}
</style>