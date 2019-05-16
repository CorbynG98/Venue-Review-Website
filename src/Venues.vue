<template>
    <div>
      Venues (here so I can easily distingiush)
      <div class="venueFilters">
        This is where filter options will be
      </div>
      <div v-for="venue in venues">
        <div class="venueBox">
          <div class="venueImage">

          </div>
          <div>
            {{ venue.venueName }}
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
        }
      }
    }
</script>

<style scoped>
  .venueBox {
    height: 10rem;
  }
</style>
