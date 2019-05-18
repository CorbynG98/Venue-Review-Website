<template>
    <div>
        <b-container fluid>
            <div v-bind:class="[filtersShowing ? 'showing' : 'hiding']" style="transition: display 4s ease 4s; overflow: hidden;">
                <b-row>
                    <b-col md="6" class="my-1">
                        <b-form-group label-cols-sm="3" label="Search Name" class="mb-0">
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
            <div style="width: 100%; margin-top: 1rem;">
                <div>
                    <b-button v-on:click="showModal()" ref="btnShow" style="float: left; margin-bottom: 1rem;">New Venue</b-button>

                    <b-modal
                        id="newVenueModal"
                        size="xl"
                        title="New Venue"
                        centered>
                        <form ref="form">

                        </form>
                    </b-modal>
                </div>
            </div>


            <b-table
                style="margin-top: 2rem;"
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
                    <star-rating :rating="row.item.meanStarRating" :increment="0.1" :read-only="true" :show-rating="false" :star-size="20"></star-rating>
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
                    >
                        <div slot="page">
                            {{ getPageRange() }}
                        </div>
                    </b-pagination>
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
                    { key: 'venueName', label: 'Name', sortable: true, class: 'text-center', sortDirection: 'desc' },
                    { key: 'categoryId.categoryName', label: 'Category', sortable: true, class: 'text-center', sortDirection: 'desc' },
                    { key: 'city', label: 'City', sortable: true, class: 'text-center', sortDirection: 'desc' },
                    { key: 'shortDescription', label: 'Desc', class: 'text-center', sortable: false },
                    { key: 'meanStarRating', label: 'Star Rating', sortable: true, formatter: value => {
                            console.log("test: " + value);
                            if (value == 0 || value == null || value == undefined) return parseInt('3').toFixed(2);
                            return value.toFixed(2);
                        }, class: 'text-center', sortDirection: 'asc' },
                    { key: 'modeCostRating', label: 'Cost Rating', sortable: true, formatter: value => {
                            if (value == 0 || value == null) return "Free";
                            return "$".repeat(value);
                        }, class: 'text-center', sortDirection: 'desc' },
                    { key: 'actions', label: 'Actions', sortable: false},
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: 10,
                pageOptions: [10, 15, 20],
                starOptions: [1, 2, 3, 4, 5],
                costOptions: [
                    { value: 0, text: 'Free' },
                    { value: 1, text: '$' },
                    { value: 2, text: '$$' },
                    { value: 3, text: '$$$' },
                    { value: 4, text: '$$$$' }
                ],
                categoryOptions: [],
                sortBy: null,
                sortDesc: false,
                sortDirection: 'desc',
                filter: null,
                citySort: null,
                minStar: null,
                isBusy: true,
                maxCost: null,
                categorySort: null,
                filtersShowing: true,
                cities: [],
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    content: ''
                }
            }
        },
        computed: {
            rows() {
                return this.items.length
            }
        },
        mounted: function() {
            this.$cookies.set('redirect', this.$router.currentRoute.fullPath);
            this.$http.get(url + "/categories")
                .then(function(response) {
                    this.categories = response.body;
                    for(let cat in this.categories) {
                        let name = this.categories[cat].categoryName;
                        this.categoryOptions.push(name);
                    }
                    this.isBusy = false;
                });
            this.getVenues();
            this.totalRows = this.items.length;
        },
        methods: {
            getVenues: function() {
                let citySet = new Set();
                let sortData = {
                    sortBy: 'STAR_RATING'
                };
                this.isBusy = true;
                this.$http.get(url + "/venues", { params: sortData })
                    .then(function(response) {
                        this.items = response.body;
                        for (let venue in this.items) {
                            citySet.add(this.items[venue].city);
                            if (this.items[venue].meanStarRating == 0 || this.items[venue].meanStarRating == null) this.items[venue].meanStarRating = 3;
                            for(let cat in this.categories) {
                                if (parseInt(cat) + 1 === parseInt(this.items[venue].categoryId)) {
                                    this.items[venue].categoryId = this.categories[cat];
                                    break;
                                }
                            }
                        }
                        this.cities = Array.from(citySet);
                        this.isBusy = false;
                    }, function(error) {
                        this.isBusy = false;
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

            showModal: function() {
                if (!this.$cookies.isKey('session')) return this.$router.push("/Login");
                this.$root.$emit('bv::show::modal', 'newVenueModal')
            },

            getPageRange: function() {
                let current = parseInt(this.currentPage);
                let end = current + 9;

                return (current + ' - ' + end);
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
                    queryParams.maxCostRating = this.maxCost;
                }
                if (queryParams === {}) return this.getVenues();
                this.$http.get(url + "/venues", {params: queryParams})
                    .then(function(response) {
                        this.items = response.body;
                        for (let venue in this.items) {
                            if (this.items[venue].meanStarRating == 0 || this.items[venue].meanStarRating == null) this.items[venue].meanStarRating = 3;
                            for(let cat in this.categories) {
                                if (parseInt(cat) + 1 === parseInt(this.items[venue].categoryId)) {
                                    this.items[venue].categoryId = this.categories[cat];
                                    continue;
                                }
                            }
                        }
                        this.isBusy = false;
                    }, function(err) {
                        this.isBusy = false;
                        console.log(err);
                    });
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

    .linkBlack {
        color: rgb(44, 62, 80);
        transition: 0.1s;
    }

    .linkBlack:hover {
        cursor: pointer;
        text-decoration: none;
        color: rgb(88, 124, 160);
    }
</style>
