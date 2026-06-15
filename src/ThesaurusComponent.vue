
<template>
<span>
    <template v-if="thesaurus">
        <h4>{{ thesaurus.title }} <button @click="load()">Afficher +</button></h4>
        <div v-if="renderComponent" class="thesaurus">
            <span @click="close()" class="mini-button close">&times;</span>
            <h4>{{ thesaurus.title }}</h4>
            <div>
                <thesaurus-tree  :thesaurus="thesaurus.key" :items="items" :reader="reader" :selected="selected" @add="add" @remove="remove"></thesaurus-tree>
            </div>
        </div>
    </template>
</span> 
</template>
<script>
    import ThesaurusTree from './ThesaurusTree.vue'
    import Reader from './rdf-reader.js'
    export default {
        name: 'ThesaurusComponent',
        components: {
            ThesaurusTree
        },
        props: {
           geonetwork: {
                type: String,
                default: null
            },
            thesaurus: {
                type: Object,
                default: null
            },
            selected: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            selected (newvalue) {
                this.renderComponent = false
                this.$nextTick(() => {
                    this.renderComponent = true
                })
            }
        },
        data () {
            return {
                renderComponent: false,
                reader: null,
                items: []}
        },
        methods: {
            add (item) {
                this.$emit('add', item)
            },
            remove ( item) {
                console.log(this.thesaurus)
                console.log(item)
                this.$emit('remove', item.vocab, item)
            },
            close () {
                this.renderComponent = false
            },
            load() {
        
                
                var url = this.geonetwork + '/srv/api/registries/vocabularies/'
                var self = this
                this.reader = new Reader(url, this.thesaurus.key)
                this.reader.load(url,  this.thesaurus.key)
                .then (items => {
                    this.items = items
                    this.renderComponent = true
                    // node.classList.add('expand')
                    self.$forceUpdate()
                })
            },
        }
    }
</script>
<style scoped>

.thesaurus {
    position:fixed;
    display: block;
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
}

</style>