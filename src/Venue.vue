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
                :interval="1000000"
                controls
                indicators
                background="#ababab"
                img-width="1024"
                img-height="480"
                style="text-shadow: 1px 1px 2px; height: 480px;"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd">
                <div v-if="imageExists()">
                    <div v-for="image in images">
                        <b-carousel-slide v-bind:img-src='image.src'>
                            <h1>{{ image.desc }}</h1>
                        </b-carousel-slide>
                    </div>
                </div>
                <div v-else>
                    <b-carousel-slide img-src="https://summer.pes.edu/wp-content/uploads/2019/02/default-2.jpg" style="height: 480px; background-position: 50% 50%;">
                        <h1>No images found for this venue</h1>
                    </b-carousel-slide>
                </div>
            </b-carousel>
            <div class="venueInformation">

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
                venue: ''
            }
        },
        mounted: function() {
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
            onSlideStart(slide) {
                this.sliding = true
            },
            onSlideEnd(slide) {
                this.sliding = false
            },
            imageExists: function() {
                return this.images.length != 0;
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
</style>
