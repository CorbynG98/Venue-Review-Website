<template>
  <div id = "app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">YEETUS</a>
      <div class="floater">
        <ul class="navbar-nav mr-auto left">
          <li class="nav-item">
            <router-link :to="{name: 'Home'}" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'Venues'}" class="nav-link">Venues</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'Users'}" class="nav-link">Users</router-link>
          </li>
        </ul>
        <ul class="navbar-nav mr-auto right">
          <div v-if="isAuth">
            <li class="nav-item">
              <span class="navbar-text">Welcome, {{ username }}</span>
            </li>
            <li class="nav-item">
              <a v-on:click="Logout()" href="" class="nav-link">Logout</a>
            </li>
          </div>
          <div v-else>
            <li class="nav-item">
              <router-link :to="{name: 'Login'}" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'Signup'}" class="nav-link">Sign up</router-link>
            </li>
          </div>
        </ul>
      </div>
    </nav>
    <div class="body-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isAuth: false,
        username: ""
      }
    },
    updated() {
      if (this.$cookies.isKey("session")) {
        this.isAuth = true;
        this.$http.get("http://localhost:4940/api/v1/users/" + this.$cookies.get("session").userId)
          .then(function (response) {
            this.username = response.body.username;
          }, function(error) {});
      }
    },
    mounted: function() {
      if (this.$cookies.isKey("session")) {
        this.isAuth = true;
        this.$http.get("http://localhost:4940/api/v1/users/" + this.$cookies.get("session").userId)
          .then(function(response) {
            this.username = response.body.username;
          })
      } else {
        this.isAuth = false;
        this.username = "";
      }
    },
    methods: {
      Logout: function() {
        if (!this.$cookies.isKey("session")) return;
        this.$http.headers.common['X-Authorization'] = "";
        this.$cookies.remove("session");
        this.isAuth = false;
        this.username = "";
        this.$router.push('/');
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .floater {
    position: absolute;
    padding-left: 6rem;
    padding-right: 2rem;
    width: 100%;
  }

  .right {
    float: right;
  }

  .left {
    float: left
  }

  .router-link-exact-active {
    color: #fff !important;
  }

  .body-content {
    margin-top: 3.5rem;
  }
</style>
