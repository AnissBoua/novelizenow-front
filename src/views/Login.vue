<template>
  <section class="flex flex-col gap-4 w-10/12 md:w-6/12 mx-auto my-40">
    <h3>Se connecter</h3>
    <div class="flex flex-col md:flex-row w-full gap-4 my-4">
      <div class="w-full md:w-1/2">
        <TextInput v-model="email" placeholder="Email" id="email" type="email" />
      </div>
      <div class="w-full md:w-1/2">
        <TextInput v-model="password" placeholder="Password" id="password" type="password" />
      </div>
    </div>
    <div class="">
      <div v-if="errors.general">
        <p>{{ errors.general }}</p>
      </div>
      <div class="w-full flex justify-end">
        <Button type="button" label="Login" @click="login()"></Button>
      </div>
    </div>
    <div>
      <p>
        Vous n'avez pas de compte ?
        <RouterLink class="hover:text-novelize-primary" to="/register">Inscrivez-vous ici</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuth } from "@/stores/auth.js";
import TextInput from '@/components/inputs/TextInput.vue';


const router = useRouter();
const authStore = useAuth();
const email = ref("");
const password = ref("");
const errors = ref({
  general: null,
});

async function login() {
  const data = {
    email: email.value,
    password: password.value,
  };
  await axios.post("login", data).then((response) => {
    if (response.status === 200 && response.data.token) {
      authStore.setToken(response.data.token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      router.push({ name: "home" });
    }
  })
  .catch((error) => {
    if (error.response.status) {
      errors.value.general = "Email ou mot de passe incorrect";
    }
  });
}
</script>