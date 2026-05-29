
<template>
    <span>
    blsll
    <formaterre-keywords lang="en"></formaterre-keywords>
    <button @click="getValues">get value</button>
    </span>
</template>
<script>
import FormaterreKeywords from './FormaterreKeywords.vue'
// console.log(FormaterreKeywords)
export default {
    name: 'FormaterrePublish',
    components: {
        FormaterreKeywords
    },
    methods: {
        getValues () {
            console.log('--get values--')
        }
    }
}
</script>
<style>
</style>