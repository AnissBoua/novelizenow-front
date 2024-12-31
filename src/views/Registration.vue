<template>
  <section class="flex flex-col gap-4 w-10/12 md:w-1/2 mx-auto my-20">
    <h3>S'inscrire</h3>
    <div class="flex flex-col md:flex-row w-full gap-4">
      <div class="w-full md:w-1/2">
        <TextInput v-model="name" placeholder="Prénom" id="name" />
      </div>
      <div class="w-full md:w-1/2">
        <TextInput v-model="lastname" placeholder="Nom de famille" id="lastname" />
      </div>
    </div>
    <div>
      <div class="w-full">
        <TextInput
          v-model="email"
          placeholder="Email"
          id="email"
          type="email"
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-row w-full gap-4">
      <div class="w-full md:w-1/2">
        <TextInput
          v-model="password"
          placeholder="Mot de passe"
          id="password"
          type="password"
          @blur="checkPasswordFormat"
        />
      </div>
      <div class="w-full md:w-1/2">
        <TextInput
          v-model="confirmpassword"
          placeholder="Confirmer le mot de passe"
          id="confirmPassword"
          type="password"
          @blur="checkConfirmPassword"
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-row md:items-end gap-4">
      <div class="flex flex-col w-full md:w-1/2">
        <label class="my-2" for="cover">Avatar :</label>
        <FileUpload
          :fileUpload="(event) => onFileUpload(event)"
          placeholder="Banner"
          id="banner"
        />
      </div>
      <div class="w-full md:w-1/2">
        <TextInput v-model="username" placeholder="Username" id="username" />
      </div>
    </div>

    <div>
      <div v-if="errors.general">
        <p>{{ errors.general }}</p>
      </div>
      <div class="flex justify-end w-full">
        <Button :label="'Sign up'" @click="register()"></Button>
      </div>
    </div>
    <div>
      <p>
        Vous avez déjà un compte ?
        <RouterLink class="hover:text-novelize-primary" to="/login"
          >Se connecter</RouterLink
        >
      </p>
    </div>
  </section>
</template>

<script setup>
import TextInput from "@/components/inputs/TextInput.vue";
import FileUpload from "@/components/inputs/FileUpload.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";

const router = useRouter();

const name = ref("");
const lastname = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmpassword = ref("");
const avatar = ref(null);
const errors = ref({
  general: null,
});
let compliantPassword = ref(false);

function onFileUpload(event) {
  const file = event.target.files[0];
  avatar.value = file;
}

async function register() {
  if (compliantPassword.value === false) {
    errors.value.general =
      "Le mot de passe doit contenir au moins 8 caractères, 1 lettre majuscule et 1 lettre minuscule.";
    return;
  }
  if (password.value !== confirmpassword.value) {
    errors.value.general = "Les mots de passe ne correspondent pas.";
    return;
  }
  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("lastname", lastname.value);
  formData.append("email", email.value);
  formData.append("password", password.value);
  if (avatar.value) {
    formData.append("avatar", avatar.value);
  }
  await axios
    .post("registration", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 201) {
        router.push({ name: "login" });
      }
    })
    .catch((error) => {
      if (error.response.status === 409) {
        errors.value.general = error.response.data.message;
      } else {
        errors.value.general = "L'inscription a échoué.";
      }
    });
}

function checkPasswordFormat() {
  let regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.{8,})^";
  if (!password.value.match(regex)) {
    errors.value.general =
      "Le mot de passe doit contenir au moins 8 caractères, 1 lettre majuscule et 1 lettre minuscule.";
    compliantPassword.value = false;
  } else {
    errors.value.general = null;
    compliantPassword.value = true;
  }
}

function checkConfirmPassword() {
  if (password.value !== confirmpassword.value) {
    errors.value.general = "Les mots de passe ne correspondent pas.";
  } else {
    errors.value.general = null;
  }
}
</script>
