<template>
    <span>
        <h1>Coucou {{ lang }}</h1>
        {{ vocabularies }}
        <div v-for="th in vocabularies">{{ th.dname }}- {{ th.filename }} - {{ th.title }}</div>

    </span>
</template>
<script>
export default {
    name: 'FormaterreKeywords',
    props: {
        lang: {
            type: String,
            default: 'fr'
        },
        geonetwork: {
            type: String,
            default: 'https://catalogue-terresolide.ipgp.fr/geonetwork'
        }
    },
    data () {
        return {
            vocabularies: []
        }
    },
    mounted () {
        this.getVocabularies()
    },
    methods: {
        getVocabularies () {
            fetch(this.geonetwork + '/srv/fre/thesaurus?_content_type=json')
            .then(resp => resp.json())
            .then(json => this.vocabularies = json[0])
        }
    }
}

</script>
<style></style>