<template>
    <b-container>
        <router-link :to="{name: 'Venues'}" class="linkBlack">Return to venue list</router-link>
        <div v-if="isBusy">
            <div class="text-center">
                <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
        </div>
        <div v-else>
            <b-carousel
                id="carousel-1"
                v-model="slide"
                :interval="6000"
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
                <h3 class="venueName"> {{ venue.venueName }} </h3>
                <div class="infoCluster" style="display: inline-flex;">
                    <h4 class="venueCategory">
                        {{ venue.category.categoryName }}
                    </h4>
                    &nbsp&nbsp
                    <h4 class="venueStarRating">
                        <div class="starRating">
                            <div class="stars-outer">
                                <div class="stars-inner" v-bind:style="{width: getPercentage(meanStarRating)}"></div>
                            </div>
                        </div>
                    </h4>
                    &nbsp&nbsp
                    <h4 class="venueCostRating">
                        {{ modeCostRating }}
                    </h4>
                    &nbsp&nbsp
                    <h4 class="venueAdmin">
                        {{ venue.admin.username }}
                    </h4>
                </div>
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
                slide: 0,
                sliding: null,
                isBusy: true,
                images: [],
                venue: '',
                meanStarRating: 3,
                modeCostRating: 'Free'
            }
        },
        mounted: function() {
            this.meanStarRating = this.$route.params.meanStarRating;
            this.modeCostRating = this.$route.params.modeCostRating;
            if (this.meanStarRating == null || this.modeCostRating == null) {
                this.$http.get(url + '/venues')
                    .then(function(response) {
                        console.log('yeet');
                        for (let index in response.body) {
                            if (response.body[index].venueId == this.$route.params.venueId) {
                                this.meanStarRating = response.body[index].meanStarRating;
                                this.modeCostRating = response.body[index].modeCostRating;
                                break;
                            }
                        }
                    });
            }
            this.$http.get(url + "/venues/" + this.$route.params.venueId)
                .then(function(response) {
                    this.venue = response.body;
                    for (let photo in this.venue.photos) {
                        let image = this.venue.photos[photo];
                        let newImage = {src: url + "/venues/" + this.$route.params.venueId + "/photos/" + image.photoFilename, desc: image.photoDescription};
                        this.images.push(newImage);
                    }
                    this.isBusy = false;
                })
        },
        methods: {
            imageExists: function() {
                return this.images.length != 0;
            },

            getPercentage: function(rating) {
                rating = rating==null ? 3 : rating;
                return (((rating/5) * 100).toFixed(2)).toString() + '%';
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
</style>
