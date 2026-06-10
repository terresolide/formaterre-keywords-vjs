/**
 * Rdfs Reader
 */

const reader = {
    name: null,
    load (url, name) {
      this.name = name
      return new Promise((success, reject) => {
        fetch(url + name, {headers: {accept: 'text/xml'}})
        .then(resp => resp.text())
        .then(str => {
           var thesauri = this.extract(str)
           if (success) {
            success(thesauri)

           }
        })
      })
      
     
    },
    extract (str) {
      var parser = new DOMParser()
      var root = parser.parseFromString(str, 'text/xml')
      var attributes = root.children[0].attributes
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
      var nsResolver = function (prefix) {
        switch(prefix) {
          case 'rdf':
            return ns.rdf
          case 'skos':
            return ns.skos
          case 'xml':
            return 'http://www.w3.org/XML/1998/namespace'
          default:
            return ns[prefix]
        }
      }
      // search hasTopConcept
      var result = root.evaluate('//skos:hasTopConcept/@rdf:resource', root, nsResolver, XPathResult.ANY_TYPE, null)
      console.log(result)
      if (result.resultType !== XPathResult.UNORDERED_NODE_ITERATOR_TYPE && result.resultType !== XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
        return null
      } else {
        var node = null
        var uris = []
        while (node = result.iterateNext()) {
          console.log(node.value)
          // get skos Concept
          console.log('//skos:Concept[rdf:about="' + node.value + '"]/skos:prefLabel')
          var concept = root.evaluate("//skos:Concept[@rdf:about='" + node.value + "']/skos:prefLabel[@xml:lang='fr']", root, nsResolver, XPathResult.ANY_TYPE, null);
          console.log(concept)
          var label = concept.iterateNext()
          while (label) {
            console.log(label.innerHTML)
            label = concept.iterateNext()
          }
          
          // concept.iterateNext()
          // console.log(concept)
        }
      }
      return
      var  result = root.evaluate('//rdf:Description[skos:prefLabel and rdf:type/@rdf:resource="http://www.w3.org/2004/02/skos/core#Concept"]|//skos:Concept[skos:prefLabel]',root, nsResolver, XPathResult.ANY_TYPE, null)
      var node = null
      var kws = []
      while (node = result.iterateNext()) {
        var uri = node.getAttributeNS('about', ns.rdf)
        var uri = node.getAttribute('rdf:about')
        var x = null
        var labels= root.evaluate('./skos:prefLabel', node, nsResolver, XPathResult.ANY_TYPE, null)
        var values = {}
        var x = labels.iterateNext()
        while(x) {
          var lang = x.getAttribute('xml:lang')
          switch(x.getAttribute('xml:lang')) {
            case 'fr':
              lang = 'fre'
              break
            case 'en':
              lang = 'eng'
              break
            default:
              continue
          }
          values[lang] = x.innerHTML
          console.log(x.innerHTML)
          x = labels.iterateNext()
        }
        var item = {
          vocab: this.name,
          uri: uri,
          value: values.fre,
          values: values
        }
        // find 
        var findIndex = kws.findIndex(x => x.uri === uri)
        if (findIndex >= 0) {
          kws[findIndex].values = Object.assign(kws[findIndex].values, values)
          kws[findIndex].value = kws[findIndex].values.fre
        } else {
          kws.push(item)
          findIndex = kws.length - 1
        }
        // search broader
        var broader = root.evaluate('//rdf:Description[@rdf:about="' + uri + '"]/skos:broader/@rdf:resource', root, nsResolver, XPathResult.STRING_TYPE, null)
        // console.log(broader)
        if (broader.resultType !== XPathResult.STRING_TYPE) {
          continue
        } else {
          console.log('broader = ', broader)
        }
        if (broader.stringValue) {
          kws[findIndex].broader = broader.stringValue
        }
        // order hierachical keywords
        

        // console.log(labelEN)
      }
       kws.sort((a, b) => {
        if (a.value > b.value) {
          return 1
        }
        return -1
      })
      var keywords = this.orderItems(kws, null)
  
      return keywords
    },
    orderItems(kws, kw) {
      
      if (!kw) {
        var keywords = kws.filter(x => !x.broader || typeof x.broader === undefined) 
         
      } else {
        var keywords = kws.filter(x => x.broader === kw.uri)
      }
      for(var i=0; i < keywords.length; i ++) {
         keywords[i].items = this.orderItems(kws, keywords[i])
      }
      return keywords

    }
}
module.exports = reader