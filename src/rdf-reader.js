/**
 * Rdfs Reader
 */

const Reader = class Reader {
    name =  null
    root = null
    nsResolver = null
    /**
     * Load an rdf file and extract keywords in a tree
     * 2 strategies that depend on the number of keywords
     * - content > 200 000 characters, load only the first level
     * - content < 200 000 characters, load entire thesaurus
     * @param {string} url 
     * @param {string} name identifiant geonetwork/interne du thesaurus
     * @returns 
     */
    constructor (url, name) {
      this.name = name
    }

    load (url) {
      return new Promise((success, reject) => {
        fetch(url + this.name, {headers: {accept: 'text/xml'}})
        .then(resp => resp.text())
        .then(str => {
           console.log(str.length)
           var thesauri = this.extract(str)
           if (success) {
            success(thesauri)

           }
        })
      })
      
     
    }
    getItems (uris) {
      var items = []
      var self = this
      uris.forEach(function (uri) {
        var item = self.getItem(self.root, uri, self.nsResolver)
        if (item) {
          items.push(item)
        }
      })
      
      return items
      // get Items

    }
    getItem (root, uri, nsResolver) {
      var concepts = root.evaluate("//skos:Concept[@rdf:about='" + uri + "']", root, nsResolver, XPathResult.ANY_TYPE, null);
      var concept = null
      var item = {
        vocab: this.name,
        uri: uri,
        values: {},
        narrowers: 0
      }
          
      while (concept = concepts.iterateNext()) {
        
        var labels = root.evaluate('./skos:prefLabel[@xml:lang="fr" or @xml:lang="en"]', concept, nsResolver, XPathResult.ANY_TYPE, null)
        var label = labels.iterateNext()
        while(label) {
          var lang = label.getAttribute('xml:lang')
          item.values[lang === 'fr' ? 'fre' : 'eng'] = label.innerHTML
          label = labels.iterateNext()
        }
        item.value = item.values.fre || item.values.eng
        item.narrowers = this.getNarrowers(root, concept, nsResolver)
        if (item.narrowers.length === 0) {
          item.narrowers = this.getNarrowersByUri(root, uri, nsResolver)
        }
      }
      
      return item
    }
    getNarrowers (root, concept, nsResolver) {
      var narrowers = root.evaluate('./skos:narrower/@rdf:resource', concept, nsResolver, XPathResult.ANY_TYPE, null)
      var narrower = null
      var uris = []
      while (narrower = narrowers.iterateNext()) {
        uris.push(narrower.nodeValue)
      }
      return uris
    }
    getNarrowersByUri (root, uri, nsResolver) {
      var narrowers = root.evaluate('//skos:Concept[skos:broader/@rdf:resource="' + uri + '"]/@rdf:about', root, nsResolver, XPathResult.ANY_TYPE, null)
      var narrower = null
      var uris = []
      while (narrower = narrowers.iterateNext()) {
        uris.push(narrower.nodeValue)
      }
      return uris
    }
    extractTopOfConcept () {
      var root = this.root
      var nsResolver = this.nsResolver
       var result = root.evaluate('//skos:hasTopConcept/@rdf:resource', root, nsResolver, XPathResult.ANY_TYPE, null)
      console.log(result)
      if (result.resultType !== XPathResult.UNORDERED_NODE_ITERATOR_TYPE && result.resultType !== XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
        return null
      } else {
        var node = null
        var uris = []
        while (node = result.iterateNext()) {
          // get skos Concept by uri
          var item = this.getItem(root, node.value, nsResolver)
          if (this.name === 'external.place.regions') {
            item.top = true
          }
          uris.push(item)
        }
        return uris
      }
    }
    extractConceptDescription (root, ns, nsResolver) {
      var  result = root.evaluate('//rdf:Description[skos:prefLabel and not(rdf:type/@rdf:resource="http://www.w3.org/2004/02/skos/core#Collection")]|//skos:Concept[skos:prefLabel]',root, nsResolver, XPathResult.ANY_TYPE, null)
      var node = result.iterateNext()
      var kws = []
      while (node) {
        var uri = node.getAttributeNS('about', ns.rdf)
        var uri = node.getAttribute('rdf:about')
        var x = null
        var labels= root.evaluate('./skos:prefLabel', node, nsResolver, XPathResult.ANY_TYPE, null)
        var values = {}

        while(x = labels.iterateNext()) {
          var lang = x.getAttribute('xml:lang').substring(0, 2)
          if (lang === 'fr' || lang === 'en') {
            values[lang] = x.innerHTML
          }
        }
        var item = {
          vocab: this.name,
          uri: uri,
          value: values.fr || values.en,
          values: values
        }
        // find 
        var findIndex = kws.findIndex(x => x.uri === uri)
        if (findIndex >= 0) {
          kws[findIndex].values = Object.assign(kws[findIndex].values, values)
          kws[findIndex].value = kws[findIndex].values.fr
        } else {
          kws.push(item)
          findIndex = kws.length - 1
        }
        // search broader
        var broader = root.evaluate('//rdf:Description[@rdf:about="' + uri + '"]/skos:broader/@rdf:resource|//skos:Concept[@rdf:about="' + uri + '"]/skos:broader/@rdf:resource', root, nsResolver, XPathResult.STRING_TYPE, null)
        // console.log(broader)
        if (broader.resultType !== XPathResult.STRING_TYPE) {
           node = result.iterateNext()
          continue
        } else {
          console.log('broader = ', broader)
        }
        if (broader.stringValue) {
          kws[findIndex].broader = broader.stringValue
        }
        node = result.iterateNext()
      }
      console.log(kws)
      return kws
    }
    extract (str) {
      var parser = new DOMParser()
      this.root = parser.parseFromString(str, 'text/xml')
      var attributes = this.root.children[0].attributes
      var ns = {rdf: null, skos: null}
      for (var i in attributes) {
        if (typeof attributes[i] != 'object') {
          continue
        }
        var link = attributes[i].value
        var name = attributes[i].localName
        if (link.startsWith('http://www.w3.org/1999/02/22-rdf-syntax-ns')) {
          ns.rdf = link
        } else if (link.startsWith('http://www.w3.org/2004/02/skos/core')) {
          ns.skos =  link
        } else {
          ns[name] = link
        }

      } 
      this.nsResolver = function (prefix) {
        switch(prefix) {
          case 'rdf':
            return ns.rdf || 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
          case 'skos':
            return ns.skos || 'http://www.w3.org/2004/02/skos/core#'
          case 'xml':
            return 'http://www.w3.org/XML/1998/namespace'
          default:
            return ns[prefix]
        }
      }
      // search hasTopConcept
      var kws = this.extractTopOfConcept()
      
      if (!kws || kws.length === 0) {
        kws = this.extractConceptDescription(this.root, ns, this.nsResolver)
      }
      
        // order hierachical keywords
        

        // console.log(labelEN)
      
       kws.sort((a, b) => {
        if (a.value > b.value) {
          return 1
        }
        return -1
      })
      var keywords = this.orderItems(kws, null)
  
      return keywords
    }
    orderItems(kws, kw) {
      console.log(kws.length)
      if (!kw) {
        var keywords = kws.filter(x => !x.broader || typeof x.broader === undefined) 
         
      } else {
        var keywords = kws.filter(x => x.broader === kw.uri)
      }
      for(var i=0; i < keywords.length; i ++) {
         keywords[i].items = this.orderItems(kws, keywords[i])
      }
      console.log(keywords)
      return keywords

    }
}
module.exports = Reader