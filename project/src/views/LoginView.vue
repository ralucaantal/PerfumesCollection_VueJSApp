<template>
  <div class="main" @submit.prevent="login">
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
      <p>{{ message }}</p>
    </form>
  </div>
</template>

<script>
import { requestOptions, base_url } from "@/utils/requestOptions";
import router from "@/router";
import { ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const email = ref("");
    const password = ref("");
    const message = ref("");
    function login() {
      // console.log("Am intrat in loginMethod...");
      // console.log(
      //   "Vrei sa faci login cu email",
      //   email.value,
      //   "si parola",
      //   password.value
      // );

      if (password.value == "" || email.value == "") {
        message.value = "Password or email cannot be null.";
      }

      if (email.value && password.value) {
        //console.log("e ok");

        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          email: email.value,
          password: password.value,
        };

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "login", localRequestOptions)
          .then((res) => res.json())
          .then((data) => {
            //console.log(data.message);
            //console.log(data.isOk)
            if (data.isOk === "true") {
              //console.log("am intrat aici")
              localStorage.setItem("token", data.message);
              router.replace("/");
              store.dispatch("login");
            } else {
              message.value = "Authentication failed. Check the entered data.";
            }
          });
      } else {
        console.log("Nu s-au îndeplinit condițiile pentru login.");
        console.log("Email:", email.value);
        console.log("Parolă:", password.value);
        console.log("Mesaj:", message.value);
      }
    }

    watch(
      () => store.state.message, // Urmează aceeași structură ca în exemplul anterior
      (newValue) => {
        message.value = newValue; // Actualizează variabila message cu noua valoare din store
        //console.log("Mesaj din store:", message.value); // Afișează mesajul în consolă
      }
    );

    return { email, password, login, message };
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
  border: 2px solid #4f3b78;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 20px;
}

h1 {
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  margin: 0.75rem 0;
  box-sizing: border-box;
  border: 2px solid #4f3b78;
  border-radius: 5px;
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
