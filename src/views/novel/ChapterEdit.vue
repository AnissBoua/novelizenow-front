<template>
  <div class="chapter_edit w-full">
    <div class="flex justify-center">
      <form class="w-full sm:w-8/12 flex flex-col overflow-y-auto px-4 sm:px-0"> 
        <div v-if="chapterId && data" class="path_container">
          <router-link
            :to="{
              name: 'read_novel',
              params: { novel_slug: data.novel.slug},
            }"
            class="!text-novelize-primarylight hover:!text-novelize-primary"
            > Retour au roman
          </router-link>
        </div>
        <div class="flex justify-between items-center col-span-12 my-4">
          <h3>Formulaire de chapitre</h3>
          <div class="flex gap-4">
            <Button
              v-if="chapterId"
              @click.prevent="onSubmit('update')"
              class="col-start-11 mt-2"
              label="Mettre à jour"
            />
            <Button
              v-else
              @click.prevent="onSubmit('add')"
              class="col-start-11 mt-2"
              label="Ajouter"
            />
            <Button
              v-if="chapterId"
              @click.prevent="onSubmit('delete')"
              class="col-start-12 mt-2"
              bgColor="bg-red-600"
              label="Supprimer"
            />
          </div>
        </div>
        <div class="col-start-1 col-end-13 row-start-2">
          <TextInput v-model="title" placeholder="Titre du chapitre" id="titre" />
        </div>
        <div v-if="chapterId" class="col-span-12 font-semibold my-4">
          <p>Statut</p>
          <select class="bg-novelize-darklight text-white text-sm rounded-lg rounded-b-none block w-full p-2.5 dark:text-white outline-none my-1" name="categories" id="categories" @change="onSelectionChange">
              <option value="In progess" >En cours</option>
              <option value="Published">Publié</option>
          </select>
        </div>
        <div class="flex justify-end col-span-12">
          <RouterLink v-if="chapterId" :to="{ name: 'page_edit', params: { novel_id: novelId, chapter_id: chapterId } }" class="!text-novelize-primary hover:!text-novelize-primarylight ">Nouvelle page</RouterLink>
        </div>
        <draggable
          class="col-start-1 col-end-13 mt-3"
          v-model="pageState"
          item-key="id"
        >
          <template #item="{ element: pageId }">
            <DraggablePageCard
              :page="getPagesByIds(pageId)"
              :chapterId="chapterId"
              :novelId="novelId"
              @up="moveUpOrDown"
              @down="moveUpOrDown"
              @delete="openAlertDeletePage"
            />
          </template>
        </draggable>
      </form>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/modals.js";
import axios from "axios";
import alertModal from "@/components/alertModal.vue";
import Select from "@/components/inputs/Select.vue";
import DraggablePageCard from "../../components/DraggablePageCard.vue";
import draggable from "vuedraggable";
import TextInput from '@/components/inputs/TextInput.vue';


export default {
  setup() {
    let modalStore = useModalStore();
    const { alertModalState } = storeToRefs(modalStore);

    return {
      modalStore,
      alertModalState,
    };
  },
  components: {
    alertModal,
    Select,
    DraggablePageCard,
    draggable,
    TextInput,
  },
  data() {
    return {
      novelId: this.$route.params.novel_id,
      chapterId: this.$route.params.chapter_id,
      data: null,
      title: null,
      initialValue: null,
      status: null,
      pageState: [],
      pages: null,
      pageToDelete: null,
      newChapterId: null,
    };
  },
  async mounted() {
    if (this.chapterId) {
      try {
        let response = await axios.get(`chapter/${this.chapterId}`);
        this.data = response.data;
        this.title = response.data.title;
        this.initialValue = response.data.status;
        this.status = response.data.status;
        this.pages = response.data.pages;
        if (response.data.pageState.length === 0) {
          response.data.pages.forEach((page) => {
            this.pageState.push(page.id);
          });
        } else {
          this.pageState = response.data.pageState;
        }
        if (this.pageState.length !== this.pages.length) {
          this.pages.forEach((page) => {
            if (this.pageState.indexOf(page.id) === -1) {
              this.pageState.push(page.id);
              this.onSubmit("update");
            }
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }
  },
  methods: {
    getPagesByIds(id) {
      const page = this.pages.find((page) => page.id === id);
      return page;
    },
    moveUpOrDown(data) {
      const oldIndex = this.pageState.indexOf(data.id);
      let newIndex;
      if (data.where === "up") {
        newIndex = this.pageState.indexOf(data.id) - 1;
      } else {
        newIndex = this.pageState.indexOf(data.id) + 1;
      }
      if (newIndex >= 0 && newIndex < this.pageState.length) {
        this.pageState.splice(oldIndex, 1);
        this.pageState.splice(newIndex, 0, data.id);
      }
    },
    onSubmit(type) {
      let obj = {
        title: this.title,
        status: this.status,
        novel: this.novelId,
        pageState: this.pageState,
      };
      switch (type) {
        case "add":
          this.addChapter(obj);
          break;
        case "update":
          this.updateChapter(obj);
          break;
        case "delete":
          this.openAlertDeleteChapter();
          break;
        default:
          throw new Error(`the submit type : ${type} is not supported`);
      }
    },
    async addChapter(obj) {
      obj["status"] = "in_progress";
      try {
        let response = await axios.post("chapter", obj);
        this.alertModalState = {
          open: true,
          title: "Chapitre ajouté",
          content: `Votre chapitre a été ajouté avec succès.`,
          emits:"redirectToNewChapter"
        };
        this.newChapterId = response.data.id; 
      } catch (e) {
        console.warn(e);
      }
    },
    onSelectionChange(event) {
      this.status = event.target.value;
    },
    async updateChapter(obj) {
      try {
        await axios.put(`chapter/${this.data.id}`, obj);
        this.alertModalState = {
          open: true,
          title: "Chapitre mis à jour",
          content: `Votre chapitre a été mis à jour avec succès.`,
        };
      } catch (e) {
        console.warn(e);
      }
    },
    openAlertDeleteChapter() {
      this.alertModalState = {
        open: true,
        title: "Supprimer le chapitre",
        content: `Pouvez-vous confirmer que vous souhaitez supprimer le chapitre : ${this.data.title} avec toutes les pages ?`,
        emits: "deleteChapter",
      };
    },
    openAlertDeletePage(data) {
      this.alertModalState = {
        open: true,
        title: "Supprimer la page",
        content: `Pouvez-vous confirmer que vous souhaitez supprimer la page avec l'ID interne : ${data} ?`,
        emits: "delete",
      };
      this.pageToDelete = data;
    },
    onWarningAccepted(data) {
      switch (data) {
        case "delete":
          this.deletePage();
          break;
        case "deleteChapter":
          this.deleteChapter();
          break;
        case "redirectToNovel":
          this.$router.push({name:"read_novel", params:{novel_slug:this.data.novel.slug}})
          break;
        case "redirectToNewChapter":
          this.$router.push({name:"chapter_edit", params:{chapter_id:this.newChapterId}})
          break;
        default:
          throw new Error(`The case ${data} is not treated`);
      }
    },
    async deletePage() {
      if (this.pageToDelete) {
        try {
          await axios.delete(`page/${this.pageToDelete}`);
          const index = this.pageState.indexOf(this.pageToDelete);
          if (index > -1) {
            this.pageState.splice(index, 1);
          }
          this.pageToDelete = null;
          this.alertModalState = {
            open: true,
            title: "Page supprimée",
            content: `Votre page a été supprimée avec succès.`,
          };
        } catch (e) {
          console.warn(e);
        }
      }
    },
    async deleteChapter() {
      try {
        await axios.delete(`chapter/${this.chapterId}`);
        this.alertModalState = {
            open: true,
            title: "Chapitre supprimé",
            content: `Votre chapitre a été supprimé avec succès.`,
            emits: "redirectToNovel",
        };
      } catch (error) {
        console.warn(error);
      }
    }
  },
};
</script>