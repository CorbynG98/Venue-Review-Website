<template>
    <div>
      Users
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        mounted: function() {
            this.$cookies.set('redirect', this.$router.currentRoute.fullPath);
        }
    }
</script>

<style scoped>

</style>
