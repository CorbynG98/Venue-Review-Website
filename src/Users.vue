<template>
  <div>
    <div v-if="this.$route.params.userId">
      <div v-if="isBusy">
        <div class="text-center">
          <b-spinner variant="primary" label="Spinning"></b-spinner>
        </div>
      </div>
      <div v-else>
        <div style="width: 60%; height: 5vh; margin: auto; margin-top: 5rem">
          <b-img
            width="200px"
            height="200px"
            :src="profileImage"
            onerror="this.src='https://storage.googleapis.com/public-s365-venue-review/default-profile.png'"
            style="margin-bottom: 0.2rem"
          ></b-img>
          <div
            v-if="searchedUser.email"
            style="display: inline-flex; width: 100%; justify-content: center"
          >
            <b-button variant="primary" v-on:click="showUploadModal()"
              >Upload Photo</b-button
            >
            <b-button variant="danger" v-on:click="removeProfilePhoto()"
              >Remove Photo</b-button
            >
          </div>
          <b-modal id="uploadPhotoModal" title="Upload Image" size="lg">
            <template>
              <div>
                <b-img
                  :src="newProfilePhotoPreview"
                  onerror="this.src='https://storage.googleapis.com/public-s365-venue-review/default-profile.png'"
                  width="300"
                  height="300px"
                  style="margin: auto; display: block; margin-bottom: 1rem"
                ></b-img>
              </div>
            </template>
            <template>
              <div style="margin-bottom: 1rem">
                <b-form-file
                  v-model="newUpload"
                  :state="Boolean(newUpload)"
                  :multiple="false"
                  placeholder="Choose a file..."
                  drop-placeholder="Drop file here..."
                  @change="onFileChange"
                  accept=".jpg, .png, image/jpeg, image/png"
                ></b-form-file>
              </div>
            </template>
            <template slot="modal-footer">
              <div v-if="modalHasError" class="text-danger">
                {{ modalError }}
              </div>
              <b-button
                primary
                size="lg"
                variant="danger"
                v-on:click="hidePhotoModal()"
              >
                Cancel
              </b-button>
              <b-button
                primary
                size="lg"
                variant="success"
                v-on:click="uploadNewPhoto()"
              >
                Submit
              </b-button>
            </template>
          </b-modal>
          <h5 style="margin-top: 1rem">
            <strong>Username:</strong> {{ searchedUser.username }}
          </h5>
          <h5><strong>Given Name:</strong> {{ searchedUser.givenName }}</h5>
          <h5><strong>Family Name:</strong> {{ searchedUser.familyName }}</h5>
          <div v-if="searchedUser.email">
            <h5><strong>Email: </strong>{{ searchedUser.email }}</h5>
            <b-button v-on:click="showEditModal()">Edit Profile</b-button>
          </div>
          <b-modal id="editProfileModal" title="Edit Profile Details">
            <b-input
              v-model="editDetails.givenName"
              placeholder="New First Name"
              style="margin-bottom: 1rem"
            ></b-input>
            <b-input
              v-model="editDetails.familyName"
              placeholder="New Last Name"
              style="margin-bottom: 1rem"
            ></b-input>
            <b-input
              type="password"
              v-model="currentPassword"
              placeholder="Current Password"
              style="margin-bottom: 1rem"
            ></b-input>
            <b-input
              type="password"
              v-model="editDetails.password"
              placeholder="New Password"
              style="margin-bottom: 1rem"
            ></b-input>
            <b-input
              type="password"
              v-model="confirmPassword"
              placeholder="Confirm Password"
              style="margin-bottom: 1rem"
            ></b-input>
            <template slot="modal-footer">
              <div v-if="modalHasError" class="text-danger">
                {{ modalError }}
              </div>
              <b-button
                primary
                size="lg"
                variant="danger"
                v-on:click="hideModal()"
              >
                Cancel
              </b-button>
              <b-button
                primary
                size="lg"
                variant="success"
                v-on:click="validateNewData()"
              >
                Submit
              </b-button>
            </template>
          </b-modal>
        </div>
      </div>
    </div>
    <div v-else>
      <div style="width: 50%; margin: auto">
        <h5>Enter a users ID to search for their profile.</h5>
        <div style="display: inline-flex">
          <b-input
            v-model="userId"
            placeholder="Users ID Number"
            style="border-radius: 10px 0 0 10px; height: 3rem; width: 30rem"
          ></b-input>
          <b-button
            variant="primary"
            size="lg"
            v-on:click="searchUsers()"
            style="border-radius: 0 10px 10px 0"
            >Search</b-button
          >
        </div>
        <p v-if="errorFlag" class="text-danger">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import url from "./globalVars";
export default {
  data() {
    return {
      newProfilePhotoPreview: "",
      newUpload: [],
      searchedUser: "",
      userId: "",
      errorFlag: false,
      error: "",
      isBusy: true,
      editDetails: {
        givenName: "",
        familyName: "",
        password: "",
      },
      newPhotoUpload: {
        photoData: "",
        type: "",
      },
      confirmPassword: "",
      modalHasError: false,
      modalError: "",
      profileImage: "",
      currentPassword: "",
    };
  },
  computed: {
    getProfileImage: function () {
      return this.profileImage;
    },
  },
  mounted: function () {
    this.modalHasError = false;
    this.errorFlag = false;
    this.userId = null;
    this.userId = this.$route.params.userId;
    this.profileImage = this.getProfileImgLink(this.$route.params.userId);
    this.$cookies.set("redirect", this.$router.currentRoute.fullPath);
    if (this.$route.params.userId) {
      this.getUser();
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == "User") this.getUser();
    },
  },
  methods: {
    searchUsers: function () {
      this.errorFlag = false;
      if (this.userId == "") {
        this.errorFlag = true;
        this.error = "Please enter something!";
        return;
      }
      this.getUser();
    },

    getUser: function () {
      let headers = {};
      if (
        this.userId != this.$route.params.userId &&
        this.$route.params.userId
      ) {
        this.userId = this.$route.params.userId;
      }

      if (
        this.$cookies.isKey("session") &&
        this.$cookies.get("session").userId == this.userId
      ) {
        headers = {
          "X-Authorization": this.$cookies.get("session").token,
        };
      }

      this.$http.get(url + "/users/" + this.userId, { headers }).then(
        function (res) {
          this.profileImage = this.getProfileImgLink(this.$route.params.userId);
          this.searchedUser = res.body;
          this.isBusy = false;
          this.$router.push("/Users/" + this.userId);
        },
        function (err) {
          this.errorFlag = true;
          console.log(err);
          if (err.status == 404) this.error = "User not found.";
          if (err.status == 400) this.error = "Please enter a valid ID.";
        }
      );
    },

    onFileChange: function (e) {
      this.modalHasError = false;
      this.resetNewImage();
      let input = e.target;
      if (input.files && input.files[0]) {
        if (input.files[0].size > 20000000) {
          this.modalError = "The file size is too large.";
          this.modalHasError = true;
          this.resetNewImage();
          return;
        }
        this.newPhotoUpload.photoData = input.files[0];
        this.newPhotoUpload.type = input.files[0].type;
        let reader = new FileReader();
        reader.onload = (e) => {
          this.newProfilePhotoPreview = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },

    resetNewImage: function () {
      this.newPhotoUpload = {
        photoData: "",
        type: "",
      };
      this.profileImage = "";
      this.newUpload = [];
    },

    validateNewData: function () {
      this.modalHasError = false;
      let changedData = {};
      let valid = true;
      if (this.editDetails.givenName.length >= 1) {
        changedData.givenName = this.editDetails.givenName;
      }
      if (this.editDetails.familyName.length >= 1) {
        changedData.familyName = this.editDetails.familyName;
      }
      if (
        this.editDetails.password.length <= 1 ||
        this.confirmPassword.length <= 1
      )
        valid = false;
      if (this.editDetails.password == this.confirmPassword && valid) {
        changedData.password = this.editDetails.password;
      }
      if (this.editDetails.password != this.confirmPassword) {
        this.modalError = "Passwords are not the same.";
        this.modalHasError = true;
        return;
      }
      if (this.currentPassword != this.$cookies.get("password")) {
        this.modalError = "Current password is not valid.";
        this.modalHasError = true;
        return;
      }

      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
      };

      this.$http
        .patch(url + "/users/" + this.$route.params.userId, changedData, {
          headers,
        })
        .then(
          function (res) {
            this.$root.$emit("bv::hide::modal", "editProfileModal");
            if (changedData.password)
              this.$cookies.set("password", changedData.password);
            this.getUser();
          },
          function (err) {
            this.modalError = "Please fill in some fields...";
            this.modalHasError = true;
          }
        );
    },

    removeProfilePhoto: function () {
      this.modalHasError = false;
      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
      };
      this.isBusy = true;
      this.$http
        .delete(url + "/users/" + this.$route.params.userId + "/photo", {
          headers,
        })
        .then(
          function () {
            this.$bvToast.toast("Image has been removed.");
            this.profileImage = this.getProfileImgLink(
              this.$route.params.userId
            );
            this.isBusy = false;
          },
          function () {
            this.$bvToast.toast("Unable to remove image at this time.");
            this.isBusy = false;
          }
        );
    },

    uploadNewPhoto: function () {
      this.modalHasError = false;
      if (this.newPhotoUpload.photoData == "") {
        this.modalError = "Please choose an image";
        this.modalHasError = true;
        return;
      }
      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
        "Content-Type": this.newPhotoUpload.type,
      };
      this.isBusy = true;
      this.$http
        .put(
          url + "/users/" + this.$route.params.userId + "/photo",
          this.newPhotoUpload.photoData,
          { headers }
        )
        .then(
          function (res) {
            this.isBusy = false;
            this.profileImage = this.getProfileImgLink(
              this.$route.params.userId
            );
            this.$root.$emit("bv::hide::modal", "uploadPhotoModal");
          },
          function (err) {
            this.isBusy = false;
            this.modalHasError = true;
            this.modalError = "An error occurred.";
          }
        );
    },

    showUploadModal: function () {
      this.$root.$emit("bv::show::modal", "uploadPhotoModal");
    },

    getProfileImgLink: function (userId) {
      return url + "/users/" + userId + "/photo";
    },

    hideModal: function () {
      this.$root.$emit("bv::hide::modal", "editProfileModal");
    },

    hidePhotoModal: function () {
      this.$root.$emit("bv::hide::modal", "uploadPhotoModal");
    },

    showEditModal: function () {
      this.$root.$emit("bv::show::modal", "editProfileModal");
    },
  },
};
</script>

<style scoped>
</style>
