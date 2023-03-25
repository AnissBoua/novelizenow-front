<template>
  <div class="read_book_page">
    <div class="banner grid grid-cols-12">
        <div class="novel_infos col-start-4 col-end-10">
            <img src="#" alt="tempo">
            <div class="novel_infos_desc">
              <h1>{{data.title}}</h1>
              <p>Author: {{data.author.lastname}} {{data.author.name}}</p>

            </div>
        </div>
    </div>
  </div>
  <router-view />
</template>

<script>
import axios from 'axios';

export default {
  data(){
    return{
      data:null,
      title:null,
      novelId: this.$route.params.novel_id,
    }
  },
  async created(){
    if(this.novelId){
      let response = await axios.get(`novel/${this.novelId}`);
      this.data = response.data;
      this.title = response.data.title;
    }
  }
}
</script>

<style scoped lang="scss">
.banner{
  height: 30rem;
  border: 1px solid white;
}

.novel_infos{
  display: flex;
  align-items: center;
  padding-inline: 5rem;
  img{
    border: 1px solid white;
    height: 20rem;
    width: 15rem;
  }
  &_desc{
    flex-grow: 1;
    height: 20rem;
    margin-left: 2rem;
    h1{
      font-size: 2rem;
    }
  }
}
</style>