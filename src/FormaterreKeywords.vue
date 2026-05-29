<template>
    <span>
        {{ keywords }}
        <keyword-search :geonetwork="geonetwork" :types="types" :listed="listed" v-model="keywords" @input="update"></keyword-search>
        <div class="voclist">
            <div v-for="list, key in vocabularies">{{ types[key].name }}
                <div v-for="th in list" class="sublist">
                    {{ th.title }}
                    <div v-if="keywords.thesaurus[th.key]" class="list-keyword">
                        <div v-for="item in keywords.thesaurus[th.key]" class="keyword" >
                            <span class="close" @click="remove(th.key, item)">&times;</span>
                            {{ item.values.fre }} | {{ item.values.eng }}
                        </div>
                    </div>
                
                </div>
            
            </div>
        </div>
        <div class="voclist">
            <div v-for="list, key in vocabularies" class="">
                {{types[key].name}}
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
        value: {
            type: Object,
            default: () => {return {thesaurus: {}, free: []}}
        },
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
        listed: {
            type: Array,
            default: () => ['local.theme.formaterre_themes']
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
        }
    },
    data () {
        return {
            keywords: {thesaurus: {}, free: []},
            vocabularies: {},
            types: {
                discipline: {
                    name: 'Discipline',
                    definition: 'Mot-clé en relation avec une branche de la connaissance'
                },
                theme: {
                    name: 'Thème',
                    definition: 'Mot clé identifiant un sujet particulier'
                },
                platform: {
                    name: 'Platforme',
                    definition: 'Mot clé identifiant une plateforme'
                },
                place: {
                    name: 'Localisation',
                    definition: 'Mot-clé identifiant un lieu'
                },
                stratum: {
                    name: 'Couche géologique',
                    definition: ''
                },
                temporal: {
                    name: 'Période de temps'
                },
                process: {
                    name: 'Procédé'
                }, 
                product: {
                    name: 'Type de produit'
                },
                project: {
                    name: 'Project'
                }
            }
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
        this.keywords = this.value
        this.getVocabulariesGeonetwork()
    },
    methods: {
        getVocabulariesGeonetwork () {
            fetch(this.geonetwork + '/srv/' + this.locale + '/thesaurus?_content_type=json')
            .then(resp => resp.json())
            .then(json => this.treatmentVocabulariesGeonetwork(json))
        },
        getListed () {

        },
        remove (vocab, item) {
            console.log(vocab)
            console.log(item)
           var thesaurus = Object.assign(this.keywords.thesaurus, {})
           if (thesaurus[vocab]) {
            console.log(thesaurus)
             var find = thesaurus[vocab].findIndex(it => it.uri === item.uri)
             if (find >= 0) {
                thesaurus[vocab].splice(find, 1)
                var keywords = Object.assign(this.keywords, {thesaurus: thesaurus})
                this.keywords = keywords
                this.$forceUpdate()
             }
           }

           console.log(this.keywords.thesaurus[vocab])
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
        },
        update (x, y) {
            console.log(x)
            console.log(y)
        }
    }
}

</script>
<style scoped>
.sublist {
    margin-left: 10px;
}
.voclist {
    display:inline-block;
    width:48%;
    padding:0px 10px;
    vertical-align:top;
}
.keyword {
  display:inline-block;
  position:relative;
  margin: 3px 10px 3px 0;
  padding: 3px  14px 3px 6px;
  border-radius: 4px;
  background: #ddd;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
.list-keywords {
  margin-left:15px;
}
.close {
  position:absolute;
  top:-5px;
  right:1px;
  font-size:1.2rem;
  font-weight:700;
  color: darkred;
  vertical-align:top;
}
.close:hover {
   color: red;
}
</style>