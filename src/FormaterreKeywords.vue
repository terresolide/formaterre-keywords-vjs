/**
 * Format attendu pour STAC 
 * en gardant les éléments pour le composant
 * value = {
 *      thesaurus: {
 *         identifiant geonetwork: {
 *              scheme: (STAC) on le trouve dans defaultNamespace de l'objet thesaurus de geonetwork (mais pas tjs cohérent!! gemet et regions)
 *              title: title 
 *              concepts: [{
 *                  id: identifiant, (STAC)
 *                  url: uri, (STAC)
 *                  title: valeur en anglais, (STAC)
 *                  values: {fr: , en} les valeurs en bilingue,
 *                  broader: uri du parent, // uniquement pour naviguer dans le thesaurus
 *                  narrowers: [] tableau des uris des enfants // uniquement pour naviguer dans le thesaurus
 *                  items: les enfants // uniquement pour naviguer dans le thesaurus
 *              }]
 *         }
 *         external.discipline.formater-discipline: {
 *              scheme: 'https://service.poleterresolide.fr/voc/science_field',
 *              title: 'Formaterre | Solid Earth Discipline ontology', // facultatif
 *              concepts: [
 *                  {
 *                      id: 'D040100',
 *                      title: 'Glacial processes',
 *                      url: 'https://service.poleterresolide.fr/voc/science_field/D040100' *
 *                      values: {}
 *                  }
 *              ] 
 *         } 
 * }
 */
<i18n>
{
    "fr": {
        "main_classification": "Principale classification",
        "other_thesauri": "Autres thésaurus",
        "recommended_thesauri": "Thésaurus recommandés",
        "search_in_thesauri": "Recherche dans les thésaurus"
    },
    "en": {
        "main_classification": "Main classification",
        "other_thesauri": "Other thesauri",
        "recommended_thesauri": "Recommended thesauri",
        "search_in_thesauri": "Search in thesauri"
    }
}
</i18n>
<template>
    <span>
    
        <template v-if="listed.length > 0">
            <h3>{{$t('main_classification')}}</h3>
            <div class="voclist">
                <div v-for="th in checkVocabularies">
                        <thesaurus-component :thesaurus="th" :lang="lang" format="checkbox" :selected="value.thesaurus[th.key]" :change="value.thesaurus[th.key] ? value.thesaurus[th.key].length : 0"
                        :geonetwork="geonetwork" @add="addResult" @remove="remove"></thesaurus-component>
                </div>
            </div>
           
        </template>

         <div class="voclist">
            <span v-for="list, thesaurus in value.thesaurus" class="list-keyword">
                <template v-if="vocname[thesaurus]">
                    <div v-for="item, index in list" class="keyword"  :class="{recommanded: vocname[thesaurus].recommanded, checked: vocname[thesaurus].checked, fixed: fixed.indexOf(thesaurus) >= 0 || item.fixed}">
                        <span v-if="fixed.indexOf(thesaurus) < 0 && !item.fixed" class="close" @click="remove(thesaurus, item, index)">&times;</span>
                         {{ item.values[lang]}} | {{ item.values[lang === 'fr' ? 'en' : 'fr']}}<br />
                        ({{ vocname[thesaurus].title}})
                    </div>
                </template>
            </span>
            <div v-for="list, type in value.free"  class="list-keyword">
    
                <div v-for="item, index in list" class="keyword" >
                    <span class="close" @click="remove(null, item, index)">&times;</span>
                    {{ item[lang]}} | {{ item[lang === 'fr' ? 'en' : 'fr']}}<br />
                    ({{ types[type].name[lang] }})
                </div>
        
            </div>
        </div>
         <h3>{{$t('search_in_thesauri')}}</h3>
       
          <div class="warning"><slot></slot></div>
      
          <keyword-search :geonetwork="geonetwork" :lang="lang" :types="types" :listed="searchVocabularies" :keywords="value"
         :excluded="excluded" @add="add" @remove="remove"></keyword-search>
       
    
        <h4>{{$t('recommended_thesauri')}}</h4>
        <div v-for="th in recVocabularies" class="sublist" >
                <thesaurus-component :change="renderComponent[th.key]" :thesaurus="th" :lang="lang" :fixed="fixed.indexOf(th.key) >= 0" :selected="value.thesaurus[th.key]" :geonetwork="geonetwork" 
                @add="addResult" @remove="remove"></thesaurus-component>
        </div>
   
   
        <h4>{{$t('other_thesauri')}}<span @click="showOthers=!showOthers" class="mini-button">{{ showOthers ? '-' : '+' }}</span></h4>

        <div v-show="showOthers" class="voclist">
            <div v-for="list, key in vocabularies" ><label>{{ types[key].name[lang] }}</label>
                <div v-for="th in list" class="sublist" v-if="listed.indexOf(th.key) < 0">
                        <thesaurus-component :thesaurus="th" :lang="lang" :fixed="fixed.indexOf(th.key) >= 0" :change="renderComponent[th.key]" :selected="value.thesaurus[th.key]" :geonetwork="geonetwork" @add="addResult" @remove="remove"></thesaurus-component>
               
                </div>
            
            </div>
        </div>
       
    </span>
</template>
<script>
import KeywordSearch from './KeywordSearch.vue';
import ThesaurusComponent from './ThesaurusComponent.vue'

export default {
    name: 'FormaterreKeywords',
    components: {KeywordSearch, ThesaurusComponent},
    props: {
        value: {
            type: Object,
            default: () => {return {thesaurus: {}, free: {}}}
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
            default: () => ['external.discipline.formater-discipline', 'external.theme.formater-foi-gn', 'external.platform.formater-platform-gn']
        },
        excluded: {
            type: Array,
            default: () => ['external.dataCentre.formater-distributor', 'local.theme.polarisation', 'local.theme.ron']
        }, 
        fixed: {
            type: Array,
            default: () => [ 'external.product.formaterre-product-gn']
        }
    },
    
    data () {
        return {
            key: 0,
            vocabularies: {},
            checkVocabularies: [],
            recVocabularies: [],
            searchVocabularies: [],
            schemes: {},
            vocname: {},
            renderComponent: {},
            showOthers: false,
            types: {
                discipline: {
                    name: { fr: 'Discipline', 'en': 'Discipline'},
                    definition: {
                        fr: 'Mot-clé en relation avec une branche de la connaissance',
                        en: 'Keyword related to a branch of knowledge'
                    }
                },
                theme: {
                    name: {fr: 'Thème', en: 'Theme'},
                    definition: {
                        fr: 'Mot clé identifiant un sujet particulier',
                        en: 'Keyword identifying a specific subject'
                    }
                },
                platform: {
                    name: {fr: 'Plateforme', en: 'Platform'},
                    definition: {
                        fr: 'Mot clé identifiant une plateforme',
                        en: 'Keyword identifying a platform'
                    }
                },
                datacentre: {
                    name: {fr: 'Centre de données', en: "Data centre"}
                },
                place: {
                    name: {fr: 'Localisation', en: 'Place'},
                    definition: {
                        fr: 'Mot-clé identifiant un lieu',
                        en: 'Keyword identifying a location'
                    }
                },
                stratum: {
                    name: { fr: 'Couche géologique', 'en': 'Geological layer'},
                    definition: ''
                },
                temporal: {
                    name: {fr: 'Période de temps', en: 'Temporal period'},
                },
                process: {
                    name: {fr: 'Procédé', en : 'Process'}
                }, 
                product: {
                    name: {fr: 'Type de produit', en: 'Product type'}
                },
                project: {
                    name: {fr: 'Projet', en: 'Project'}
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
    created () {
         this.$i18n.locale = this.lang
    },
    mounted () {
        
        this.getVocabulariesGeonetwork()
        
    },
    methods: {
        add (keyword) {
            if (keyword.url || keyword.uri) {
                this.addResult(keyword)
               
            } else {
                this.addFree(keyword)
            }
            
        },
        addFree (keyword) {
            var free = this.value.free
            if (!free[keyword.type]) {
                free[keyword.type] = []
            }
            free[keyword.type].push(keyword)
            this.$emit('input', {...this.value, free: free})
            this.$forceUpdate()
           
        },
        addResult (keyword) {
            // ajout du scheme du thesaurus
            var thesaurus = Object.assign(this.value.thesaurus, {})
            if (!thesaurus[keyword.vocab]) {
                thesaurus[keyword.vocab] = []
            }
            var kw =  { 
                vocab: keyword.vocab,
                url: keyword.url || keyword.uri, 
                title: keyword.values.en, 
                values: keyword.values, 
                scheme: this.schemes[keyword.vocab]
            }
            thesaurus[keyword.vocab].push(kw)
            this.$emit('input', {...this.value, thesaurus: thesaurus})
            this.update(keyword.vocab)

        },
        
        getVocabulariesGeonetwork () {
            fetch(this.geonetwork + '/srv/' + this.locale + '/thesaurus?_content_type=json')
            .then(resp => resp.json())
            .then(json => {
                this.treatmentVocabulariesGeonetwork(json)
                // this.getListed()
            })
        },
        getListed () {
            var url = this.geonetwork + '/srv/api/registries/vocabularies/' 
            // console.log(reader)
            
            var self = this
            this.listed.forEach(function (name) {
                var type = name.split('.')[1]
                var index = self.vocabularies[type].findIndex(x => x.key === name)
                self.checkVocabularies.push(self.vocabularies[type][index])
            })
            
        },
        isChecked (thesaurus, uri) {

            if (!this.value.thesaurus[thesaurus]) {
                return false
            }
            var find = this.value.thesaurus[thesaurus].find(x => x.url === uri)
            if (!find) {
                return false
            }
            return find
        },
        
        toggle (vocab, item) {
            if (this.isChecked(vocab, item.uri || item.url)) {
                this.remove(vocab, {uri: item.uri || item.url})
            } else {
                item.vocab = vocab
                this.addResult(item)
                this.$forceUpdate()
            }
        },
        remove (vocab, item, index) {
            var thesaurus = Object.assign(this.value.thesaurus, {})
            if (thesaurus[vocab]) {
                var url = item.uri || item.url
                var newvocab = thesaurus[vocab].filter(it => it.url != url)
                thesaurus[vocab] = newvocab
                // var keywords = Object.assign(this.keywords, {thesaurus: thesaurus})
                    this.$emit('input', {...this.value, thesaurus: this.value.thesaurus})
                    this.update(vocab)
                    // console.log(vocab)
                    // var node = this.$el.querySelector('#' + vocab.replaceAll(/\.|\-/g, '') + ' + div > thesaurus-tree')
                    // console.log(node)
                    // node.$forceUpdate()
                
            } else {
                var free = this.value.free
                free[item.type].splice(index, 1)
                if (free[item.type].length === 0) {
                    delete free[item.type]
                }
                this.$emit('input', {...this.value, free: free})
                this.$forceUpdate()
           }

           // console.log(this.keywords.thesaurus[vocab])
        },
        treatmentVocabulariesGeonetwork (json) {
            var vocabularies = {}
            var others = []
            var self = this
            if (json[0]) {
                json[0].forEach(function (th) {
                   
                    if (self.excluded.indexOf(th.key) < 0) {
                        self.schemes[th.key] = th.defaultNamespace
                        if (self.listed.indexOf(th.key) >= 0) {
                            th.checked = true
                            self.vocname[th.key] = th
                            self.checkVocabularies.push(th)
                            return
                        }
                        if (self.recommanded.indexOf(th.key) >= 0) {
                            th.recommanded = true
                            self.vocname[th.key] = th
                            self.recVocabularies.push(th)
                            return
                        }
                        others.push(th)
                        self.vocname[th.key] = th
                        if (!vocabularies[th.dname]) {
                            vocabularies[th.dname] = []
                        }
                       
                        vocabularies[th.dname].push(th)
                    }
                })
            }
            var searchVocabularies = this.recVocabularies.concat(others).map(x => x.key)
            this.searchVocabularies = searchVocabularies.filter(x => this.fixed.indexOf(x) < 0)
            console.log(this.schemes)
            this.vocabularies = vocabularies
        },
        update (vocab) {
            console.log(vocab)
            var self = this
           // setTimeout(function () {
                if (!this.renderComponent.hasOwnProperty(vocab)) {
                    this.renderComponent[vocab] = 1
                } else {

                    this.$set(this.renderComponent,vocab, this.renderComponent[vocab] + 1) 
                }
            console.log(this.renderComponent)
          //  }, 10)
            this.$forceUpdate()
            // this.renderComponent = false
            // this.$nextTick(() => {
            //     this.renderComponent = true
            // })
            
        }
    }
}

</script>
<style>
span.mini-button {
    padding:0 3px;
    border:1px dotted transparent;
    line-height:1;
    cursor:pointer;
}
span.mini-button:hover {
    border-color:darkgrey;
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
.mini-button.close {
    top:1px;
}
.close:hover {
   color: red;
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
.keyword.fixed {
    box-shadow:none;
    border: 1px solid grey;
    pointer-events: none;
}
.keyword.recommanded {
    background: #e2c6c6;
}
.keyword.checked {
    background: #8b0000;
    color:white;
}
.list-keywords {
  margin-left:15px;
}

</style>
<style scoped>
label {
    font-weight:700;
    display:block;
    margin: 10px 0;
}
h3 {
    margin-bottom:0;
}
.warning {
  padding:10px;
  border:1px solid darkgrey ;
  border-radius:3px;
  background: #f8f8f8;
  max-width:900px;
  margin: 10px 0;
  font-style:italic;
}
.sublist {
    position:relative;
    margin-left: 10px;
}
.voclist {
    display:inline-block;
    width:45%;
    padding:0px 10px;
    vertical-align:top;
}

/** .thesaurus {
    position:fixed;
    display: none;
    max-width: 900px;
    background: white;
    padding: 0px 10px 30px 10px;
    top: 50%;
    left: 50%;
transform: translate(-50%, -50%);
    z-index:1;
    -webkit-box-shadow: 0 0 3px rgba(0,0,0,.5);
  box-shadow: 0 0 3px rgba(0,0,0,.5);
}
h4.expand + div.thesaurus {
    display: block;
}
.thesaurus > div {
    padding-right:15px;
    max-height:calc(100vh - 160px);
   overflow-y:scroll; 
}*/
</style>