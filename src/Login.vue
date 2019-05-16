<template>
  <div class="outer">
    <div class="md-form">
      <form v-on:submit="login()">
        <div class="form-group">
          <label>Username or Email</label>
          <input type="text" class="form-control input" v-model="username" required>
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Password</label>
          <input type="password" class="form-control input" v-model="password" required>
        </div>
        <div v-if="errorFlag">
          <div class="error text-danger" style="margin-bottom: 1rem;">
            {{ error }}
          </div>
        </div>
        <button type="button" class="btn btn-primary" v-on:click="login()">Login</button>
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
          username: "",
          password: ""
        }
      },
      methods: {
        login: function() {
          // Check both fields have atleast some data
          if (this.username == "" || this.password == "") {
            this.error = "Please enter a username and password";
            this.errorFlag = true;
            return;
          }

          let data = {
            password: this.password,
          };

          // Check if email or username entered
          let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          console.log(re.test(this.username));
          if (re.test(this.username)) data.email = this.username;
          else data.username = this.username;

          // Make the request to the api
          this.$http.post("http://localhost:4940/api/v1/users/login", JSON.stringify(data))
            .then(function(response) {
              this.$http.headers.common['X-Authorization'] = response.body.token;
              this.$cookies.set("session", response.body);
              this.$router.push('/');
            }, function(err) {
              this.error = "Invalid username or password";
              this.errorFlag = true;
              return;
            });
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
    left: 35%;
    right: 35%;
    padding: 3% 5%;
    width: 30%;
    margin: auto;
    top: 15rem;
  }

  .form-group {
    margin-bottom: 2rem;
  }

  .outer {
    width: 100%;
    height: 100vh;
    padding: 0;
    margin: 0;
  }

  .input {
    /* background: rgba(108, 178, 252, 0.6); */
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

  .text-danger {
    font-size: 15px;
  }
</style>
