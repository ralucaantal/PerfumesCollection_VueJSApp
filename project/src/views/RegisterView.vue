<template>
  <div class="main">
    <form @submit.prevent="registerMethod" class="form-container">
      <h1>Register</h1>
      <input
        type="email"
        placeholder="Email"
        class="input-field"
        v-model="email"
      />
      <input
        type="text"
        placeholder="Username"
        class="input-field"
        v-model="username"
      />
      <input
        type="password"
        placeholder="Password"
        class="input-field"
        v-model="password"
      />
      <div class="login-btn">
        <button class="btn1">Register</button>
      </div>
      <p>
        Have an account?
        <router-link to="/login" class="login-link">Login Here</router-link>
      </p>
      <p>{{ message }}</p>
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
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    registerMethod: function () {
      console.log("Am intrat in registerMethod...");
      console.log(
        "Vrei sa faci register cu username",
        this.username,
        "si parola",
        this.password,
        "si email: ",
        this.email
      );

      if (this.password === "" || this.email === "") {
        this.message = "Parola sau emailul nu pot fi valori nule";
      }

      if (this.email && this.password) {
        console.log("e ok");

        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          email: this.email,
          username: this.username,
          password: this.password,
        };

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "register", localRequestOptions)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.message === "User added") {
              router.replace("/login");
            } else {
              this.message = data.message;
              this.email = "";
              this.password = "";
              this.username = "";
            }
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

.form-container {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.login-link {
  color: #2196f3;
  text-decoration: underline;
  cursor: pointer;
}
</style>
