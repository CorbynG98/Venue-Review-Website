<template>
  <div class="outer">
    <div class="md-form">
      <form v-on:submit="login()">
        <div class="form-group">
          <label>First Name</label>
          <input
            v-bind:class="[validFName ? 'valid' : 'error']"
            maxlength="64"
            type="text"
            class="form-control input"
            v-model="firstName"
            required
          />
        </div>
        <div class="form-group">
          <label>Family Name</label>
          <input
            v-bind:class="[validLName ? 'valid' : 'error']"
            maxlength="64"
            type="text"
            class="form-control input"
            v-model="lastName"
            required
          />
        </div>
        <div class="form-group">
          <label>Username</label>
          <input
            v-bind:class="[validUsername ? 'valid' : 'error']"
            maxlength="64"
            type="text"
            class="form-control input"
            v-model="username"
            required
          />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input
            v-bind:class="[validEmail ? 'valid' : 'error']"
            type="text"
            class="form-control input"
            v-model="email"
            required
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input
            v-bind:class="[checkPasswords ? 'valid' : 'error']"
            type="password"
            class="form-control input pass"
            v-model="password"
            required
          />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input
            v-bind:class="[checkPasswords ? 'valid' : 'error']"
            type="password"
            class="form-control input pass"
            v-model="confirmPassword"
            required
          />
        </div>
        <div v-if="errorFlag">
          <div class="text-danger" style="margin-bottom: 1rem">
            {{ error }}
          </div>
        </div>
        <button type="button" class="btn btn-primary" v-on:click="signup()">
          Sign up
        </button>
        <div style="display: inline-flex; width: 100%">
          <p style="text-align: center; margin-left: auto">
            Already have an account?&nbsp;
          </p>
          <router-link :to="{ name: 'Login' }" class="quickLink"
            >Log in</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import url from "./globalVars.js";
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
      passCheck: this.password != this.confirmPassword,
    };
  },
  computed: {
    checkPasswords: function () {
      if (this.password == "" && this.confirmPassword == "") {
        this.passCheck = false;
        return false;
      }
      this.passCheck = this.password == this.confirmPassword;
      return this.passCheck;
    },
    validFName: function () {
      return this.firstName.length >= 2;
    },
    validLName: function () {
      return this.lastName.length >= 2;
    },
    validUsername: function () {
      return this.username.length >= 2;
    },
    validEmail: function () {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.email);
    },
  },
  methods: {
    signup: function () {
      // Make sure all the data is valid before posting
      if (
        !this.checkPasswords ||
        !this.validFName ||
        !this.validLName ||
        !this.validUsername ||
        !this.validEmail
      ) {
        this.error = "Please make sure all fields are valid.";
        this.errorFlag = true;
        return;
      }
      let data = {
        username: this.username,
        givenName: this.firstName,
        familyName: this.lastName,
        email: this.email,
        password: this.password,
      };
      this.$http.post(url + "/users", JSON.stringify(data)).then(
        function (response) {
          let loginData = {
            username: data.username,
            password: data.password,
          };
          this.$http.post(url + "/users/login", JSON.stringify(loginData)).then(
            function (response) {
              this.$cookies.set("session", response.body);
              this.$cookies.set("password", this.loginData.password);
              this.$router.push("/");
            },
            function (err) {
              console.log(err);
            }
          );
        },
        function (err) {
          this.error = "Username or email already taken";
          this.errorFlag = true;
        }
      );
    },
  },
};
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
  outline: 0 none;
}

.error:focus {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset,
    0 0 8px rgba(252, 47, 51, 0.6);
}

.valid {
  border-color: rgba(43, 255, 75, 0.8);
  outline: 0 none;
}

.valid:focus {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset,
    0 0 8px rgba(43, 255, 75, 0.6);
}

.text-danger {
  font-size: 15px;
}

.quickLink {
  margin-right: auto;
  color: #42b983 !important;
}

.quickLink:hover {
  margin-right: auto;
  color: #007bff !important;
}
</style>
