<template>
  <span> 
    <div>Note explicative</div>
    Rechercher <input v-model="query" type="text"  @focus="show=true" @keyup="search" />
    <div style="position:relative;">
      <div v-if="show && query.length > 2" class="tt-menu" 
        style="position: absolute; top: 0; left: 50px; z-index: 100; /*! display: none; */">
        <div v-if="results.length > 0" class="tt-dataset tt-dataset-concept">
          <div v-for="item, index in results" @click="addResult(index)" 
          class="autocomplete-label tt-suggestion tt-selectable"       :class="{disabled: item.choose}">
            <div>
            <span><span v-html="highlight(item.prefLabel || item.value)"></span><span> ({{item.lang}})</span></span>
          </div>
          <div class="vocab">{{toTitle(item.vocab || item.thesaurusKey)}}</div>
        </div>
      </div>
      <div v-else class="tt-dataset tt-dataset-concept" style="padding:5px 10px;">
          <div>Aucun mot-clé correspondant trouvé dans les thésaurus!<br>
          Vous pouvez entrer un mot clé libre</div>
          <ul style="list-style-type: none;">
            <li><span class="lang-label">FR</span> <input type="text" v-model="kw.fr" /></li>
            <li><span class="lang-label">EN</span> <input type="text" v-model="kw.en" /></li>
            <li><span class="lang-label">Type</span>
                <select v-model="kw.type">
                  <option v-for="tp, key in types" :value="key" :title="tp.definition">{{ tp.name }}</option>
                </select>
            </li>
          </ul>
          <div style="text-align:right;margin:0 10px 15px 0;">
            <button @click="addFree">Ajouter</button>
          </div>
      </div>
    </div>
</div>
</span>
</template>
<script>
export default {
  name: 'KeywordSearch',
  props: {
    keywords: {
      type: Object,
      default: () => {return {thesaurus: {}, free: {}}}
    },
    locale: {
      type: String,
      default: 'fre'
    },
    geonetwork: {
      type: String,
      default: null
    },
    skosmos: {
      type: String,
      default: null
    },
    listed: {
      type: Array,
      default: () => []
    },
    excluded: {
      type: Array,
      default: () => []
    },
    types: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      query: '',
      show: false,
      results: [],
      notFind: false,
      kw:{
        fr: '',
        en: '',
        type: 'theme'
      }
    }
  },
  methods: {
    addFree () {
       // this.value.free.push(this.kw)
       var kw = Object.assign(this.kw, {})
       this.kw = null
       this.$emit('add', kw)
       this.reset()

    },
    addResult (index) {
     
     // this.value = value
      this.$emit('add', this.results[index])
      this.reset()
    },
    highlight (name) {
      var regex = new RegExp(this.query, 'i'); 
      return name.replace(regex, function (x) {
          
          return '<strong>' + x + '</strong>'
      })
    },
    toTitle (value) {
      // if (this.translate[value]) {
      //   return this.translate[value]
      // }
      switch(value) {
        case 'ron':
           return 'Orbite relative'
        default:
           return value.charAt(0).toUpperCase() + value.slice(1);
      }
    },
    reset () {
      this.query = ''
      this.results = []
      this.show = false
    },
    search () {
        /** EXEMPLE DE REQUETE AVEC THESAURUS IMPOSÉ 
         * curl -X GET "https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/search?
         * q=deformation&lang=eng&rows=1000&thesaurus=local.theme.formaterre_themes&thesaurus=local.theme.formaterre_cdos&
         * type=CONTAINS&sort=DESC" -H  "accept: application/json"
         * */
        this.results = []
        if (!this.query) {
          return null
        }
        var query = this.query.trim()
        if (query.length < 3) {
          return
        }
       
        var promise1 = this.requestGeonetwork(query, 'fre')
        var promise2 = this.requestGeonetwork(query, 'eng')
        Promise.all([promise1, promise2])
        .then(([result1, result2]) => {
          var results = result1.concat(result2)
          console.log(results)
          if (results.length === 0) {
            this.notFind = query
            this.kw = {
              fr: query,
              en: query,
              type: 'theme'
            }
          } else {
            this.notFind = ''
          }
          this.results = results
        })
        
    },
    requestGeonetwork (query, lang) {
      return new Promise((resolve, reject) => {
        var thesauri = this.listed.map(x => 'thesaurus=' + x)
        var url = this.geonetwork + '/srv/api/registries/vocabularies/search?q=' + query 
        url += '&' + thesauri.join('&')
        url += '&lang=' + lang + '&rows=1000&type=CONTAINS&sort=ASC&pLang=fre&pLang=eng'
        var promise2 = fetch(url, {headers: {accept: 'application/json'}})
        .then(resp => resp.json())
        .then(json => {
          var results = this.treatmentResponseGeonetwork(json, lang)
          resolve(results)
        })
      })
    },
    translate (item) {
      /**
       * curl -X GET "https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/keyword
       * ?id=https%3A%2F%2Fservice.poleterresolide.fr%2Fvoc%2Fscience_field%2FD080000&thesaurus=external.discipline.formater-discipline&lang=eng" 
       * -H  "accept: application/json"
       */
    },
    treatmentResponseGeonetwork (json, lang) {
      this.show = true
      var results = []
      if (json) {
       
        var self = this
        json.forEach(function (item) {
          if (self.excluded.indexOf(item.vocab || item.thesaurusKey) >= 0) {
            return
          }
          if (self.keywords.thesaurus[item.vocab || item.thesaurusKey]) {
            var find = self.keywords.thesaurus[item.vocab || item.thesaurusKey].findIndex(voc => voc.uri === item.uri)
            if (find >=0) {
              return
            }
          }
          results.push(item) 
          
        })
        
        // transformation en skosmos format
        results.forEach(function (item, index) {
          item.vocab = item.thesaurusKey
          item.prefLabel = item.value
          item.lang = lang
          results[index] = item
        })
        // sort with listed thesaurus
        var listed = this.listed
        results.sort((a, b) => {
          if (listed.indexOf(a.vocab) > listed.indexOf(b.vocab)) {
            return 1
          } else {
            return -1
          }
        })
      }
     
      return results
    }
  }
}
</script>
<style scoped>
h1, h2, h3 {
  color: darkred;
}
.fa-close {
  color: darkred;
  vertical-align:top;
}
input[type="search"] {
  border:none;
  outline:none;
  font-size:1rem;
  color: #111;
  font-family:Arial, Helvetica, sans-serif;
  background: transparent;
}
span.search {
  border:1px solid lightgray;
  padding:3px;
}
span.search + input[type="search"]:focus,
span.search:focus-within{
  border-color:#b1b1b1;
  background: #faf9f9;
}
span.search .fa-close {
  color: #333;
  padding:2px;
  font-size:0.8rem;
  font-weight:600;
  border: 1px dotted transparent;
}
span.search .fa-close:hover {
  border-color:#333;
}
.tt-menu {
  width: 100%;
  width: 350px;
  min-width: 300px;
  background-color: #f8f8f8;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  max-height: 302px;
  overflow-y: auto;
  right: 0 !important;
  top: 4px !important;
  left: 117px !important;
}
.autocomplete-label > div:first-child > span:first-child, 
.autocomplete-label > div:first-child > span.replaced + span {
  color: darkred;
  margin: 0;
}
.tt-selectable {
  border-bottom: 1px solid rgba(0,0,0,0.2);
  cursor: pointer;
  line-height: 20px;
  padding: 2px 8px;
  overflow:hidden;
}
.tt-selectable.disabled {
  pointer-events: none;
  opacity:0.8;
}
.tt-selectable:hover {
  background-color: #fbfbfb;
}
label {
  min-width: 200px;
  font-weight: 700;
  color: #333;
  display: block;
  margin: 10px 0 0 10px;
}

</style>