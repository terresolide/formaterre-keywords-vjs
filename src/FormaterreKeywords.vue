<template>
    <span>
        <keyword-search :geonetwork="geonetwork" v-model="keywords"></keyword-search>
        <div v-for="list, key in vocabularies">{{ key}}
            <div v-for="th in list" class="sublist">
                {{ th.title }}
            </div>
        </div>

    </span>
</template>
<script>
import KeywordSearch from './KeywordSearch.vue';
export default {
    name: 'FormaterreKeywords',
    components: {KeywordSearch},
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
        },
        recommanded: {
            type: Array,
            default: () => []
        },
        excluded: {
            type: Array,
            default: () => ['external.dataCentre.formater-distributor']
        },
        keywords: {
            type: Object,
            default: () => {return {thesaurus: {}, free: []}}
        }
    },
    data () {
        return {
            vocabularies: {},
            keywords: {thesaurus: {}, free: {}}
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
            var self = this
            if (json[0]) {
                json[0].forEach(function (th) {
                    if (self.excluded.indexOf(th.key) < 0) {
                        if (!vocabularies[th.dname]) {
                            vocabularies[th.dname] = []
                        }
                        vocabularies[th.dname].push(th)
                    }
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