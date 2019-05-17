<template>
    <div>
        <b-container fluid>
            <div v-if="isBusy">

            </div>
            <div v-else>
                <div v-bind:class="[filtersShowing ? 'showing' : 'hiding']" style="transition: display 4s ease 4s; overflow: hidden;">
                    <b-row>
                        <b-col md="6" class="my-1">
                            <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
                                <b-input-group>
                                    <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
                                    <b-input-group-append>
                                        <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="my-1">
                            <b-form-group label-cols-sm="3" label="Select City" class="mb-0">
                                <b-input-group>
                                    <b-form-select v-model="citySort" :options="cities" v-on:change="filterCities">
                                        <option slot="first" :value="null">-- All --</option>
                                    </b-form-select>
                                </b-input-group>
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="my-1">
                            <b-form-group label-cols-sm="3" label="Category" class="mb-0">
                                <b-form-select v-model="categorySort" :options="categoryOptions" v-on:change="filterCities">
                                    <option slot="first" :value="null">-- All --</option>
                                </b-form-select>
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="my-1">
                            <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
                                <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="my-1">
                            <b-form-group label-cols-sm="3" label="Min Star Rating" class="mb-0">
                                <b-form-select v-model="minStar" label="test" :options="starOptions" v-on:change="filterCities">
                                    <option slot="first" :value="null">-- All --</option>
                                </b-form-select>
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="my-1">
                            <b-form-group label-cols-sm="3" label="Max Cost Rating" class="mb-0">
                                <b-form-select v-model="maxCost" label="test" :options="costOptions" v-on:change="filterCities">
                                    <option slot="first" :value="null">-- All --</option>
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </div>
                <div class="showFilters">
                    <a v-on:click="toggleFilters()" class="linkBlack" style="float: left; margin-left: 4.5rem; font-size: 1.5rem; color: blue; display: none;">Show filters</a>
                </div>
            </div>


            <b-table
                show-empty
                stacked="md"
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :busy="isBusy"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :filter-function="filterVenues"
                @filtered="onFiltered">
                <div slot="table-busy">
                    <div class="text-center">
                        <b-spinner variant="primary" label="Spinning"></b-spinner>
                    </div>
                </div>
                <template slot="primaryPhoto" slot-scope="row">
                    <b-img v-bind:src="getLink(row.item.venueId, row.item.primaryPhoto)" width="200" height="150"></b-img>
                </template>
                <template slot="meanStarRating" slot-scope="row">
                    <div class="starRating">
                        <div class="stars-outer">
                            <div class="stars-inner" v-bind:style="{width: getPercentage(row.item.meanStarRating)}"></div>
                        </div>
                    </div>
                </template>
                <template slot="actions" slot-scope="row">
                    <b-button size="sm">
                        <router-link :to="{name: 'Venue', params: { venueId: row.item.venueId, meanStarRating: row.item.meanStarRating, modeCostRating: row.item.modeCostRating }}"
                                     class="link">Venue Details</router-link>
                    </b-button>
                </template>
            </b-table>

            <b-row>
                <b-col md="6" class="my-1">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        class="my-0"
                    ></b-pagination>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import url from './globalVars';
    export default {
        data() {
            return {
                error: "",
                errorFlag: "",
                items: [],
                categories: [],
                fields: [
                    { key: 'primaryPhoto', label: 'Image', sortable: false },
                    { key: 'venueName', label: 'Name', sortable: true, class: 'text-center', sortDirection: 'asc' },
                    { key: 'categoryId.categoryName', label: 'Category', sortable: true, class: 'text-center', sortDirection: 'asc' },
                    { key: 'city', label: 'City', sortable: true, class: 'text-center', sortDirection: 'asc' },
                    { key: 'shortDescription', label: 'Desc', class: 'text-center', sortable: false },
                    { key: 'meanStarRating', label: 'Star Rating', sortable: true, formatter: value => {
                            if (value == 0 || value == null) return '3.00';
                            return value.toFixed(2);
                        }, class: 'text-center', sortDirection: 'asc' },
                    { key: 'modeCostRating', label: 'Cost Rating', sortable: true, formatter: value => {
                        if (value == 0 || value == null) return "Free";
                        return "$".repeat(value);
                    }, class: 'text-center', sortDirection: 'asc' },
                    { key: 'actions', label: 'Actions', sortable: false},
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: 10,
                pageOptions: [10, 15, 20],
                starOptions: [1, 2, 3, 4, 5],
                costOptions: ['Free', '$', '$$', '$$$', '$$$$'],
                categoryOptions: [],
                sortBy: null,
                sortDesc: false,
                sortDirection: 'asc',
                filter: null,
                citySort: null,
                minStar: null,
                isBusy: true,
                maxCost: null,
                categorySort: null,
                filtersShowing: true,
                cities: ["Christchurch", "Auckland"],
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    content: ''
                }
            }
        },
        mounted: function() {
            this.$http.get(url + "/categories")
                .then(function(response) {
                    this.categories = response.body;
                    for(let cat in this.categories) {
                        let name = this.categories[cat].categoryName;
                        this.categoryOptions.push(name);
                    }
                });
            this.getVenues();
            this.totalRows = this.items.length;
            this.isBusy = false;
        },
        methods: {
            getVenues: function() {
                this.$http.get(url + "/venues")
                    .then(function(response) {
                        this.items = response.body;
                        for (let venue in this.items) {
                            for(let cat in this.categories) {
                                if (parseInt(cat) + 1 === parseInt(this.items[venue].categoryId)) {
                                    this.items[venue].categoryId = this.categories[cat];
                                    break;
                                }
                            }
                        }

                    }, function(error) {
                        console.log(error);
                    });
            },

            getLink: function(venueId, photoFilename) {
                if (venueId == null || photoFilename == null) return "/src/assets/default.jpg";
                return (url + '/venues/' + venueId + '/photos/' + photoFilename);
            },

            filterVenues: function(data, string) {
                return data.venueName.includes(string);
            },

            toggleFilters: function() {
                this.filtersShowing = !this.filtersShowing;
            },

            getPercentage: function(rating) {
                rating = rating==null ? 3 : rating;
                return (((rating/5) * 100).toFixed(2)).toString() + '%';
            },

            filterCities: function() {
                this.isBusy = true;
                let queryParams = {};
                if (this.citySort != null) queryParams.city = this.citySort;
                if (this.categorySort != null) {
                    for (let cat in this.categories) {
                        if (this.categories[cat].categoryName === this.categorySort) queryParams.categoryId = this.categories[cat].categoryId;
                    }
                }
                if (this.minStar != null) {
                    queryParams.minStarRating = this.minStar;
                }
                if (this.maxCost != null) {
                    if (this.maxCost === 'Free') queryParams.maxCostRating = 0;
                    if (this.maxCost === '$') queryParams.maxCostRating = 1;
                    if (this.maxCost === '$$') queryParams.maxCostRating = 2;
                    if (this.maxCost === '$$$') queryParams.maxCostRating = 3;
                    if (this.maxCost === '$$$$') queryParams.maxCostRating = 4;
                }
                if (queryParams === {}) return this.getVenues();
                this.$http.get(url + "/venues", {params: queryParams})
                    .then(function(response) {
                        this.items = response.body;
                        for (let venue in this.items) {
                            for(let cat in this.categories) {
                                if (parseInt(cat) + 1 === parseInt(this.items[venue].categoryId)) {
                                    this.items[venue].categoryId = this.categories[cat];
                                    continue;
                                }
                            }
                        }
                    }, function(err) {
                        console.log(err);
                    })
                this.isBusy = false;
            },

            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            },
        }
    }
</script>

<style scoped>
    .link {
        color: rgb(44, 62, 80);
        color: #fff;
        transition: 0.1s;
    }

    .link:hover {
        text-decoration: none;
        color: rgb(88, 124, 160);
        color: #fff;
    }

    .hiding {
        height: 0;
    }

    .showing {
        height: auto;
    }

    .linkBlack {
        color: rgb(44, 62, 80);
        transition: 0.1s;
    }

    .linkBlack:hover {
        cursor: pointer;
        text-decoration: none;
        color: rgb(88, 124, 160);
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
