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
                <div v-if="!reviewOpen">
                    <b-button v-on:click="checkAuth()">Leave a review</b-button>
                </div>
                <div v-else>
                    <div style="display: inline-flex; width: 100%;">
                        <div height="10rem" style="background-color: red; width: 30%;">
                            yeet
                        </div>
                        <div style="background-color: blue; width: 70%;">
                            yeet
                        </div>
                    </div>
                </div>
                <b-table striped hover :items="reviewItems" :fields="reviewFields" style="margin-top: 2rem;">
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
                description: "",
                slide: 0,
                sliding: null,
                isBusy: true,
                isLong: false,
                showText: 'Show more',
                showingFull: false,
                images: [],
                venue: '',
                reviewOpen: false,
                meanStarRating: 3,
                modeCostRating: 'Free'
            }
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
                    this.reviewItems = response.body
                });

            this.$http.get(url + "/venues/" + this.$route.params.venueId)
                .then(function(response) {
                    this.venue = response.body;
                    detail.category = this.venue.category;
                    detail.admin = this.venue.admin;
                    this.description = this.isLong ? this.venue.shortDescription + "..." : this.venue.shortDescription;
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
                // return '/src/assets/default-profile.png';
                return url + '/users/' + userId + '/photo';
            },

            getDollars: function(value) {
                if (value == 0 || value == null) return "Free";
                return "$".repeat(value);
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

            checkAuth: function() {
                if (this.$cookies.isKey('session')) {
                    this.reviewOpen = true;
                    return;
                }
                this.reviewOpen = false;
                this.$router.push('/Login');
            }
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

    .link {
        color: #fff;
        transition: 0.1s;
    }

    .link:hover {
        text-decoration: none;
        color: #fff;
    }

    .venueName {
        font-size: 3rem;
    }

    .info-cluster {
        width: auto;
    }

    .stars-outer {
        display: inline-block;
        position: relative;
        font-family: FontAwesome;
    }

    .stars-outer::before {
        content: "\f006 \f006 \f006 \f006 \f006";
    }

    .stars-inner {
        position: absolute;
        top: 0;
        left: 0;
        white-space: nowrap;
        overflow: hidden;
    }

    .stars-inner::before {
        content: "\f005 \f005 \f005 \f005 \f005";
        color: #f8ce0b;
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
</style>
