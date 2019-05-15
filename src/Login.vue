<template>
  <div class="outer">
    <div class="md-form">
      <form v-on:submit="login()">
        <div class="form-group">
          <label>Username or Email</label>
          <input type="text" class="form-control input" v-model="username">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control input" v-model="password">
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
            errorFlag: "",
            username: "",
            password: ""
          }
        },
      mounted: function() {

      },
      methods: {
          login: function() {
            let data = {
              username: this.username,
              password: this.password,
              email: "testdudette@gmail.com"
            };
            console.log(data);
            this.$http.post("http://localhost:4940/api/v1/users/login", JSON.stringify(data))
              .then(function(response) {
                this.$http.headers.common['X-Authorization'] = response.body.token;
                this.$cookies.set("session", response.body);
                this.$router.push('/');
              }, function(err) {
                console.log(err);
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
</style>
