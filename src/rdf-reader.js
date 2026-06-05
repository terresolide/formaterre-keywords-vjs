/**
 * Rdfs Reader
 */

const reader = {

    load (url) {
      return new Promise((success, reject) => {
        fetch(url, {headers: {accept: 'text/xml'}})
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
          default:
            return ns[prefix]
        }
      }
      var  result = root.evaluate('//rdf:Description[skos:prefLabel]',root, nsResolver, XPathResult.ANY_TYPE, null)
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
          console.log(x)
          console.log(x.getAttribute('xml:lang'))
          var lang = x.getAttribute('xml:lang')
          switch(x.getAttribute('xml:lang')) {
            case 'fr':
              lang = 'fre'
              break
            case 'en':
              lang = 'eng'
              break
          }
          values[lang] = x.innerHTML
          console.log(x.innerHTML)
          x = labels.iterateNext()
        }
        var item = {
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
          console.log(broader.stringValue.toUpperCase())
        }
        // console.log(labelEN)
      }
      kws.sort((a, b) => {
        if (a.value > b.value) {
          return 1
        }
        return -1
      })
      return kws
    }
}
module.exports = reader