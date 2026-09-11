
<template>
    <span>
        {{ keywords.thesaurus}}
    <formaterre-keywords  v-model="keywords">
        Vous pouvez, ci-dessous, rechercher dans tous les thésaurus/ontologies disponibles dans le catalogue FormaTerre ou afficher les thésaurus et rechercher des mots-clés.<br />
          Si vous ne trouvez pas un mot-clé, vous pouvez saisir un mot-clé libre, et même suggérer qu'il soit ajouté aux thésaurus.</div>
       
    </formaterre-keywords>
   
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
            keywords: {thesaurus: {}, free: []}
        }
    },
    mounted () {
        this.keywords = {thesaurus:{ "external.platform.formater-platform-gn": [ { "vocab": "external.platform.formater-platform-gn", "url": "https://service.poleterresolide.fr/voc/platform/P010100", "value": "SENTINEL-1", "values": { "en": "SENTINEL-1", "fr": "SENTINEL-1" }, "items": [] } ],
            "external.theme.formater-foi-gn": 
            [ { "vocab": "external.theme.formater-foi-gn", "uri": "https://service.poleterresolide.fr/voc/FOI/c_9e053eb1", "value": "Permafrost", "values": { "fr": "Permafrost", "en": "Permafrost" }, "items": [] } ], 
            "external.discipline.formater-discipline": 
            [ { "vocab": "external.discipline.formater-discipline", "url": "https://service.poleterresolide.fr/voc/science_field/D040100", "value": "Processus glaciaires", "values": { "fr": "Processus glaciaires", "en": "Glacial processes" }, "broader": "https://service.poleterresolide.fr/voc/science_field/D040000", "items": [], fixed: true } ], 
            "external.product.formaterre-product-gn": [ { "values": { "fr": "Interférogramme", "en": "Interferogram" }, "definitions": { "fr": "", "en": "" }, "vocab": "external.product.formaterre-product-gn", "uri": "https://service.poleterresolide.fr/voc/product/c_460292ab", "definition": "", "value": "Interférogramme", "vocab": "external.product.formaterre-product-gn", "prefLabel": "Interférogramme", "lang": "fre" } ] }} 
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