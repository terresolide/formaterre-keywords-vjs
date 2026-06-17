<template>
    <span>
        <template v-if="listed.length > 0">
            <h2>Principale classification</h2>
            <div>Mots-clés obligatoires</div>
            <div class="voclist">
                <div v-for="th in checkVocabularies">
                        <thesaurus-component :thesaurus="th" format="checkbox" :selected="value.thesaurus[th.key]" :change="value.thesaurus[th.key] ? value.thesaurus[th.key].length : 0"
                        :geonetwork="geonetwork" @add="addResult" @remove="remove"></thesaurus-component>
                </div>
            </div>
           
        </template>
         <div class="voclist">
                <div v-for="list, type in value.free"  class="">
        
                <div class="list-keyword">
                    <div v-for="item, index in list" class="keyword" >
                        <span class="close" @click="remove(null, item, index)">&times;</span>
                        {{ item.fr }} | {{ item.en }}<br />
                        ({{ types[type].name }})
                    </div>
                </div>
            </div>
            </div>
        <div>NOTE</div>
        {{ searchVocabularies }}
          <keyword-search :geonetwork="geonetwork" :types="types" :listed="searchVocabularies" :keywords="value"
         :excluded="excluded" @add="add" @remove="remove"></keyword-search>
       
          
                 <h2>Mots-clés recommandés</h2>
               <div v-for="th in recVocabularies" class="sublist" >
                        <thesaurus-component :change="renderComponent[th.key]" :thesaurus="th" :selected="value.thesaurus[th.key]" :geonetwork="geonetwork" 
                       @add="addResult" @remove="remove"></thesaurus-component>
                </div>
            </div>
        
           
           
            
        </div>
        <h2>Autres thésaurus</h2>
        <div class="voclist">
            <div v-for="list, key in vocabularies" ><label>{{ types[key].name }}</label>
                <div v-for="th in list" class="sublist" v-if="listed.indexOf(th.key) < 0">
            
                        <thesaurus-component :thesaurus="th" :change="renderComponent[th.key]" :selected="value.thesaurus[th.key]" :geonetwork="geonetwork" @add="addResult" @remove="remove"></thesaurus-component>
               
        
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
        }
    },
    
    data () {
        return {
            key: 0,
            vocabularies: {},
            checkVocabularies: [],
            recVocabularies: [],
            otherVocabularies: [],
            renderComponent: {},
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
                    name: 'Plateforme',
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
        
        this.getVocabulariesGeonetwork()
        
    },
    methods: {
        add (keyword) {
            if (keyword.uri) {
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
            console.log(keyword)
            var thesaurus = Object.assign(this.value.thesaurus, {})
            if (!thesaurus[keyword.vocab]) {
                thesaurus[keyword.vocab] = []
            }
            thesaurus[keyword.vocab].push(keyword)
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
            var find = this.value.thesaurus[thesaurus].find(x => x.uri === uri)
            if (!find) {
                return false
            }
            return find
        },
        
        toggle (vocab, item) {
            if (this.isChecked(vocab, item.uri)) {
                this.remove(vocab, {uri: item.uri})
            } else {
                item.vocab = vocab
                this.addResult(item)
                this.$forceUpdate()
            }
        },
        remove (vocab, item, index) {
            console.log(vocab)
            console.log(item)
            var thesaurus = Object.assign(this.value.thesaurus, {})
            if (thesaurus[vocab]) {
                var newvocab = thesaurus[vocab].filter(it => it.uri != item.uri)
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
                        if (self.listed.indexOf(th.key) >= 0) {
                            self.checkVocabularies.push(th)
                            return
                        }
                        if (self.recommanded.indexOf(th.key) >= 0) {
                            self.recVocabularies.push(th)
                            return
                        }
                        others.push(th)
                        if (!vocabularies[th.dname]) {
                            vocabularies[th.dname] = []
                        }
                       
                        vocabularies[th.dname].push(th)
                    }
                })
            }
            this.searchVocabularies = this.recVocabularies.concat(others).map(x => x.key)
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
/*.check-listed {
    display:inline-block;
    min-width:250px;
    width:250px;
    padding:1px 5px;
    vertical-align:top;
    cursor: pointer;
}
.check-listed:hover {
    background: rgba(100,0,0, 0.1);
}
.check-listed input[type="checkbox"] {
    display:inline-block;
    vertical-align:top;
}
.check-listed span {
    display:inline-block;
    vertical-align:top;
    width:calc(100% - 30px);
}*/
.sublist {
    position:relative;
    margin-left: 10px;
}
.voclist {
    display:inline-block;
    width:48%;
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