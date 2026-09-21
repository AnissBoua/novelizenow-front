<template>
  <AuthLayout mode="register" :error="errors.general" :submitting="submitting" @submit="register">
    <div class="grid grid-cols-2 gap-3.5">
      <label class="block">
        <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Prénom</span>
        <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
          <iconify-icon icon="tabler:feather" class="text-[18px] text-[#868DA3] flex-none"></iconify-icon>
          <input v-model="name" type="text" placeholder="Lise" autocomplete="given-name" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]">
        </span>
      </label>
      <label class="block">
        <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Nom</span>
        <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
          <input v-model="lastname" type="text" placeholder="Marchand" autocomplete="family-name" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]">
        </span>
      </label>
    </div>
    <span class="block text-[13px] text-[#6B7286] -mt-1.5">C'est le nom affiché sur vos chapitres. Modifiable à tout moment.</span>

    <label class="block">
      <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Nom d'utilisateur</span>
      <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
        <iconify-icon icon="tabler:at" class="text-[18px] text-[#868DA3] flex-none"></iconify-icon>
        <input v-model="username" type="text" placeholder="lisemarchand" autocomplete="username" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]">
      </span>
    </label>

    <label class="block">
      <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Adresse e-mail</span>
      <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
        <iconify-icon icon="tabler:mail" class="text-[18px] text-[#868DA3] flex-none"></iconify-icon>
        <input v-model="email" type="email" placeholder="vous@exemple.com" autocomplete="email" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]">
      </span>
    </label>

    <div class="grid grid-cols-2 gap-3.5">
      <label class="block">
        <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Mot de passe</span>
        <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
          <iconify-icon icon="tabler:lock" class="text-[18px] text-[#868DA3] flex-none"></iconify-icon>
          <input v-model="password" :type="reveal ? 'text' : 'password'" placeholder="8 caractères minimum" autocomplete="new-password" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]" @blur="checkPasswordFormat">
          <button type="button" class="flex-none border-0 bg-transparent p-1 text-[#6B7286] hover:text-[#3138B0]" @click="reveal = !reveal">
            <iconify-icon :icon="reveal ? 'tabler:eye-off' : 'tabler:eye'" class="text-[18px]"></iconify-icon>
          </button>
        </span>
      </label>
      <label class="block">
        <span class="block text-sm font-semibold text-[#333B54] mb-1.5">Confirmer</span>
        <span class="flex items-center gap-2.5 bg-white border border-[#DCDEE8] rounded-lg px-3.5 h-[46px]">
          <input v-model="confirmpassword" :type="reveal ? 'text' : 'password'" placeholder="8 caractères minimum" autocomplete="new-password" required class="flex-1 min-w-0 border-0 bg-transparent outline-none text-[15px]" @blur="checkConfirmPassword">
        </span>
      </label>
    </div>

    <label class="flex items-start gap-2.5 text-sm leading-relaxed text-[#3A4260]">
      <input v-model="acceptedTerms" type="checkbox" required class="w-[17px] h-[17px] mt-0.5 accent-[#3138B0] flex-none">
      <span>J'accepte les <a href="#" title="Bientôt disponible" class="text-[#3138B0] font-semibold">conditions d'utilisation</a> et la <a href="#" title="Bientôt disponible" class="text-[#3138B0] font-semibold">politique de confidentialité</a>.</span>
    </label>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";
import AuthLayout from "@/components/auth/AuthLayout.vue";

const router = useRouter();

const name = ref("");
const lastname = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmpassword = ref("");
const acceptedTerms = ref(false);
const reveal = ref(false);
const submitting = ref(false);
const errors = ref({
  general: null,
});
let compliantPassword = ref(false);

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
  submitting.value = true;
  errors.value.general = null;
  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("lastname", lastname.value);
  formData.append("username", username.value);
  formData.append("email", email.value);
  formData.append("password", password.value);
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
    })
    .finally(() => {
      submitting.value = false;
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
