<template>
    <span>
       {{ lang }} {{ geonetwork }}
        <h1>{{lang }}</h1>
        {{ skosmos }}
        <div v-for="list, key in vocabularies">{{ key}}
            <div v-for="th in list" class="sublist">
                {{ th.title }}
            </div>
        </div>

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
            default: 'NULL'
        },
        required: {
            type: Array,
            default: () => ['local.theme.formaterre_themes']
        },
        excluded: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            vocabularies: {}
        }
    },
    computed: {
        locale() {
            if (this.lang === 'fr') {
                return 'fre'
            } else {
                return 'eng'
            }
        }
    },
    mounted () {
        this.getVocabulariesGeonetwork()
    },
    methods: {
        getVocabulariesGeonetwork () {
            fetch(this.geonetwork + '/srv/' + this.locale + '/thesaurus?_content_type=json')
            .then(resp => resp.json())
            .then(json => this.treatmentVocabulariesGeonetwork(json))
        },
        treatmentVocabulariesGeonetwork (json) {
            var vocabularies = {}
            if (json[0]) {
                json[0].forEach(function (th) {
                    console.log(th)
                    if (!vocabularies[th.dname]) {
                        vocabularies[th.dname] = []
                    }
                    vocabularies[th.dname].push(th)
                })
            }
            this.vocabularies = vocabularies
        }
    }
}

</script>
<style>
.sublist {
    margin-left: 10px;
}
</style>