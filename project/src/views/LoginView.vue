<template>
  <div class="main" @submit.prevent="loginMethod">
    <form>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Email"
        class="input-field"
        v-model="email"
      />
      <input
        type="password"
        placeholder="Password"
        class="input-field"
        v-model="password"
      />
      <div class="login-btn">
        <button class="btn1">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import { requestOptions, base_url } from "@/utils/requestOptions";
import router from "@/router";
export default {
  data() {
    return {
      email: "",
      password: "",
      message: "",
    };
  },
  methods: {
    loginMethod: function () {
      console.log("Am intrat in loginMethod...");
      console.log(
        "Vrei sa faci login cu email",
        this.email,
        "si parola",
        this.password
      );

      if (this.password == "") {
        this.message = "Parola nu poate fi nula";
      }
      if (this.email && this.password) {
        console.log("e ok");

        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          email: this.email,
          password: this.password,
        };

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "login", localRequestOptions)
          .then((res) => res.json())
          .then((data) => {
            console.log(data.message);

            localStorage.setItem("token", data.message);
            router.replace("/");
          });
      }
    },
  },
};
</script>

<style>
.main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
}

form {
  max-width: 400px;
  width: 100%;
}

h1 {
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  margin: 0.75rem 0;
  box-sizing: border-box;
}

.login-btn {
  text-align: center;
}

.btn1 {
  background-color: #4f3b78;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
