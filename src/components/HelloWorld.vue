<template>
<div class="container">
    {{test}}
</div>
</template>

<script>
export default {
    name: 'hello',
    data() {
        return {
            test: 'login'
        };
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped rel="stylesheet/scss" lang="scss">
  $bg:#283443;
</style>
