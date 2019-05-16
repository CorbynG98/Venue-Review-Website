<template>
    <div>
      Venues (here so I can easily distingiush)
      <div class="venueFilters">
        This is where filter options will be
      </div>
      <div v-for="venue in venues">
        <div class="venueBox">
          <div class="venueImage">
              this is the image
          </div>
          <div class="venueInfo">
            <div class="venueName">
              {{ venue.venueName }}
            </div>
            <div class="StarCostRating">
              <div class="starRating">
                <div class="stars-outer">
                  <div class="stars-inner" v-bind:style="{width: getPercentage(venue.meanStarRating)}"></div>
                </div>
              </div>
              <div class="splitter">&nbsp&nbsp|&nbsp&nbsp</div>
              <div class="costRating">
                $$
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        data() {
          return {
            error: "",
            errorFlag: "",
            venues: []
          }
        },
      mounted: function() {
        this.getVenues();
      },
      methods: {
        getVenues: function() {
          this.$http.get("http://localhost:4940/api/v1/venues")
            .then(function(response) {
              console.log(response);
              this.venues = response.body;
            }, function(error) {
              console.log(error);
            });
        },

        getPercentage: function(rating) {
          console.log(((5 / rating) * 100).toString() + '%');
          return ((rating/5) * 100).toString() + '%';
        }
      }
    }
</script>

<style scoped>
  .venueBox {
    display: inline-flex;
    height: 15rem;
    padding: 2rem;
    width: 100%;
  }

  .venueImage {
    height: 11rem;
    width: 15rem;
    margin-right: 1rem;
    background-color: lightgrey;
  }

  .venueName {
    font-size: 1.2rem;
    text-align: left;
    font-weight: bold;
    width: 100%;
  }

  .venueInfo {
    width: 90%;
    margin-left: 1rem;
    display: block;
  }

  .venueName {
    float: left;
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

  .StarCostRating {
    text-align: left;
  }
</style>
