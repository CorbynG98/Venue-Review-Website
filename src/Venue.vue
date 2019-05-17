<template>
    <div>
        <router-link :to="{name: 'Venues'}" class="linkBlack">Return to venue list</router-link>
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
        methods: {

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
