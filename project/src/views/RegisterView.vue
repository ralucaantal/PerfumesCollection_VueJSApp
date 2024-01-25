<template>
  <div class="main">
    <form>
      <h1>Register</h1>
      <input type="email" placeholder="Email" class="input-field" />
      <input type="text" placeholder="Username" class="input-field" />
      <input type="password" placeholder="Password" class="input-field" />
      <input type="password" placeholder="Confirm Password" class="input-field" />
      <div class="login-btn">
        <button class="btn1">Register</button>
      </div>
      <p>
        Have an account?
        <router-link to="/login" class="login-link">Login Here</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {};
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
