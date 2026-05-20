<template>
  <h1>Coucou {{ lang }}</h1>
</template>
<script>
export default {
    name: 'FormaterreKeywords',
    props: {
        lang: {
            type: String,
            default: 'fr'
        }
    }
}

</script>
<style></style>