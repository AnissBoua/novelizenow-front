<template>
  <div class="w-10/12 lg:w-6/12 mx-auto my-10">
    <h3 class="font-bold text-lg">
      {{ novelId ? "Modifier le roman" : "Créer un roman" }}
    </h3>
    <div class="flex flex-col gap-4 my-4">
      <TextInput
        v-model="novel.title"
        placeholder="Titre roman"
        id="titre"
        @blur="checkTitleLenght"
      />
      <TextAreaInput
        v-model="novel.resume"
        placeholder="Résumé du roman"
        id="resume"
      />
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <div class="w-full sm:w-1/2">
          <label for="price">Prix</label>
          <NumberInput
            v-model="novel.price"
            placeholder="Prix"
            id="price"
            @blur="checkPrice"
          />
        </div>
        <div class="w-full sm:w-1/2">
          <label for="status">Statut</label>
          <select
            class="bg-novelize-darklight text-white text-sm rounded-lg rounded-b-none block w-full p-2 dark:text-white outline-none"
            name="categories"
            id="categories"
            v-model="novel.status"
          >
            <option value="" disabled selected>Statut</option>
            <option value="published">Publié</option>
            <option value="unpublished">Non publié</option>
          </select>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-8">
        <div class="flex flex-col">
          <label class="my-2" for="cover">Couverture :</label>
          <FileUpload
            :fileUpload="(event) => onFileUpload(event, 'cover')"
            placeholder="Cover"
            id="cover"
          />
        </div>
        <div class="flex flex-col">
          <label class="my-2" for="banner">Bannière :</label>
          <FileUpload
            :fileUpload="(event) => onFileUpload(event, 'banner')"
            placeholder="Banner"
            id="banner"
          />
        </div>
      </div>
      <div class="my-4">
        <p class="my-2">Catégories</p>
        <select
          class="bg-novelize-darklight text-white text-sm rounded-lg rounded-b-none block w-full p-2.5 dark:text-white outline-none"
          name="categories"
          id="categories"
          @change="onCategorySelect"
        >
          <option value="" disabled selected>Choisir des catégories</option>
          <option
            v-for="(category, index) in categories"
            :key="index"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <div class="flex flex-wrap gap-4 my-2">
          <div
            class="flex items-baseline bg-novelize-primarydark border border-novelize-primary rounded-full gap-3 py-1.5 px-4"
            v-for="(category, index) in novel.categories"
            :key="index"
          >
            <p>{{ category.name }}</p>
            <i
              class="fa-solid fa-x fa-2xs cursor-pointer font-bold text-novelize-primary"
              @click="removeCategory(index)"
            ></i>
          </div>
        </div>
      </div>
      <div v-if="errors.general" class="flex bg-red-500/20 text-red-500 rounded-md overflow-hidden space-x-4 my-4">
        <div class="w-1 bg-red-500"></div>
        <div class="py-2">
          <p class="">
            {{ errors.general }}
          </p>
        </div>
      </div>
      <div class="self-end my-4">
        <Button
          :label="'Créer'"
          @click="novelId ? updateNovel() : createNovel()"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TextInput from "@/components/inputs/TextInput.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import FileUpload from "@/components/inputs/FileUpload.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuth } from "@/stores/auth.js";

const authStore = useAuth();
const { me } = authStore;

const router = useRouter();
const route = useRoute();

const errors = ref({
  general: null,
});

const novel = ref({
  title: "",
  resume: "",
  price: 0,
  status: "",
  image: null,
  banner: null,
  categories: [],
});
let novelId = null;
if (route.params.id) {
  novelId = route.params.id;
  let authorId = null;
  axios.get("novel/" + novelId).then(async (res) => {
    authorId = res.data.author.id;
    me().then((resjwt) => {
      if (resjwt.data.id === authorId) {
        novel.value.title = res.data.title;
        novel.value.resume = res.data.resume;
        novel.value.price = res.data.price;
        novel.value.status = res.data.status;
        novel.value.categories = res.data.categories;
      } else {
        novelId = null;
        router.push({ name: "author_novel" });
      }
    });
  });
}
const categories = ref(null);

axios
  .get("category")
  .then((res) => {
    categories.value = res.data;
  })
  .catch((e) => console.log(e));

function onFileUpload(event, type) {
  const file = event.target.files[0];
  switch (type) {
    case "cover":
      novel.value.image = file;
      break;
    case "banner":
      novel.value.banner = file;
      break;
  }
}

function onCategorySelect(event) {
  const categoryId = parseInt(event.target.value);
  const category = categories.value.find(
    (category) => category.id === categoryId
  );
  if (category && !novel.value.categories.includes(category)) {
    novel.value.categories.push(category);
  }
}

function removeCategory(index) {
  novel.value.categories.splice(index, 1);
}

function createNovel() {
  if (novel.value.title === "") {
    errors.value.general = "Le titre est requis";
    return;
  }
  if (novel.value.price < 1) {
    errors.value.general = "Le prix doit être supérieur à 0";
    return;
  }
  const formData = new FormData();
  formData.append("title", novel.value.title);
  formData.append("resume", novel.value.resume);
  formData.append("price", novel.value.price);
  formData.append("status", novel.value.status);
  formData.append("cover", novel.value.image);
  formData.append("banner", novel.value.banner);

  novel.value.categories.forEach((category) => {
    formData.append("category[]", category.id);
  });
  axios
    .post("novel/", formData)
    .then((res) => {
      if (res.status === 201) {
        router.push({ name: "account" });
      }
    })
    .catch((e) => console.log(e));
}

function updateNovel() {
  const formData = new FormData();
  formData.append("title", novel.value.title);
  formData.append("resume", novel.value.resume);
  formData.append("price", novel.value.price);
  formData.append("status", novel.value.status);
  formData.append("cover", novel.value.image);
  formData.append("banner", novel.value.banner);

  novel.value.categories.forEach((category) => {
    formData.append("category[]", category.id);
  });
  axios
    .post("novel/" + novelId, formData)
    .then((res) => {
      router.push({ name: "account" });
    })
    .catch((e) => console.log(e));
}

function checkTitleLenght() {
  if (novel.value.title.length < 1) {
    errors.value.general = "Le titre doit comporter au moins 1 caractère";
  } else {
    errors.value.general = null;
  }
}

function checkPrice() {
  if (novel.value.price < 0) {
    errors.value.general = "Le prix doit être positif";
  } else {
    errors.value.general = null;
  }
}
</script>
