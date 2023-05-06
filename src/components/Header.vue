<template>
  <header class="header">
    <div class="header_block">
        <div>
            <img class="header_logo" src="@/assets/logos/novelizelogo.svg" alt="logo" >
        </div>
        <nav class="header_nav">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>

            <RouterLink v-if="!token" to="/login">Sign in</RouterLink>
            <RouterLink v-else to="/account">Account</RouterLink>
        </nav>
    </div>
    <div class="header_user">
        <Button
            v-if="token"
            label="Logout"
            :btnStyle="1"
            @click="logout"
        ></Button>
        <Button
            class="header_user_button"
            :label="!token ? 'Sign in' : 'Account'"
            :btnStyle="1"
            :href="!token ? '/login' : '/account'"
        >
        </Button>
    </div>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/stores/auth.js'
import Button from './Button.vue';
export default {
    setup() {
        const store = useAuth()
        const { token } = storeToRefs(store);
        const {logout} = store;

        return {
            token, logout
        }
    },
    watch: {
        token(token){
            this.token = token;
        }
    },
    components: {
        Button
    },
};
</script>

<style scoped lang="scss">
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em 3em;
    &_block{
        display: flex;
        align-items: center;
    }
    &_logo {
        width: 10em;
    }
    &_nav {
        margin: 0 2em;
        & a {
            margin: 0 0.5em;
            &.router-link-exact-active{
                color: $color-primary;
            }
        }
    }
    &_user_button{
        margin: 0 1em;
    }
    & .fa-cart-shopping{
        color: $color-primary;
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
