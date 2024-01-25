<template>
    <div class="main">
      <form>
        <h1>Login</h1>
        <input type="text" placeholder="Username" class="input-field" />
        <input type="password" placeholder="Password" class="input-field" />
        <div class="login-btn">
          <button class="btn1">Login</button>
        </div>
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
    background-color: #4f3b78;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  </style>
  