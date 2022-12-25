<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
        <div>
            <img class="header_logo" src="@/assets/logos/novelizelogo.svg" alt="logo" >
        </div>
        <nav class="header_nav">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
            <RouterLink to="/register">Sign up</RouterLink>
        </nav>
  </header>
</template>

<style scoped lang="scss">
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em 3em;
    &_logo {
        width: 10em;
    }
    &_nav {
        & a {
            margin: 0 0.5em;
            &.router-link-exact-active{
                color: $color-test;
            }
        }
    }
}
// .logo {
//   display: block;
//   margin: 0 auto 2rem;
// }
// header {
//   line-height: 1.5;
//   max-height: 100vh;
//   nav {
//     width: 100%;
//     font-size: 12px;
//     text-align: center;
//     margin-top: 2rem;
//     a.router-link-exact-active {
//       color: var(--color-text);
//     }
//     a.router-link-exact-active:hover {
//       background-color: transparent;
//     }
//     a {
//       display: inline-block;
//       padding: 0 1rem;
//       border-left: 1px solid var(--color-border);
//     }
//     a:first-of-type {
//       border: 0;
//     }
//   }
// }

// @media (min-width: 1024px) {
//   header {
//     display: flex;
//     place-items: center;
//     padding-right: calc(var(--section-gap) / 2);
//     nav {
//       text-align: left;
//       margin-left: -1rem;
//       font-size: 1rem;
  
//       padding: 1rem 0;
//       margin-top: 1rem;
//     }
//   }

// }
</style>
