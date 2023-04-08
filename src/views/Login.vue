<template>
  <section class="registerform">
    <h3>Login</h3>
    <div class="registerform_wrap">
      <div class="registerform_block">
        <input
          v-model="email"
          class="registerform_input"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
        />
      </div>
      <div class="registerform_block">
        <input
          v-model="password"
          class="registerform_input"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
        />
      </div>
    </div>
    <div class="registerform_wrap errors">
      <div v-if="this.errors.general">
        <p>{{ this.errors.general }}</p>
      </div>
      <div class="registerform_block_btn">
        <Button :label="'Login'" @click="login()"></Button>
      </div>
    </div>
    <div>
      <p>
        You don't have an account ?
        <RouterLink to="/register">Sign up here</RouterLink>
      </p>
    </div>
  </section>
</template>

<script>
import { RouterLink } from "vue-router";
import axios from "axios";
import { useAuth } from "@/stores/auth.js";

export default {
  name: "Registration",
  data() {
    return {
      authStore: useAuth(),
      email: "",
      password: "",
      errors: {
        general: null,
      },
    };
  },

  methods: {
    async login() {
      const data = {
        email: this.email,
        password: this.password,
      };
      // TODO
      try {
        const response = await axios.post(
          import.meta.env.VITE_BACK_URL + "api/login",
          data
        );
        if (response.status === 200 && response.data.token) {
          this.authStore.setToken(response.data.token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          this.$router.push({ name: "home" });
        }
      } catch (error) {
        if (error.response.status) {
          this.errors.general = "Wrong email or password";
        }
        console.log(error.response.status);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.registerform {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  height: 25em;
  margin: auto;
  &_wrap {
    display: flex;
    &.errors {
      height: 3em;
      align-items: center;
    }
  }
  &_block {
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
    margin: 0.5em 0.5em;
    &_btn {
      margin-left: auto;
    }
  }
  &_input {
    font-family: $font-family;
    font-weight: 600;
    border-radius: $border-radius;
    border: $border;
    padding: 0.5em 1em;
  }
}
</style>
