
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
    mounted () {
        this.keywords = { "thesaurus": { "local.theme.formaterre_themes": [ { "vocab": "local.theme.formaterre_themes", "uri": "https://registry.geonetwork-opensource.org/theme/formaterre_themes#a12a3cc2-baf3-454b-b155-e0cb615da129", "value": "Déformation du sol", "values": { "fre": "Déformation du sol", "eng": "Ground deformation" }, "items": [] } ], "external.platform.formater-platform-gn": [ { "vocab": "external.platform.formater-platform-gn", "uri": "https://service.poleterresolide.fr/voc/platform/P010100", "value": "SENTINEL-1", "values": { "eng": "SENTINEL-1", "fre": "SENTINEL-1" }, "broader": "https://service.poleterresolide.fr/voc/platform/P010000", "items": [] } ], "external.theme.formater-foi-gn": [ { "vocab": "external.theme.formater-foi-gn", "uri": "https://service.poleterresolide.fr/voc/FOI/c_9e053eb1", "value": "Permafrost", "values": { "fre": "Permafrost", "eng": "Permafrost" }, "items": [] } ], "external.discipline.formater-discipline": [ { "vocab": "external.discipline.formater-discipline", "uri": "https://service.poleterresolide.fr/voc/science_field/D040100", "value": "Processus glaciaires", "values": { "fre": "Processus glaciaires", "eng": "Glacial processes" }, "broader": "https://service.poleterresolide.fr/voc/science_field/D040000", "items": [] } ], "external.product.formaterre-product-gn": [ { "values": { "fre": "Interférogramme", "eng": "Interferogram" }, "definitions": { "fre": "", "eng": "" }, "coordEast": "", "coordWest": "", "coordSouth": "", "coordNorth": "", "thesaurusKey": "external.product.formaterre-product-gn", "uri": "https://service.poleterresolide.fr/voc/product/c_460292ab", "definition": "", "value": "Interférogramme", "vocab": "external.product.formaterre-product-gn", "prefLabel": "Interférogramme", "lang": "fre" } ] }, "free": { "place": [ { "fr": "Hymalaya", "en": "Hymalaya", "type": "place" } ] } } 
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