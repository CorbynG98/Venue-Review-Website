<template>
    <b-container>
        <div v-if="isBusy">
            <div class="text-center">
                <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
        </div>
        <div v-else>
            <div class="titleArea">
                <h3 class="venueName"> {{ venue.venueName }} </h3>
                <router-link :to="{name: 'Venues'}" class="linkBlack return">Return to venue list</router-link>
            </div>
            <b-carousel
                id="carousel-1"
                v-model="slide"
                :interval="1000000"
                controls
                indicators
                background="#ababab"
                img-width="1024"
                img-height="480"
                :contain="true"
                style="text-shadow: 1px 1px 2px; height: 480px;">
                <div v-if="imageExists()">
                    <div v-for="image in images">
                        <b-carousel-slide v-bind:img-src='image.src'>
                            <h1>{{ image.desc }}</h1>
                        </b-carousel-slide>
                    </div>
                </div>
                <div v-else>
                    <b-carousel-slide img-src="/src/assets/default.jpg" style="height: 480px; background-position: 50% 50%;">
                        <h1>No images found for this venue</h1>
                    </b-carousel-slide>
                </div>
            </b-carousel>
            <div class="venueInformation">
                <b-table striped hover :items="detailsItem" :fields="fields" class="no-bottom">
                    <template slot="meanStarRating" slot-scope="row">
                        <star-rating :rating="row.item.meanStarRating" :increment="0.1" :read-only="true" :show-rating="false" :star-size="20"></star-rating>
                    </template>
                </b-table>
            </div>
            <div clas="someMoreInformation" style="margin: 2rem 0 2rem 0;">
                <div class="locationInformation">
                    <p style="margin-left: 2rem; margin-right: auto;"><strong>City:</strong> {{ venue.city }}</p>
                    <p style="margin-left: auto; margin-right: 2rem;"><strong>Address:</strong> {{ venue.address }}</p>
                </div>
                <div class="descriptions" style="transition: all 1s;">
                    <h6> <strong>Description: </strong>{{ description }}&nbsp
                        <div v-if="isLong">
                            <a class="showMore" style="font-size: 1rem; line-height: inherit;" v-on:click="showMoreDesc()">({{ showText }})</a>
                        </div>
                    </h6>
                </div>
            </div>
            <div class="reviewsTable">
                <div class="reviewTitle"> <h2>Reviews</h2> </div>
                <div v-if="notAdmin">
                    <b-button v-on:click="showModal()" ref="btnShow">Write a review</b-button>

                    <b-modal
                        id="newReviewModal"
                        size="lg"
                        title="New Review"
                        centered>
                        <form ref="form">
                            <b-form-group>
                                <div style="display: inline-flex; width: 100%;">
                                    <div style="display: inline-flex; padding: 1rem; margin-left: 2rem; margin-right: auto;" class="starRating">
                                        <p style="font-size: 1.5rem; line-height: 2.3rem; margin-bottom: 0;">Stars:&nbsp&nbsp </p>
                                        <div class="stars">
                                            <star-rating v-model="newReview.starRating" :increment="1" :show-rating="false" :star-size="30"></star-rating>
                                        </div>
                                    </div>
                                    <div style="display: inline-flex; padding: 1rem; margin-left: auto; margin-right: 2rem;">
                                        <p style="font-size: 1.5rem; line-height: 2.3rem; margin-bottom: 0;">Cost:&nbsp&nbsp </p>
                                        <b-form-select v-model="newReview.costRating" :options="costOptions" v-on:change="" style="width: 150px;">
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
                            <b-button primary size="lg" variant="success" v-on:click="validateReview()">
                                Submit
                            </b-button>
                        </template>
                    </b-modal>
                </div>
                <b-table striped hover :items="reviewItems" :fields="reviewFields" :busy="reviewBusy" style="margin-top: 2rem;">
                    <div slot="table-busy">
                        <div class="text-center">
                            <b-spinner variant="primary" label="Spinning"></b-spinner>
                        </div>
                    </div>
                    <template slot="reviewDetails" slot-scope="row">
                        <div style="height: 10rem;">
                            <div class="detailsTopRow">
                                <div class="profileImage">
                                    <b-img v-bind:src="getProfileImgLink(row.item.reviewAuthor.userId)" onerror="this.onerror=null; this.src='/src/assets/default-profile.png'" width="100" height="100"></b-img>
                                </div>
                                <div class="UsernameAndPosted">
                                    <h2>{{ row.item.reviewAuthor.username }}</h2>
                                    <h2 style="font-size: 1.5rem;">{{ formatDateString(row.item.timePosted, false) }}</h2>
                                </div>
                            </div>
                            <div class="starAndCostRating" style="display: inline-flex; width: 100%;">
                                <div class="starRating" style="display: inline-flex; line-height: 4rem;">
                                    Stars:&nbsp
                                    <star-rating :rating="row.item.starRating" :increment="0.1" :read-only="true" :show-rating="false" :star-size="20"></star-rating>
                                </div>
                                <div class="costRating" style="display: inline-flex; line-height: 4rem;">
                                    Cost Rating:&nbsp{{ getDollars(row.item.costRating) }}
                                </div>
                            </div>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>
    </b-container>
</template>

<script>
    import url from './globalVars.js';
    export default {
        data() {
            return {
                error: "",
                errorFlag: false,
                detailsItem: [],
                fields: [
                    { key: 'category.categoryName', label: 'Category', sortable: false },
                    { key: 'meanStarRating', label: 'Star Rating', formatter: value => {
                            if (value == 0 || value == null || value == undefined) return '3.00';
                            return value.toFixed(2);
                        }, sortable: false },
                    { key: 'modeCostRating', label: 'Cost Rating', formatter: value => {
                            return this.getDollars(value);
                        }, sortable: false },
                    { key: 'admin.username', label: 'Admin Username', sortable: false },
                    { key: 'dateAdded', label: 'Created', formatter: value =>  {
                            return this.formatDateString(value, false, false);
                        }}
                ],
                reviewFields: [
                    { key: 'reviewDetails', label: 'Details', class: 'row30'},
                    { key: 'reviewBody', label: 'Review', class: 'row70'},
                ],
                reviewItems: [],
                costOptions: [
                    { value: 0, text: 'Free' },
                    { value: 1, text: '$' },
                    { value: 2, text: '$$' },
                    { value: 3, text: '$$$' },
                    { value: 4, text: '$$$$' }
                ],
                description: "",
                slide: 0,
                sliding: null,
                isBusy: true,
                reviewBusy: true,
                isLong: false,
                showText: 'Show more',
                showingFull: false,
                images: [],
                venue: '',
                newReview: {
                    starRating: 3,
                    costRating: 0,
                    reviewBody: ''
                },
                meanStarRating: 3,
                modeCostRating: 'Free',
                notAdmin: true,

                modalError: '',
                modalHasError: false
            }
        },
        computed: {
            'validBody': function() {
                return this.newReview.reviewBody.length > 5;
            },
        },
        mounted: function() {
            this.$cookies.set('redirect', this.$router.currentRoute.fullPath);
            let detail = {};
            this.meanStarRating = this.$route.params.meanStarRating;
            this.modeCostRating = this.$route.params.modeCostRating;
            detail.meanStarRating = this.meanStarRating;
            detail.modeCostRating = this.modeCostRating;
            if (this.meanStarRating == null || this.modeCostRating == null) {
                this.$http.get(url + '/venues')
                    .then(function(response) {
                        for (let index in response.body) {
                            if (response.body[index].venueId == this.$route.params.venueId) {
                                this.meanStarRating = response.body[index].meanStarRating;
                                this.modeCostRating = response.body[index].modeCostRating;
                                detail.meanStarRating = this.meanStarRating;
                                detail.modeCostRating = this.modeCostRating;
                                break;
                            }
                        }
                    });
            }

            this.$http.get(url + "/venues/" + this.$route.params.venueId + "/reviews")
                .then(function(response) {
                    this.reviewItems = response.body;
                    this.reviewBusy = false;
                });

            this.$http.get(url + "/venues/" + this.$route.params.venueId)
                .then(function(response) {
                    this.venue = response.body;
                    detail.category = this.venue.category;
                    detail.admin = this.venue.admin;
                    this.description = this.isLong ? this.venue.shortDescription + "..." : this.venue.shortDescription;
                    if (this.$cookies.isKey('session'))
                        this.notAdmin = this.$cookies.get('session').userId != this.venue.admin.userId ? true : false;
                    else
                        this.notAdmin = false;
                    if (this.venue.longDescription != null && this.venue.longDescription != "") this.isLong = true;
                    for (let photo in this.venue.photos) {
                        let image = this.venue.photos[photo];
                        let newImage = {src: url + "/venues/" + this.$route.params.venueId + "/photos/" + image.photoFilename, desc: image.photoDescription};
                        this.images.push(newImage);
                    }
                    this.isBusy = false;
                });
            this.detailsItem.push(detail);
        },
        methods: {
            imageExists: function() {
                return this.images.length != 0;
            },

            getProfileImgLink: function(userId) {
                return url + '/users/' + userId + '/photo';
            },

            showModal: function() {
                if (!this.$cookies.isKey('session')) return this.$router.push("/Login");
                this.$root.$emit('bv::show::modal', 'newReviewModal')
            },

            getDollars: function(value) {
                if (value == 0 || value == null) return "Free";
                return "$".repeat(value);
            },

            validateReview: function() {
                this.reviewBusy = true;
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
                if (this.$cookies.get('session').userId == this.venue.admin.userId) {
                    this.modalError = "You cannot review your own venue.";
                    this.modalHasError = true;
                    return;
                }

                let headers = {
                    'X-Authorization': this.$cookies.get('session').token
                };

                this.$http.post(url + "/venues/" + this.$route.params.venueId + "/reviews", this.newReview, { headers })
                    .then(function(response) {
                        this.$root.$emit('bv::hide::modal', 'newReviewModal');
                        this.$http.get(url + "/venues/" + this.$route.params.venueId + "/reviews")
                            .then(function(response) {
                                this.reviewItems = response.body
                                this.reviewBusy = false;
                            });
                    }, function(err) {
                        this.reviewBusy = false;
                        if (err.status == 403) {
                            this.modalError = "You can only post one review per venue.";
                            this.modalHasError = true;
                            return;
                        }
                        this.modalError = "An unknown error has occurred. Please try again soon.";
                        this.modalHasError = true;
                        return;
                    });
            },

            showMoreDesc: function() {
                if (this.showingFull) {
                    this.description = this.venue.shortDescription + '...';
                    this.showingFull = false;
                    this.showText = "Show more";
                    return;
                }
                this.description = this.venue.shortDescription + " " + this.venue.longDescription;
                this.showingFull = true;
                this.showText = "Show less";
            },

            formatDateString: function(dateString, long, time=true) {
                let date = new Date(dateString);
                if (long) {
                    let dateOptions = {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    };
                    return date.toLocaleDateString('en-NZ', dateOptions);
                }
                if (time) {
                    return (date.getFullYear() + "/" + this.padDateTime(date.getMonth() + 1) + "/" + this.padDateTime(date.getDate()) + " -- " + this.padDateTime(date.getHours()) + ":" + this.padDateTime(date.getMinutes()) + ":" + this.padDateTime(date.getSeconds()));
                }
                return (date.getFullYear() + "/" + this.padDateTime(date.getMonth() + 1) + "/" + this.padDateTime(date.getDate()));
            },

            padDateTime: function(n) {
                return n<10 ? '0'+n : n;
            },
        }
    }
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

    .showMore {
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
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(252, 47, 51, 0.6);
    }

    .valid {
        border-color: rgba(43, 255, 75, 0.8);
        outline: 0 none;
    }

    .valid:focus {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(43, 255, 75, 0.6);
    }
</style>
