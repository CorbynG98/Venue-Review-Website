<template>
    <div>
        <b-container fluid>
            <div v-bind:class="[filtersShowing ? 'showing' : 'hiding']" style="transition: display 4s ease 4s; overflow: hidden;">
                <b-row>
                    <b-col md="6" class="my-1">
                        <b-form-group label-cols-sm="3" label="Search Name" class="mb-0">
                            <b-input-group>
                                <b-form-input v-model="filter" placeholder="Type to Search" v-on:input="filterCities"></b-form-input>
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

                    <b-col md="6" class="my-1">
                        <b-form-group label-cols-sm="3" label="Sort by distance" class="mb-0">
                            <b-form-select v-model="distanceSort" label="test" :options="distanceOptions" v-on:change="filterCities">
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
                    <b-button size="lg" variant="primary" v-on:click="showModal()" ref="btnShow" style="float: left; margin-bottom: 1rem;">New Venue</b-button>
                    <div v-if="mineShowing">
                        <b-button size="lg" variant="success" v-on:click="showAllVenues()" ref="btnShow" style="float: left; margin-bottom: 1rem; margin-left: 1rem;">All Venues</b-button>
                    </div>
                    <div v-else>
                        <b-button size="lg" variant="primary" v-on:click="filterMyVenues()" ref="btnShow" style="float: left; margin-bottom: 1rem; margin-left: 1rem;">My Venues</b-button>
                    </div>

                    <b-modal
                        id="newVenueModal"
                        size="xl"
                        title="New Venue"
                        centered>
                        <form ref="form">
                            <div style="display: inline-flex; width: 100%; margin-top: 0; margin-bottom: 1rem;">
                                <b-form-input v-model="newVenueModel.venueName" placeholder="Venues name" style="margin-right: 1rem;"></b-form-input>
                                <b-form-select v-model="newVenueModel.categoryId" :options="categoryOptions"style="margin-right: 1rem; margin-left: 1rem;"></b-form-select>
                                <b-form-input v-model="newVenueModel.city" placeholder="City"style="margin-left: 1rem;"></b-form-input>
                            </div>
                            <div style="margin-bottom: 1rem;">
                                <b-form-input v-model="newVenueModel.shortDescription" placeholder="Short Description" style="margin-bottom: 1rem;"></b-form-input>
                                <b-form-input v-model="newVenueModel.longDescription" placeholder="Long Description"></b-form-input>
                            </div>
                            <b-form-input v-model="newVenueModel.address" placeholder="Address" style="margin-bottom: 1rem;"></b-form-input>
                            <div style="display: inline-flex; margin-bottom: 0; width: 100%;">
                                <b-form-input v-model="newVenueModel.longitude" placeholder="Latitude" style="margin-right: 1rem;"></b-form-input>
                                <b-form-input v-model="newVenueModel.latitude" placeholder="Longitude" style="margin-left: 1rem;"></b-form-input>
                            </div>
                        </form>
                        <template slot="modal-footer">
                            <div v-if="modalHasError" class="text-danger">
                                {{ modalError }}
                            </div>
                            <b-button primary size="lg" variant="danger" v-on:click="hideModal()">
                                Cancel
                            </b-button>
                            <b-button primary size="lg" variant="success" v-on:click="uploadNewVenue()">
                                Submit
                            </b-button>
                        </template>
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
                :busy="isBusy"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered">
                <div slot="table-busy">
                    <div class="text-center">
                        <b-spinner variant="primary" label="Spinning"></b-spinner>
                    </div>
                </div>
                <template slot="primaryPhoto" slot-scope="row">
                    <b-img v-bind:src="getLink(row.item.venueId, row.item.primaryPhoto)" fluid width="200" height="150"></b-img>
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
                        class="my-0">
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
                    {key: 'primaryPhoto', label: 'Image', sortable: false},
                    {key: 'venueName', label: 'Name', sortable: true, class: 'text-center', sortDirection: 'desc'},
                    {
                        key: 'categoryId.categoryName',
                        label: 'Category',
                        sortable: true,
                        class: 'text-center',
                        sortDirection: 'desc'
                    },
                    {key: 'city', label: 'City', sortable: true, class: 'text-center', sortDirection: 'desc'},
                    {key: 'shortDescription', label: 'Desc', class: 'text-center', sortable: false},
                    {
                        key: 'meanStarRating', label: 'Star Rating', sortable: true, formatter: value => {
                            if (value == 0 || value == null || value == undefined) return parseInt('3').toFixed(2);
                            return value.toFixed(2);
                        }, class: 'text-center', sortDirection: 'asc'
                    },
                    {
                        key: 'modeCostRating', label: 'Cost Rating', sortable: true, formatter: value => {
                            if (value == 0 || value == null) return "Free";
                            return "$".repeat(value);
                        }, class: 'text-center', sortDirection: 'desc'
                    },
                    {key: 'actions', label: 'Actions', sortable: false}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: 10,
                venuePhotos: [],
                photoPreview: [],
                pageOptions: [10, 15, 20],
                starOptions: [1, 2, 3, 4, 5],
                photoQueue: [],
                costOptions: [
                    {value: 0, text: 'Free'},
                    {value: 1, text: '$'},
                    {value: 2, text: '$$'},
                    {value: 3, text: '$$$'},
                    {value: 4, text: '$$$$'}
                ],
                distanceOptions: [
                    {value: 0, text: 'Closest'},
                    {value: 1, text: 'Farthest'}
                ],
                newVenueModel: {
                    venueName: "",
                    categoryId: 0,
                    city: "",
                    shortDescription: "",
                    longDescription: "",
                    address: "",
                    latitude: null,
                    longitude: null
                },
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
                },
                position: null,
                showingDistance: false,
                distanceSort: null,
                modalHasError: false,
                modalError: "",
                hasImages: false,
                queryParams: {},
                editMode: false,
                mineShowing: false,
                adminId: null
            }
        },
        mounted: function () {
            this.$cookies.set('redirect', this.$router.currentRoute.fullPath);
            this.$http.get(url + "/categories")
                .then(function (response) {
                    this.categories = response.body;
                    for (let cat in this.categories) {
                        let name = this.categories[cat].categoryName;
                        let id = this.categories[cat].categoryId;
                        this.categoryOptions.push({value: id, text: name});
                    }
                    this.isBusy = false;
                });
            this.getVenues();
            this.totalRows = this.items.length;
        },
        updated: function () {
            this.totalRows = this.items.length;
            this.hasImages = this.photoQueue.length > 0 ? true : false;
        },
        methods: {
            getVenues: function () {
                let citySet = new Set();
                let sortData = {
                    sortBy: 'STAR_RATING'
                };
                this.isBusy = true;
                this.$http.get(url + "/venues", {params: sortData})
                    .then(function (response) {
                        this.items = response.body;
                        for (let venue in this.items) {
                            citySet.add(this.items[venue].city);
                            if (this.items[venue].meanStarRating == 0 || this.items[venue].meanStarRating == null) this.items[venue].meanStarRating = 3;
                            for (let cat in this.categories) {
                                if (parseInt(cat) + 1 === parseInt(this.items[venue].categoryId)) {
                                    this.items[venue].categoryId = this.categories[cat];
                                    break;
                                }
                            }
                        }
                        this.cities = Array.from(citySet);
                        this.isBusy = false;
                    }, function (error) {
                        this.isBusy = false;
                        console.log(error);
                    });
            },

            filterMyVenues: function() {
                this.mineShowing = true;
                this.adminId = this.$cookies.get('session').userId;
                this.filterCities();
            },

            showAllVenues: function() {
                this.mineShowing = false;
                this.adminId = null;
                this.filterCities();
            },

            getLink: function (venueId, photoFilename) {
                if (venueId == null || photoFilename == null) return "/src/assets/default.jpg";
                return (url + '/venues/' + venueId + '/photos/' + photoFilename);
            },

            pageGen: function() {
                return;
            },

            linkGen: function(pageNum) {
                return pageNum === 1 ? '?' : `?page=${pageNum}`
            },

            onFileChange: function(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                for(let image in files) {
                    this.photoQueue.push(files[image]);
                    this.createImage(files[image])
                }
            },

            hideModal: function() {
                this.$root.$emit('bv::hide::modal', 'newVenueModal')
            },

            createImage: function(file) {
                let image = new Image();
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.photoPreview.push(e.target.result);
                };
                reader.readAsDataURL(file);
            },

            toggleFilters: function () {
                this.filtersShowing = !this.filtersShowing;
            },

            showModal: function () {
                if (!this.$cookies.isKey('session')) return this.$router.push("/Login");
                this.$root.$emit('bv::show::modal', 'newVenueModal')
            },

            getPageRange: function () {
                let current = parseInt(this.currentPage);
                let end = current + this.perPage - 1;
                end = end > this.totalRows ? this.totalRows : end;
                return (current + ' - ' + end);
            },

            uploadNewVenue: function() {
                this.modalHasError = false;
                if (this.newVenueModel.venueName.length < 3) {
                    this.modalError = "Venue name cant be that short!";
                    this.modalHasError = true;
                    return;
                }
                if (this.newVenueModel.categoryId == null) {
                    this.modalError = "Please choose a valid category";
                    this.modalHasError = true;
                    return;
                }
                if (this.newVenueModel.city.length < 1) {
                    this.modalError = "Please enter a valid city name";
                    this.modalHasError = true;
                    return;
                }
                if (this.newVenueModel.shortDescription.length < 5) {
                    this.modalError = "Please enter a valid description";
                    this.modalHasError = true;
                    return;
                }
                if (this.newVenueModel.longDescription.length < 10) {
                    this.modalError = "Long description cant be that short!";
                    this.modalHasError = true;
                    return;
                }
                if (this.newVenueModel.address.length < 5) {
                    this.modalError = "Please enter the full address";
                    this.modalHasError = true;
                    return;
                }
                if (this.newVenueModel.longitude == null) {
                    this.modalError = "Venue needs a location!";
                    this.modalHasError = true;
                    return;
                }
                if (this.newVenueModel.latitude == null) {
                    this.modalError = "Venue needs a location!";
                    this.modalHasError = true;
                    return;
                }

                try {
                    this.newVenueModel.latitude = parseInt(this.newVenueModel.latitude);
                    this.newVenueModel.longitude = parseInt(this.newVenueModel.longitude);
                } catch ( Exception ) {
                    this.modalError = "Latitude and Longitude must be numbers";
                    this.modalHasError = true;
                    return;
                }

                let headers = {
                    'X-Authorization': this.$cookies.get('session').token
                };

                this.$http.post(url + '/venues', this.newVenueModel, { headers })
                    .then(function(response) {
                        this.filterCities();
                        this.$root.$emit('bv::hide::modal', 'newVenueModal')
                    }, function(err) {
                        console.log(err);
                    });
            },

            runSortCode: function(queryParams) {
                if (queryParams === {}) return this.getVenues();
                this.$http.get(url + "/venues", {params: queryParams})
                    .then(function (response) {
                        this.items = response.body;
                        for (let venue in this.items) {
                            if (this.items[venue].meanStarRating == 0 || this.items[venue].meanStarRating == null) this.items[venue].meanStarRating = 3;
                            for (let cat in this.categories) {
                                if (parseInt(cat) + 1 === parseInt(this.items[venue].categoryId)) {
                                    this.items[venue].categoryId = this.categories[cat];
                                    continue;
                                }
                            }
                        }
                        this.isBusy = false;
                    }, function (err) {
                        this.isBusy = false;
                        console.log(err);
                    });
            },

            filterCities: function () {
                this.isBusy = true;
                let queryParams = this.queryParams = {};
                if (this.distanceSort == null) queryParams = this.queryParams;
                if (this.citySort != null) queryParams.city = this.citySort;
                if (this.adminId != null) queryParams.adminId = this.adminId;
                if (this.filter != null && this.filter.length > 1) queryParams.q = this.filter;
                if (this.categorySort!= null) {
                    queryParams.categoryId = this.categorySort;
                }
                if (this.minStar != null) {
                    queryParams.minStarRating = this.minStar;
                }
                if (this.maxCost != null) {
                    queryParams.maxCostRating = this.maxCost;
                }
                if (this.distanceSort != null) {
                    let vm = this;
                    queryParams.reverseSort = false;
                    if (this.distanceSort == 1) queryParams.reverseSort = true;
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(returned) {
                            queryParams.sortBy = "DISTANCE";
                            queryParams.myLatitude = returned.coords.latitude;
                            queryParams.myLongitude = returned.coords.longitude;
                            if (vm.showingDistance === false) {
                                vm.showingDistance = true;
                                vm.fields.splice(vm.fields.length - 1, 0, {
                                    key: "distance",
                                    label: "Distance",
                                    sortable: true,
                                    formatter: value => {
                                        if (value < 1) return ((value*1000).toFixed(2) + "m");
                                        return (value.toFixed(2) + "km");
                                    }
                                });
                            }
                            vm.runSortCode(queryParams);
                        }, function(err) {
                            vm.distanceSort = null;
                            vm.isBusy = false;
                            alert("Location is not enabled!");
                            return;
                        });
                    }
                } else {
                    this.queryParams = {};
                    if (queryParams === {}) return this.getVenues();
                    if (this.showingDistance === true) {
                        this.showingDistance = false;
                        this.fields = this.fields.filter(function(value, index, arr) {
                            return value.label !== "Distance";
                        });
                    }
                    if (queryParams == {}) return this.getVenues();
                    this.runSortCode(queryParams);
                }
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

    .image {
        display: inline-flex;
        margin: auto;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        border: 1px solid #ebebeb;
    }
</style>
