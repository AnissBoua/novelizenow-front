<script setup>
import { RouterView } from 'vue-router'
import Header from "./components/layouts/Header.vue";
</script>

<template>
  <Header></Header>
  <RouterView :key="$route.fullPath"/>
</template>

<style scoped>
</style>
