<template>
  <div class="md:w-7/12 my-8 mx-auto px-4 md:px-0">
    <alert-modal @acceptWarning="onWarningAccepted" />
    <div class=" grid grid-cols-8 mt-2">
      <div class="col-span-12">
        <router-link
          :to="{
            name: 'chapter_edit',
            params: { novel_id: novelId, chapter_id: chapterId },
          }"
          > Retour
        </router-link>
      </div>
      
    </div>
    <div class=" my-6 mx-auto ">
      <QuillEditor
        v-model:content="editorData"
        ref="myQuillEditor"
        theme="snow"
        contentType="html"
        :toolbar="toolbar"
        @ready="onEditorReady"
        @textChange="onEditorInput"
      />
      <p class="text_counter_container text-right my-2">
        <span :class="{ 'text-red-500': text.length > 2999 }">{{
          text.length - 1
        }}</span
        >/3000
      </p>
      <div class="flex justify-end col-start-8 col-end-8">
        <button v-if="!pageId" @click="submitPage('add')" class="text-novelize-primary hover:text-novelize-primarylight">Ajouter une page</button>
        <button v-else @click="submitPage('update')" class="text-novelize-primary hover:text-novelize-primarylight">Mettre à jour la page</button>
      </div>
    </div>
  </div>
</template>

<script>
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/modals.js";
import alertModal from "@/components/alertModal.vue";
import axios from "axios";

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
  },
  data() {
    return {
      disabled: false,
      quillInstance: null,
      editorData: "",
      text: "",
      alreadyWarned: false,
      data: null,
      pageId: this.$route.params.page_id,
      chapterId: this.$route.params.chapter_id,
      novelId: this.$route.params.novel_id,
      toolbar:[
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ align: [] }], // Ajout de l'option alignement
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }],
          ],
    };
  },
  async created() {
    if (this.pageId) {
      let response = await axios.get(`page/${this.pageId}`);
      this.data = response.data;
      this.editorData = this.data.html;
    } else {
      this.editorData = "<p>Votre nouvelle page.</p>";
    }
  },
  methods: {
    onEditorReady(editor) {
      this.quillInstance = editor;
      if (this.disabled === false) {
        this.quillInstance.enable();
      } else {
        this.quillInstance.disable();
      }
    },
    onEditorInput() {
      let text = this.quillInstance.getText();
      this.text = text;
      //décider d'une limite /!\
      let max = 3001;
      if (text.length >= max && this.alreadyWarned === false) {
        this.alertModalState = {
          open: true,
          title: "Limite de 3000 caractères atteinte",
          content: `Attention vous avez atteint la limite des 3000 caractères vous ne pourrai pas sauvegarder votre page si la limite est dépassée`,
        };
        this.alreadyWarned = true;
      } else {
        return;
      }
    },
    onWarningAccepted(data) {
      switch (data) {
        case "enableEditor":
          this.quillInstance.enable();
          break;
        case "disableEditor":
          this.quillInstance.disable();
          break;
        default:
          throw new Error(`Le cas "${data}" n'est pas traité`);
      }
    },
    submitPage(type) {
      let obj = {
        content: this.quillInstance.getText(),
        html: this.editorData,
        chapter: this.chapterId,
      };
      switch (type) {
        case "add":
          this.addPage(obj);
          break;
        case "update":
          this.updatePage(obj);
          break;
        default:
          throw new Error(`cas non traité : ${type}`);
      }
    },
    async addPage(obj) {
      try {
        await axios.post("page", obj);
        this.alertModalState = {
          open: true,
          title: "Page ajoutée",
          content: `Votre page a été ajoutée avec succès.`,
        };
      } catch (e) {
        console.warn(e);
      }
    },
    async updatePage(obj) {
      try {
        await axios.put(`page/${this.data.id}`, obj);
        this.alertModalState = {
          open: true,
          title: "Page mise à jour",
          content: `Votre page a été mise à jour avec succès.`,
        };
      } catch (e) {
        console.warn(e);
      }
    },
  },
};
</script>

<style lang="scss">
.ql- {
  &snow {
    background-color: rgba($color: #1E1E1E, $alpha: 1.0);
  }
  &container {
    height: 25rem;
  }
  &editor {
    color: #fff;
  }
  &formats {
    color: #fff !important;
  }
}
.editor_container {
  width: 30%;
  margin: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>
