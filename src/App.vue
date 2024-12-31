<script setup>
import { RouterView } from 'vue-router'
import Header from "./components/layouts/Header.vue";
import Footer from "./components/layouts/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header></Header>
    <main class="flex-1">
      <RouterView :key="$route.fullPath"/>
    </main>
    <Footer></Footer>
  </div>
</template>
