<template>
  <b-container>
    <div v-if="isBusy">
      <div class="text-center">
        <b-spinner variant="primary" label="Spinning"></b-spinner>
      </div>
    </div>
    <div v-else>
      <div v-if="editMode" class="titleArea">
        <b-input
          class="venueName"
          style="width: 70%; font-size: 2rem; margin-bottom: 1rem"
          v-model="updateVenueDetails.venueName"
        ></b-input>
        <router-link :to="{ name: 'Venues' }" class="linkBlack return"
          >Return to venue list</router-link
        >
      </div>
      <div v-else>
        <div class="titleArea">
          <h3 class="venueName">{{ venue.venueName }}</h3>
          <router-link :to="{ name: 'Venues' }" class="linkBlack return"
            >Return to venue list</router-link
          >
        </div>
      </div>

      <div>
        <b-carousel
          id="carousel-1"
          v-model="slide"
          :interval="5000"
          controls
          indicators
          background="#ababab"
          img-width="1024"
          img-height="480"
          :contain="true"
          style="text-shadow: 1px 1px 2px; height: 480px"
        >
          <div v-if="imageExists()">
            <div v-for="image in images" v-bind:key="image.src">
              <b-carousel-slide v-bind:img-src="image.src">
                <h1
                  style="
                    text-shadow: -1px 0 black, 0 1px black, 1px 0 black,
                      0 -1px black;
                  "
                >
                  {{ image.desc }}
                </h1>
                <div v-if="!notAdmin">
                  <b-button
                    v-on:click="removeImage(image.src)"
                    class="little-fade"
                    >Remove</b-button
                  >
                  <b-button
                    v-on:click="makePrimary(image.src)"
                    class="little-fade"
                    >Primary</b-button
                  >
                </div>
              </b-carousel-slide>
            </div>
          </div>
          <div v-else>
            <b-carousel-slide
              img-src="https://storage.googleapis.com/public-s365-venue-review/default.png"
              style="height: 480px; background-position: 50% 50%"
            >
              <h1
                style="
                  text-shadow: -1px 0 black, 0 1px black, 1px 0 black,
                    0 -1px black;
                "
              >
                No images found for this venue
              </h1>
            </b-carousel-slide>
          </div>
        </b-carousel>
      </div>
      <div v-if="editMode" style="margin: 1rem 0 1rem auto">
        <b-button variant="danger" style="float: right; margin-left: 1rem"
          >Remove Images</b-button
        >
        <b-button
          variant="primary"
          style="float: right"
          v-on:click="uploadPhotoModal()"
          >Add Image/s</b-button
        >
      </div>

      <div
        class="venueInformation"
        style="clear: both"
        v-bind:class="[editMode ? 'margintop' : 'nomargintop']"
      >
        <b-table
          striped
          hover
          :items="detailsItem"
          :fields="fields"
          :busy="busy"
          class="no-bottom"
        >
          <div slot="table-busy">
            <div class="text-center">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
          </div>
          <div v-if="editMode" slot="category.categoryName">
            <div>
              <b-form-group label-cols-sm="1" class="mb-0">
                <b-form-select
                  v-model="updateVenueDetails.categoryId"
                  :options="categoryOptions"
                ></b-form-select>
              </b-form-group>
            </div>
          </div>
          <template slot="meanStarRating" slot-scope="row">
            <star-rating
              :rating="row.item.meanStarRating"
              :increment="0.1"
              :read-only="true"
              :show-rating="false"
              :star-size="20"
              style="height: 100%"
            ></star-rating>
          </template>
        </b-table>
      </div>
      <div clas="someMoreInformation" style="margin: 2rem 0 2rem 0">
        <div class="locationInformation">
          <div v-if="editMode" class="locationInformation">
            <p style="margin-left: 2rem; line-height: 2.2rem">
              <strong>City:&nbsp;</strong>
            </p>
            <b-input
              style="width: 30%; margin-left: 0; float: left"
              v-model="updateVenueDetails.city"
            ></b-input>
            <p style="margin-left: auto; line-height: 2.2rem">
              <strong>Address:&nbsp;</strong>
            </p>
            <b-input
              style="width: 30%; margin-left: 0; float: left"
              v-model="updateVenueDetails.address"
            ></b-input>
          </div>
          <div v-else class="locationInformation">
            <p style="margin-left: 2rem; margin-right: auto">
              <strong>City:</strong> {{ venue.city }}
            </p>
            <p style="margin-left: auto; margin-right: 2rem">
              <strong>Address:</strong> {{ venue.address }}
            </p>
          </div>
        </div>
        <div
          class="descriptions"
          style="transition: all 1s; margin-top: 1rem; width: 100%"
        >
          <div v-if="editMode" class="locationInformation" style="width: 100%">
            <p style="margin-left: 2rem; line-height: 2.2rem">
              <strong>Short Description:&nbsp;</strong>
            </p>
            <b-input
              style="width: 40%; margin-left: 0; float: left"
              v-model="updateVenueDetails.shortDescription"
            ></b-input>
            <p style="margin-left: auto; line-height: 2.2rem">
              <strong>Long Description:&nbsp;</strong>
            </p>
            <b-textarea
              style="
                width: 30%;
                margin-left: 0;
                float: left;
                min-height: 2.4rem;
                height: 2.4rem;
              "
              v-model="updateVenueDetails.longDescription"
            ></b-textarea>
          </div>
          <div v-else style="margin: auto">
            <h6>
              <strong>Description: </strong>{{ description }}&nbsp;
              <div v-if="isLong">
                <a
                  class="showMore"
                  style="font-size: 1rem; line-height: inherit"
                  v-on:click="showMoreDesc()"
                  >({{ showText }})</a
                >
              </div>
            </h6>
          </div>
        </div>
        <div
          v-if="editMode"
          class="descriptions"
          style="transition: all 1s; margin-top: 1rem; width: 100%"
        >
          <div class="locationInformation" style="width: 100%">
            <p style="margin-left: 2rem; line-height: 2.2rem">
              <strong>Longitude:&nbsp;</strong>
            </p>
            <b-input
              style="width: 20%; margin-left: 0; float: left"
              v-model="updateVenueDetails.latitude"
            ></b-input>
            <p style="margin-left: auto; line-height: 2.2rem">
              <strong>Latitude:&nbsp;</strong>
            </p>
            <b-input
              style="width: 20%; margin-left: 0; float: left"
              v-model="updateVenueDetails.longitude"
            ></b-input>
          </div>
        </div>
      </div>
      <div v-if="editMode" style="width: 100%; display: inline-flex">
        <div style="width: 100%">
          <p
            v-if="errorFlag"
            class="text-danger"
            style="
              float: right;
              margin-right: 1rem;
              margin-bottom: 0;
              line-height: 2rem;
            "
          >
            {{ error }}
          </p>
        </div>
        <div style="display: inline-flex; width: auto">
          <b-button
            variant="primary"
            style="margin-left: auto; margin-right: 1rem"
            v-on:click="validateAndSubmitChanges()"
            >Submit Changes</b-button
          >
          <b-button variant="danger" v-on:click="discardChanges()"
            >Discard Changes</b-button
          >
        </div>
      </div>
      <div v-if="!notAdmin">
        <b-button v-if="!editMode" v-on:click="editVenue()"
          >Edit Venue</b-button
        >
      </div>
      <div class="reviewsTable" style="clear: both">
        <div class="reviewTitle"><h2>Reviews</h2></div>
        <div v-if="notAdmin">
          <div v-if="editMode">
            <b-button v-on:click="showModal()" ref="btnShow" :disabled="true"
              >Write a review</b-button
            >
          </div>
          <div v-else>
            <b-button v-on:click="showModal()" ref="btnShow"
              >Write a review</b-button
            >
          </div>

          <b-modal id="newReviewModal" size="lg" title="New Review" centered>
            <form ref="form">
              <b-form-group>
                <div style="display: inline-flex; width: 100%">
                  <div
                    style="
                      display: inline-flex;
                      padding: 1rem;
                      margin-left: 2rem;
                      margin-right: auto;
                    "
                    class="starRating"
                  >
                    <p
                      style="
                        font-size: 1.5rem;
                        line-height: 2.3rem;
                        margin-bottom: 0;
                      "
                    >
                      Stars:&nbsp;&nbsp;
                    </p>
                    <div class="stars">
                      <star-rating
                        v-model="newReview.starRating"
                        :increment="1"
                        :show-rating="false"
                        :star-size="30"
                      ></star-rating>
                    </div>
                  </div>
                  <div
                    style="
                      display: inline-flex;
                      padding: 1rem;
                      margin-left: auto;
                      margin-right: 2rem;
                    "
                  >
                    <p
                      style="
                        font-size: 1.5rem;
                        line-height: 2.3rem;
                        margin-bottom: 0;
                      "
                    >
                      Cost:&nbsp;&nbsp;
                    </p>
                    <b-form-select
                      v-model="newReview.costRating"
                      :options="costOptions"
                      style="width: 150px"
                    >
                    </b-form-select>
                  </div>
                </div>
              </b-form-group>
              <b-form-textarea
                id="textarea"
                v-model="newReview.reviewBody"
                placeholder="Review content..."
                rows="3"
                max-rows="6"
                v-bind:class="[validBody ? 'valid' : 'error']"
              ></b-form-textarea>
            </form>
            <template slot="modal-footer">
              <div v-if="modalHasError" class="text-danger">
                {{ modalError }}
              </div>
              <b-button
                primary
                size="lg"
                variant="success"
                v-on:click="validateReview()"
              >
                Submit
              </b-button>
            </template>
          </b-modal>
        </div>
        <b-table
          striped
          hover
          :items="reviewItems"
          :fields="reviewFields"
          :busy="reviewBusy"
          style="margin-top: 2rem"
          show-empty
        >
          <div slot="table-busy">
            <div class="text-center">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
          </div>
          <template slot="reviewDetails" slot-scope="row">
            <div style="height: 10rem">
              <div class="detailsTopRow">
                <div class="profileImage">
                  <b-img
                    v-bind:src="getProfileImgLink(row.item.reviewAuthor.userId)"
                    onerror="this.onerror=null; this.src='https://storage.googleapis.com/public-s365-venue-review/default-profile.png'"
                    width="100"
                    height="100"
                  ></b-img>
                </div>
                <div class="UsernameAndPosted">
                  <h2
                    class="profileName"
                    v-on:click="goToProfile(row.item.reviewAuthor.userId)"
                  >
                    {{ row.item.reviewAuthor.username }}
                  </h2>
                  <h2 style="font-size: 1.5rem">
                    {{ formatDateString(row.item.timePosted, false) }}
                  </h2>
                </div>
              </div>
              <div
                class="starAndCostRating"
                style="display: inline-flex; width: 100%"
              >
                <div
                  class="starRating"
                  style="display: inline-flex; line-height: 4rem"
                >
                  Stars:&nbsp;
                  <star-rating
                    :rating="row.item.starRating"
                    :increment="0.1"
                    :read-only="true"
                    :show-rating="false"
                    :star-size="20"
                  ></star-rating>
                </div>
                <div
                  class="costRating"
                  style="display: inline-flex; line-height: 4rem"
                >
                  Cost Rating:&nbsp;{{ getDollars(row.item.costRating) }}
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>
    </div>
    <b-modal id="uploadVenuePhotoModal" size="lg" title="Upload Photo" centered>
      <form ref="form">
        <template>
          <div>
            <b-img
              :src="newVenuePhotosPreview"
              onerror="this.src='https://storage.googleapis.com/public-s365-venue-review/default.png'"
              width="500px"
              height="350px"
              style="margin: auto; display: block; margin-bottom: 1rem"
            >
            </b-img>
          </div>
        </template>
        <template>
          <div style="margin-bottom: 1rem">
            <b-form-file
              v-model="newUploads"
              :state="Boolean(newUploads)"
              :multiple="false"
              placeholder="Choose a file..."
              drop-placeholder="Drop file here..."
              @change="onFileChange"
              accept=".jpg, .png, image/jpeg, image/png"
            ></b-form-file>
          </div>
        </template>
        <b-form-input
          v-model="newVenuePhoto.description"
          placeholder="Photo description"
          style="margin-right: 1rem; margin-bottom: 1rem"
        ></b-form-input>
        <b-form-checkbox
          v-model="newVenuePhoto.makePrimary"
          :options="categoryOptions"
          style="margin-right: 1rem; margin-left: 1rem"
          >Make this the primary photo for the venue?</b-form-checkbox
        >
      </form>
      <template slot="modal-footer">
        <div v-if="modalHasError" class="text-danger">
          {{ modalError }}
        </div>
        <b-button primary size="lg" variant="danger" v-on:click="hideModal()">
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
  </b-container>
</template>

<script>
import url from "./globalVars.js";
export default {
  data() {
    return {
      error: "",
      errorFlag: false,
      detailsItem: [],
      fields: [
        {
          key: "category.categoryName",
          label: "Category",
          slot: "categoryId",
          sortable: false,
        },
        {
          key: "meanStarRating",
          label: "Star Rating",
          formatter: (value) => {
            if (value == 0 || value == null || value == undefined)
              return parseInt("3").toFixed();
            return value.toFixed(2);
          },
          sortable: false,
        },
        {
          key: "modeCostRating",
          label: "Cost Rating",
          formatter: (value) => {
            value = this.detailsItem.modeCostRating;
            return this.getDollars(value);
          },
          sortable: false,
        },
        { key: "admin.username", label: "Admin Username", sortable: false },
        {
          key: "dateAdded",
          label: "Created",
          formatter: (value) => {
            return this.formatDateString(this.date, false, false);
          },
        },
      ],
      reviewFields: [
        { key: "reviewDetails", label: "Details", class: "row30" },
        { key: "reviewBody", label: "Review", class: "row70" },
      ],
      reviewItems: [],
      costOptions: [
        { value: 0, text: "Free" },
        { value: 1, text: "$" },
        { value: 2, text: "$$" },
        { value: 3, text: "$$$" },
        { value: 4, text: "$$$$" },
      ],
      updateVenueDetails: {
        venueName: "",
        categoryId: { value: 0, text: "hello" },
        city: "",
        address: "",
        longitude: null,
        latitude: null,
        shortDescription: "",
        longDescription: "",
      },
      categoryOptions: [],
      categories: [],
      newVenuePhotosPreview: "",
      newUploads: [],
      newVenuePhoto: {
        photo: "",
        description: "",
        makePrimary: false,
      },
      description: "",
      slide: 0,
      sliding: null,
      isBusy: true,
      reviewBusy: true,
      isLong: false,
      showText: "Show more",
      showingFull: false,
      images: [],
      venue: "",
      busy: true,
      newReview: {
        starRating: 3,
        costRating: 0,
        reviewBody: "",
      },
      hasNewImages: false,
      meanStarRating: 3,
      modeCostRating: "Free",
      notAdmin: true,
      editMode: false,
      modalError: "",
      modalHasError: false,
      date: "",
    };
  },
  computed: {
    validBody: function () {
      return this.newReview.reviewBody.length > 5;
    },
  },
  updated: function () {
    this.hasNewImages = this.hasNewImages.length >= 1 ? true : false;
  },
  mounted: function () {
    this.$cookies.set("redirect", this.$router.currentRoute.fullPath);
    let detail = {};
    detail.meanStarRating = this.$route.params.meanStarRating;
    detail.modeCostRating = this.$route.params.modeCostRating;
    if (
      detail.meanStarRating == undefined ||
      detail.modeCostRating == undefined
    ) {
      this.$http.get(url + "/venues").then(function (response) {
        for (let index in response.body) {
          if (response.body[index].venueId == this.$route.params.venueId) {
            let meanStars = response.body[index].meanStarRating;
            let modeCost = response.body[index].modeCostRating;
            detail.meanStarRating = meanStars;
            detail.modeCostRating = modeCost;
            if (meanStars == null || meanStars == 0) detail.meanStarRating = 3;
            if (modeCost == null || modeCost == 0) detail.modeCostRating = 0;
            break;
          }
        }
        this.busy = false;
      });
    } else {
      this.busy = false;
    }

    this.$http.get(url + "/categories").then(function (response) {
      this.categories = response.body;
      for (let cat in this.categories) {
        let name = this.categories[cat].categoryName;
        let id = this.categories[cat].categoryId;
        this.categoryOptions.push({ value: id, text: name });
      }
    });

    this.$http
      .get(url + "/venues/" + this.$route.params.venueId + "/reviews")
      .then(function (response) {
        this.reviewItems = response.body;
        this.reviewBusy = false;
      });

    this.$http
      .get(url + "/venues/" + this.$route.params.venueId)
      .then(function (response) {
        this.venue = response.body;
        console.log(this.venue.dateAdded);
        detail.category = this.venue.category;
        detail.admin = this.venue.admin;
        this.date = this.venue.dateAdded.toString();

        this.updateVenueDetails.venueName = this.venue.venueName;
        this.updateVenueDetails.address = this.venue.address;
        this.updateVenueDetails.categoryId = {
          value: this.venue.category.categoryId,
          text: this.venue.category.categoryName,
        };
        this.updateVenueDetails.city = this.venue.city;
        this.updateVenueDetails.latitude = this.venue.latitude;
        this.updateVenueDetails.longitude = this.venue.longitude;
        this.updateVenueDetails.longDescription = this.venue.longDescription;
        this.updateVenueDetails.shortDescription = this.venue.shortDescription;

        this.description = this.isLong
          ? this.venue.shortDescription + "..."
          : this.venue.shortDescription;
        if (this.$cookies.isKey("session"))
          this.notAdmin =
            this.$cookies.get("session").userId != this.venue.admin.userId
              ? true
              : false;
        else this.notAdmin = false;
        if (
          this.venue.longDescription != null &&
          this.venue.longDescription != ""
        )
          this.isLong = true;
        for (let photo in this.venue.photos) {
          let image = this.venue.photos[photo];
          let newImage = {
            src:
              url +
              "/venues/" +
              this.$route.params.venueId +
              "/photos/" +
              image.photoFilename,
            desc: image.photoDescription,
          };
          this.images.push(newImage);
        }
        this.isBusy = false;
      });
    this.detailsItem.push(detail);
  },
  methods: {
    imageExists: function () {
      return this.images.length != 0;
    },

    removeImage: function (source) {
      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
      };
      this.isBusy = true;
      this.$http.delete(source, { headers }).then(
        function () {
          this.$bvToast.toast("Image has been removed.");
          this.updatePageInformation();
          this.isBusy = false;
        },
        function () {
          this.$bvToast.toast("Unable to remove image at this time.");
          this.isBusy = false;
        }
      );
    },

    makePrimary: function (source) {
      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
      };
      this.isBusy = true;
      this.$http.post(source + "/setPrimary", null, { headers }).then(
        function () {
          this.$bvToast.toast("Image has been set to primary.");
          this.updatePageInformation();
        },
        function () {
          this.$bvToast.toast("Unable to set primary at this time.");
          this.isBusy = false;
        }
      );
    },

    goToProfile: function (id) {
      this.$router.push("/Users/" + id);
    },

    hideModal: function () {
      this.$root.$emit("bv::hide::modal", "uploadVenuePhotoModal");
      this.$root.$emit("bv::hide::modal", "uploadVenuePhotoModal");
    },

    editVenue: function () {
      this.editMode = true;
    },

    discardChanges: function () {
      this.updateVenueDetails.venueName = this.venue.venueName;
      this.updateVenueDetails.address = this.venue.address;
      this.updateVenueDetails.categoryId = this.venue.categoryId;
      this.updateVenueDetails.city = this.venue.city;
      this.updateVenueDetails.latitude = this.venue.latitude;
      this.updateVenueDetails.longitude = this.venue.longitude;
      this.updateVenueDetails.longDescription = this.venue.longDescription;
      this.updateVenueDetails.shortDescription = this.venue.shortDescription;

      this.editMode = false;
    },

    uploadNewPhoto: function () {
      let formData = new FormData();
      if (this.newVenuePhoto.photo == "") {
        this.modalError = "Please select a valid image!";
        this.modalHasError = true;
        return;
      }
      formData.append("photo", this.newVenuePhoto.photo);
      if (this.newVenuePhoto.description.length <= 5) {
        this.modalError = "";
        this.modalHasError = true;
        return;
      }
      formData.append("description", this.newVenuePhoto.description);
      formData.append("makePrimary", this.newVenuePhoto.makePrimary);
      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
      };

      this.$http
        .post(
          url + "/venues/" + this.$route.params.venueId + "/photos",
          formData,
          { headers }
        )
        .then(
          function (response) {
            this.hideModal();
            this.updatePageInformation();
          },
          function (err) {
            console.log(err);
          }
        );
    },

    validateAndSubmitChanges: function () {
      if (this.updateVenueDetails.venueName.length < 5) {
        this.error = "Make sure the new name is valid.";
        this.errorFlag = true;
        return;
      }
      if (this.updateVenueDetails.categoryId == null) {
        this.error = "Choose a valid category!";
        this.errorFlag = true;
        return;
      }
      if (this.updateVenueDetails.city.length < 5) {
        this.error = "Make sure the new city is valid.";
        this.errorFlag = true;
        return;
      }
      if (this.updateVenueDetails.address.length < 10) {
        this.error = "Make sure the new address is valid.";
        this.errorFlag = true;
        return;
      }
      if (this.updateVenueDetails.shortDescription.length < 5) {
        this.error = "Make sure the new short description is valid.";
        this.errorFlag = true;
        return;
      }
      if (this.updateVenueDetails.longDescription.length < 10) {
        this.error = "Make sure the new long description is valid.";
        this.errorFlag = true;
        return;
      }
      if (this.updateVenueDetails.latitude == null) {
        this.error = "Please enter a valid latitude.";
        this.errorFlag = true;
        return;
      }
      if (this.updateVenueDetails.longitude == null) {
        this.error = "Please enter a valid longitude.";
        this.errorFlag = true;
        return;
      }

      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
      };

      this.$http
        .patch(
          url + "/venues/" + this.$route.params.venueId,
          this.updateVenueDetails,
          { headers }
        )
        .then(
          function (response) {
            this.editMode = false;
            this.$http
              .get(url + "/venues/" + this.$route.params.venueId + "/reviews")
              .then(function (response) {
                this.reviewItems = response.body;
                this.reviewBusy = false;
                this.updatePageInformation();
              });
          },
          function (err) {
            console.log(err);
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
        this.newVenuePhoto.photo = input.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
          this.newVenuePhotosPreview = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },

    resetNewImage: function () {
      this.newVenuePhotosPreview = "";
      this.newUploads = [];
      this.newVenuePhoto = {
        photo: "",
        description: "",
        makePrimary: false,
      };
    },

    getProfileImgLink: function (userId) {
      return url + "/users/" + userId + "/photo";
    },

    showModal: function () {
      if (!this.$cookies.isKey("session")) return this.$router.push("/Login");
      this.$root.$emit("bv::show::modal", "newReviewModal");
    },

    getDollars: function (value) {
      if (value == 0 || value == null) return "Free";
      return "$".repeat(value);
    },

    validateReview: function () {
      let review = this.newReview;
      if (review.starRating < 0 || review.starRating > 5) {
        this.modalError = "Please select a valid star rating";
        this.modalHasError = true;
        return;
      }
      if (review.costRating < 0 || review.costRating > 4) {
        this.modalError = "Please select a valid cost Rating";
        this.modalHasError = true;
        return;
      }
      if (review.reviewBody.length <= 5) {
        this.modalError = "Body can't be that short!";
        this.modalHasError = true;
        return;
      }
      if (this.$cookies.get("session").userId == this.venue.admin.userId) {
        this.modalError = "You cannot review your own venue.";
        this.modalHasError = true;
        return;
      }

      let headers = {
        "X-Authorization": this.$cookies.get("session").token,
      };

      this.reviewBusy = true;

      this.$http
        .post(
          url + "/venues/" + this.$route.params.venueId + "/reviews",
          this.newReview,
          { headers }
        )
        .then(
          function (response) {
            this.$root.$emit("bv::hide::modal", "newReviewModal");
            this.$http
              .get(url + "/venues/" + this.$route.params.venueId + "/reviews")
              .then(function (response) {
                this.reviewItems = response.body;
                this.reviewBusy = false;
              });
          },
          function (err) {
            this.reviewBusy = false;
            if (err.status == 403) {
              this.modalError = "You can only post one review per venue.";
              this.modalHasError = true;
              return;
            }
            this.modalError =
              "An unknown error has occurred. Please try again soon.";
            this.modalHasError = true;
            return;
          }
        );
    },

    updatePageInformation: function () {
      this.isBusy = true;
      this.images = [];
      this.$http
        .get(url + "/venues/" + this.$route.params.venueId)
        .then(function (response) {
          this.venue = response.body;
          this.detailsItem.category = this.venue.category;
          this.detailsItem.admin = this.venue.admin;

          this.description = this.isLong
            ? this.venue.shortDescription + "..."
            : this.venue.shortDescription;
          if (this.$cookies.isKey("session"))
            this.notAdmin =
              this.$cookies.get("session").userId != this.venue.admin.userId
                ? true
                : false;
          else this.notAdmin = false;
          if (
            this.venue.longDescription != null &&
            this.venue.longDescription != ""
          )
            this.isLong = true;
          this.images = [];
          for (let photo in this.venue.photos) {
            let image = this.venue.photos[photo];
            let newImage = {
              src:
                url +
                "/venues/" +
                this.$route.params.venueId +
                "/photos/" +
                image.photoFilename,
              desc: image.photoDescription,
            };
            this.images.push(newImage);
          }
          this.isBusy = false;
        });
      this.$http.get(url + "/venues").then(function (response) {
        for (let index in response.body) {
          if (response.body[index].venueId == this.$route.params.venueId) {
            let meanStars = response.body[index].meanStarRating;
            let modeCost = response.body[index].modeCostRating;
            this.detailsItem.meanStarRating = meanStars;
            this.detailsItem.modeCostRating = modeCost;
            if (meanStars == null || meanStars == 0)
              this.detailsItem.meanStarRating = 3;
            if (modeCost == null || modeCost == 0)
              this.detailsItem.modeCostRating = 0;
            this.busy = false;
            break;
          }
        }
      });
    },

    uploadPhotoModal: function () {
      this.$root.$emit("bv::show::modal", "uploadVenuePhotoModal");
    },

    showMoreDesc: function () {
      if (this.showingFull) {
        this.description = this.venue.shortDescription + "...";
        this.showingFull = false;
        this.showText = "Show more";
        return;
      }
      this.description =
        this.venue.shortDescription + " " + this.venue.longDescription;
      this.showingFull = true;
      this.showText = "Show less";
    },

    formatDateString: function (dateString, long, time = true) {
      let date = new Date(dateString);
      if (long) {
        let dateOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return date.toLocaleDateString("en-NZ", dateOptions);
      }
      if (time) {
        return (
          date.getFullYear() +
          "/" +
          this.padDateTime(date.getMonth() + 1) +
          "/" +
          this.padDateTime(date.getDate()) +
          " -- " +
          this.padDateTime(date.getHours()) +
          ":" +
          this.padDateTime(date.getMinutes()) +
          ":" +
          this.padDateTime(date.getSeconds())
        );
      }
      return (
        date.getFullYear() +
        "/" +
        this.padDateTime(date.getMonth() + 1) +
        "/" +
        this.padDateTime(date.getDate())
      );
    },

    padDateTime: function (n) {
      return n < 10 ? "0" + n : n;
    },
  },
};
</script>

<style scoped>
.linkBlack {
  color: rgb(44, 62, 80);
  transition: 0.1s;
}

.linkBlack:hover {
  text-decoration: none;
  color: rgb(88, 124, 160);
}

.venueName {
  font-size: 3rem;
}

.titleArea {
  display: inline-flex;
  width: 100%;
}

.return {
  line-height: 3.5rem;
  margin-right: 0;
  margin-left: auto;
}

.venueName {
  line-height: 3.5rem;
  margin: 0;
}

.descriptions {
  display: inline-flex;
}

.showMore:hover {
  cursor: pointer;
  color: blue !important;
}

.profileImage {
  float: left;
}

.detailsTopRow {
  height: 100px;
}

.costRating {
  margin-left: auto;
  margin-right: 1rem;
  float: right;
}

.starRating {
  margin-left: 1rem;
  margin-right: auto;
  float: left;
}

.no-bottom {
  margin-bottom: 0;
}

.locationInformation {
  display: inline-flex;
  width: 100%;
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

.margintop {
  margin-top: 4.5rem;
}

.nomargintop {
  margin-top: 0;
}

.profileName {
  color: rgba(0, 0, 0, 1);
}

.profileName:hover {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.5);
}

.little-fade {
  background: rgba(0, 0, 255, 0.3);
  border-color: rgba(0, 0, 255, 0.3);
}

.little-fade:hover {
  background: rgba(0, 0, 255, 0.5);
  border-color: rgba(0, 0, 255, 0.5);
}
</style>
