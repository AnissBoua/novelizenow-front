<template>
  <section class="registerform">
    <h3>Register</h3>
    <div class="registerform_wrap">
      <div class="registerform_block">
        <input
          v-model="name"
          class="registerform_input"
          type="text"
          name="name"
          id="name"
          placeholder="Name"
        />
      </div>
      <div class="registerform_block">
        <input
          v-model="lastname"
          class="registerform_input"
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Lastname"
        />
      </div>
    </div>
    <div>
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
    </div>
    <div class="registerform_wrap">
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
      <div class="registerform_block">
        <input
          v-model="confirmpassword"
          class="registerform_input"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm password"
        />
      </div>
    </div>
    <div class="flex flex-col">
                    <label class="my-2" for="cover">Avatar :</label>
                    <input class="flex-1 rounded-lg bg-novelize-darklight cursor-pointer outline outline-offset outline-1 outline-novelize-primary
                    file:bg-novelize-primary file:border-0 file:px-3 file:py-2 file:text-white file:mr-4 hover:file:bg-novelize-primarylight" type="file" name="cover" id="avatar">
                </div>
    <div class="registerform_wrap errors">
      <div v-if="this.errors.general">
        <p>{{ this.errors.general }}</p>
      </div>
      <div class="registerform_block_btn">
        <Button :label="'Sign up'" @click="register()"></Button>
      </div>
    </div>
    <div>
      <p>
        You already have an account ? <RouterLink to="/login">Login</RouterLink>
      </p>
    </div>
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "Registration",
  data() {
    return {
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      errors: {
        general: null,
      },
    };
  },

  methods: {
    async register() {
      let files = document.querySelector("#avatar").files;
      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('lastname', this.lastname);
      formData.append('email', this.email);
      formData.append('password', this.password);
      if(files[0]){
        formData.append("avatar", files[0]);
      }
      if(this.password === this.confirmpassword){
        try {
          const response = await axios.post(
            import.meta.env.VITE_BACK_URL + "api/registration",
            formData,
            {
              headers: {
              'Content-Type': 'multipart/form-data'
              }
            }
          );
          if (response.status === 201) {
            this.$router.push({ name: "login" });
          }
          // TODO handle other cases
        } catch (error) {
          this.errors.general = "Registration failed";
        }
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
