
<template>
    <span>
     

    <formaterre-keywords lang="en" v-model="keywords"></formaterre-keywords>
   
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
    data () {
        return {
            keywords: {thesaurus: {}, free: {}}
        }
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