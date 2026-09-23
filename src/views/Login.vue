<template>
  <AuthLayout mode="login" :error="errors.general" :submitting="submitting" @submit="login">
    <label class="block">
      <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Adresse e-mail</span>
      <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
        <iconify-icon icon="tabler:mail" class="text-[18px] text-[#868DA3] flex-none"></iconify-icon>
        <input v-model="email" type="email" placeholder="vous@exemple.com" autocomplete="email" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]">
      </span>
    </label>

    <label class="block">
      <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Mot de passe</span>
      <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
        <iconify-icon icon="tabler:lock" class="text-[18px] text-[#868DA3] flex-none"></iconify-icon>
        <input v-model="password" :type="reveal ? 'text' : 'password'" placeholder="Votre mot de passe" autocomplete="current-password" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]">
        <button type="button" class="flex-none border-0 bg-transparent p-1 text-[#6B7286] hover:text-[#3138B0]" @click="reveal = !reveal">
          <iconify-icon :icon="reveal ? 'tabler:eye-off' : 'tabler:eye'" class="text-[18px]"></iconify-icon>
        </button>
      </span>
    </label>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuth } from "@/stores/auth.js";
import AuthLayout from "@/components/auth/AuthLayout.vue";

const router = useRouter();
const authStore = useAuth();
const email = ref("");
const password = ref("");
const reveal = ref(false);
const submitting = ref(false);
const errors = ref({
  general: null,
});

async function login() {
  submitting.value = true;
  errors.value.general = null;
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
  })
  .finally(() => {
    submitting.value = false;
  });
}
</script>
