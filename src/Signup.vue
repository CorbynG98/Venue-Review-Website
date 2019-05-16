<template>
  <div class="outer">
    <div class="md-form">
      <form v-on:submit="login()">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" class="form-control input" v-model="firstName" required>
        </div>
        <div class="form-group">
          <label>Family Name</label>
          <input type="text" class="form-control input" v-model="lastName" required>
        </div>
        <div class="form-group">
          <label>Username</label>
          <input type="text" class="form-control input" v-model="username" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="text" class="form-control input" v-model="email" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-bind:class="{ error: checkPass, valid: samePass }" type="password" class="form-control input pass" v-model="password" required>
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input v-bind:class="{ error: checkPass, valid: samePass }" type="password" class="form-control input pass" v-model="confirmPassword" required>
        </div>
        <button type="button" class="btn btn-primary" v-on:click="signup()">Sign up</button>
      </form>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
          return {
            error: "",
            errorFlag: false,
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            passCheck: this.password != this.confirmPassword
          }
        },
      computed: {
        'checkPass': function() {
          this.passCheck = this.password != this.confirmPassword;
          return this.passCheck;
        },
        'samePass': function() {
          if (!this.passCheck && this.password != "" && this.confirmPassword != "") return true;
          return false;
        }
      },
      methods: {
        signup: function() {
          // This is where the code to sign up the user will go
        }
      }
    }
</script>

<style scoped>
  .md-form {
    background: rgba(100, 100, 100, 0.1);
    box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 5%;
    position: absolute;
    left: 30%;
    right: 30%;
    padding: 3% 5%;
    width: 40%;
    margin: auto;
    top: 7rem;
  }

  .form-group {
    margin-bottom: 2rem;
  }

  .outer {
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .btn {
    width: 50%;
  }

  label {
    margin: 0;
    padding: 0;
    float: left;
    margin-left: 0.5rem;
  }

  .error {
    border-color: rgba(252, 47, 51, 0.8);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(252, 47, 51, 0.6);
    outline: 0 none;
  }

  .valid {
    border-color: rgba(43, 255, 75, 0.8);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(43, 255, 75, 0.6);
    outline: 0 none;
  }
</style>
