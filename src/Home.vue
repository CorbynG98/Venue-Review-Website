<template>
    <div>
        Home Page
    </div>
</template>


<script>
    export default {
        data() {
            return {
                error: "",
                errorFlag: false
            }
        },
        mounted: function() {
            this.$cookies.set('redirect', this.$router.currentRoute.fullPath);
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>
