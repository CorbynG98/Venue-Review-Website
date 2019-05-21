<template>
    <div id = "app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
            <a class="navbar-brand" href="#">ReviewEA</a>
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
                            <span class="navbar-text" style="display: inline-flex;">Welcome,&nbsp
                                <a v-on:click="MyProfile()" class="profile-link">{{ username }}</a>
                            </span>
                        </li>
                        <li class="nav-item">
                            <a v-on:click="Logout()" class="nav-link">Logout</a>
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
    import url from './globalVars.js';
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
                this.$http.get(url + "/users/" + this.$cookies.get("session").userId)
                    .then(function (response) {
                        this.username = response.body.username;
                    }, function(error) {});
            }
        },
        mounted: function() {
            if (this.$cookies.isKey("session")) {
                this.isAuth = true;
                this.$http.get(url + "/users/" + this.$cookies.get("session").userId)
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
                let headers = {
                    'X-Authorization': this.$cookies.get("session").token
                };
                this.$http.post(url + "/users/logout", JSON.stringify({}), {headers})
                    .then(function(response) {
                        this.$cookies.remove("session");
                        this.isAuth = false;
                        this.username = "";
                    }, function(err) {
                        if (err.status == 401) {
                            this.$cookies.remove("session");
                            this.isAuth = false;
                            this.username = "";
                        }
                    });
            },

            MyProfile: function() {
                this.$router.push('/Users/' + this.$cookies.get('session').userId)
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
        margin-top: 4rem;
    }

    .nav-link {
        cursor: pointer;
    }

    .img-fluid {
        max-height: 480px;
        background-position: 50% 50%;
        background-size: contain;
        object-fit: contain;
    }

    .row30 {
        max-width: 25rem;
        min-width: 25rem;
    }

    .row70 {
        text-align: left;
        max-width: 45rem;
        min-width: 45rem;
    }

    .vue-star-rating {
        margin: auto;
    }

    .profile-link {
        color: rgba(255, 255, 255, 0.5) !important;
    }

    .profile-link:hover {
        cursor: pointer;
        color: rgba(255, 255, 255, 0.75) !important;
    }
</style>
