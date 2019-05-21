<template>
    <div>
        <div v-if="this.$route.params.userId">
            <div v-if="isBusy">
                <div class="text-center">
                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                </div>
            </div>
            <div v-else>
                <div style="width: 60%; height: 5vh; margin: auto; margin-top: 5rem;">
                    <b-img width="200px" height="200px" :src="getProfileImgLink(this.$route.params.userId)" onerror="this.src='../src/assets/default-profile.png'"></b-img>
                    <h5 style="margin-top: 1rem;"><strong>Username:</strong> {{ searchedUser.username }}</h5>
                    <h5><strong>Given Name:</strong> {{ searchedUser.givenName }}</h5>
                    <h5><strong>Family Name:</strong> {{ searchedUser.familyName }}</h5>
                    <div v-if="searchedUser.email">
                        <h5><strong>Email: </strong>{{ searchedUser.email }}</h5>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div style="width: 50%; margin: auto;">
                <h5>Enter a users ID to search for their profile.</h5>
                <div style="display: inline-flex;">
                    <b-input v-model="userId" placeholder="Users ID Number" style="border-radius: 10px 0 0 10px; height: 3rem; width: 30rem;"></b-input>
                    <b-button variant="primary" size="lg" v-on:click="searchUsers()" style="border-radius: 0 10px 10px 0;">Search</b-button>
                </div>
                <p v-if="errorFlag" class="text-danger">{{ error }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import url from './globalVars';
    export default {
        data() {
            return {
                searchedUser: "",
                userId: "",
                errorFlag: false,
                error: "",
                isBusy: true
            }
        },
        mounted: function() {
            this.$cookies.set('redirect', this.$router.currentRoute.fullPath);
            let headers = {};
            if (this.$cookies.isKey('session') && this.$cookies.get('session').userId == this.$route.params.userId) {
                headers = {
                    'X-Authorization': this.$cookies.get('session').token
                }
            }
            if (this.$route.params.userId) {
                this.$http.get(url + "/users/" + this.$route.params.userId, { headers })
                    .then(function (res) {
                        this.searchedUser = res.body;
                        this.isBusy = false;
                    });
            }
        },
        methods: {
            searchUsers: function() {
                this.errorFlag = false;
                if (this.userId == "") {
                    this.errorFlag = true;
                    this.error = "Please enter something!";
                    return;
                }
                let headers = {};
                if (this.$cookies.isKey('session') && this.$cookies.get('session').userId == this.userId) {
                    headers = {
                        'X-Authorization': this.$cookies.get('session').token
                    }
                };

                this.$http.get(url + "/users/" + this.userId, { headers })
                    .then(function (res) {
                        console.log(res);
                        this.searchedUser = res.body;
                        this.isBusy = false;
                        this.$router.push("/Users/" + this.userId)
                    }, function(err) {
                        this.errorFlag = true;
                        console.log(err);
                        if (err.status == 404) this.error = "User not found.";
                        if (err.status == 400) this.error = "Please enter a valid ID."
                    })
            },

            getProfileImgLink: function(userId) {
                return url + '/users/' + userId + '/photo';
            }
        }
    }
</script>

<style scoped>

</style>
