<template>
    <span>
        <h1>Coucou {{ lang }}</h1>
        {{ vocabularies }}
        <div v-for="list, key in vocabularies">{{ list}}</div>

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
        },
        skosmos: {
            type: String,
            default: null
        },
        required: {
            type: Array,
            default: () => ['local.theme.formaterre_themes']
        }
    },
    data () {
        return {
            vocabularies: {}
        }
    },
    mounted () {
        this.getVocabulariesGeonetwork()
    },
    methods: {
        getVocabulariesGeonetwork () {
            fetch(this.geonetwork + '/srv/fre/thesaurus?_content_type=json')
            .then(resp => resp.json())
            .then(json => this.treatmentVocabulariesGeonetwork(json))
        },
        treatmentVocabulariesGeonetwork (json) {
            var self = this
            if (json[0]) {
                json[0].forEach(function (th) {
                    console.log(th)
                    if (!self.vocabularies[th.dname]) {
                        self.vocabularies[th.dname] = []
                    }
                    self.vocabularies[th.dname].push(th)
                })
            }
            console.log(this.vocabularies)
        }
    }
}

</script>
<style></style>