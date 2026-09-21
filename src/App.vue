<script setup>
import { RouterView } from 'vue-router'
import Header from "./components/layouts/Header.vue";
import Footer from "./components/layouts/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header v-if="!$route.meta.hideChrome"></Header>
    <main class="flex-1" :class="$route.meta.theme === 'light' ? 'bg-[#F3F4F8]' : ''">
      <RouterView :key="$route.fullPath"/>
    </main>
    <Footer v-if="!$route.meta.hideChrome"></Footer>
  </div>
</template>
