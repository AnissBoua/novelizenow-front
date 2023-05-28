<template>
  <section class="flex flex-col gap-4 w-10/12 md:w-1/2 mx-auto my-20">
    <h3>Register</h3>
    <div class="flex flex-col md:flex-row w-full gap-4">
      <div class="w-full md:w-1/2">
        <TextInput v-model="name" placeholder="Name" id="name" />
      </div>
      <div class="w-full md:w-1/2">
        <TextInput v-model="lastname" placeholder="Lastname" id="lastname" />
      </div>
    </div>
    <div >
      <div class="w-full">
        <TextInput v-model="email" placeholder="Email" id="email" type="email" />
      </div>
    </div>
    <div class="flex flex-col md:flex-row w-full gap-4">
      <div class="w-full md:w-1/2">
        <TextInput v-model="password" placeholder="Password" id="password" type="password" />
      </div>
      <div class="w-full md:w-1/2">
        <TextInput v-model="confirmpassword" placeholder="Confirm password" id="confirmPassword" type="password" />
      </div>
    </div>
    <div class="flex flex-col md:flex-row md:items-end gap-4">
      <div class="flex flex-col w-full md:w-1/2">
        <label class="my-2" for="cover">Avatar :</label>
        <FileUpload :fileUpload="(event) => onFileUpload(event)" placeholder="Banner" id="banner" />
      </div>
      <div class="w-full md:w-1/2">
        <TextInput v-model="username" placeholder="Username" id="username"  />
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
        You already have an account ? <RouterLink class="hover:text-novelize-primary" to="/login">Login</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import TextInput from '@/components/inputs/TextInput.vue';
import FileUpload from '@/components/inputs/FileUpload.vue';
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

function onFileUpload(event) {
  const file = event.target.files[0];
  avatar.value = file;
}

async function register() {
  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('lastname', lastname.value);
  formData.append('email', email.value);
  formData.append('password', password.value);
  if(avatar.value){
    formData.append("avatar", avatar.value);
  }
  if(password.value === confirmpassword.value){
    await axios.post("registration", formData,
      {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
      }
    ).then((response) => {
      if (response.status === 201) {
        router.push({ name: "login" });
      }
    }).catch((error) => {
      errors.value.general = "Registration failed";
    });
  }
}
</script>