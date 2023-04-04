<template>
  <div class="chapter_edit w-full">
    <alert-modal @acceptWarning="onWarningAccepted" />
    <div class="form_container flex justify-center">
      <form class="w-8/12 grid grid-cols-12">
        <Button
          v-if="chapterId"
          @click.prevent="onSubmit('update')"
          class="col-start-12 mt-2"
          label="Update"
        />
        <Button
          v-else
          @click.prevent="onSubmit('add')"
          class="col-start-12 mt-2"
          label="Add"
        />
        <div class="col-start-1 col-end-13 row-start-2">
          <label for="first_name" class="block mb-2 text-lg font-medium"
            >Chapter</label
          >
          <input
            v-model="title"
            type="text"
            id="first_name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Chapter name"
            required
          />
        </div>
        <Select
          v-if="chapterId"
          class="col-start-1 col-end-13 flex flex-col mt-2"
          :initialValue="initialValue"
          textColor="text-black"
          bgColor="bg-white"
          :options="['In progess', 'Published']"
          label="Status"
          @selection-change="onSelectionChange"
        />
        <Button
          v-if="chapterId"
          @click.prevent="
            $router.push({
              name: 'page_edit',
              params: { novel_id: novelId, chapter_id: chapterId },
            })
          "
          class="col-start-12 mt-2"
          label="New page"
        />
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
        default:
          throw new Error(`the submit type : ${type} is not supported`);
      }
    },
    async addChapter(obj) {
      obj["status"] = "In progress";
      try {
        await axios.post("chapter", obj);
        this.alertModalState = {
          open: true,
          title: "Chapter added",
          content: `Your chapter has been added successfully.`,
        };
      } catch (e) {
        console.warn(e);
      }
    },
    onSelectionChange(selection) {
      this.status = selection;
    },
    async updateChapter(obj) {
      try {
        await axios.put(`chapter/${this.data.id}`, obj);
        this.alertModalState = {
          open: true,
          title: "Chapter updated",
          content: `Your chapter has been updated successfully.`,
        };
      } catch (e) {
        console.warn(e);
      }
    },
    openAlertDeletePage(data) {
      this.alertModalState = {
        open: true,
        title: "Delete page",
        content: `Can you confirm that you want to delete the page with the intern id : ${data} ?`,
        emits: "delete",
      };
      this.pageToDelete = data;
    },
    onWarningAccepted(data) {
      switch (data) {
        case "delete":
          this.deletePage();
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
            title: "Page deleted",
            content: `Your page has been deleted successfully.`,
          };
        } catch (e) {
          console.warn(e);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter_edit {
  height: 93dvh;
}

.drag_board_container {
  min-height: 50vh;
  border: 1px solid;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
