<template>
    <span>
       
    <div v-for="item in items">
        <template v-if="!item.top">
    
            <input type="checkbox" :checked="isChecked(item)" :disabled="isFixed(item)" @click="toggle(item)"/>
        </template>
        <template v-else>&bull;</template>
        <span class="item-value">{{ item.value }}</span>
        <template v-if="item.items && item.items.length > 0">
            <span class="mini-button expand" @click="toggleExpand($event)">-</span>
            <span class="subtree">
              
              <thesaurus-tree :items="item.items"  :uri="item.url" :selected="selected" @add="add" @remove="remove" @search="search"></thesaurus-tree>
            </span>
        </template>
        <template v-else-if="item.narrowers && item.narrowers.length > 0">
            <span class="mini-button expand" @click="getItems(item)">+</span>
        </template>
    </div>
    </span>
</template>
<script>
const ThesaurusTree = () => import('./ThesaurusTree.vue')
// import Reader from './rdf-reader.js'
export default {
    name: 'ThesaurusTree',
    components: {ThesaurusTree},
    props: {
        uri: {
            type: String,
            default: null
        },
        selected: {
            type:Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        }
    },
    watch: {
        selected () {
            this.$forceUpdate()
        }
    },
    created () {
        
    },
    methods: {
        add (item) {
      
            this.$emit('add', item)
        },
        remove (item) {
            this.$emit('remove', item)
        },
        isChecked (item) {
            var find = this.selected.find(x => x.url === item.url)
            return find
        },
        isFixed (item) {
            var find = this.isChecked(item)
            if (find) {
                return find.fixed
            }
            return false
        },
        search (path, item) {
            if (this.uri) {
                path.unshift(this.uri)
            }
            this.$emit('search', path, item)
          
           
        },
        getItems (item) {
            this.search([item.url], item)
            var self = this
            setTimeout(function () {
                self.$forceUpdate()
            }, 0)
        },
        toggle (item) {
           if (this.isChecked(item)) {
                this.remove( item)
           } else {
                this.add(item)
           }
        },
        toggleExpand (event) {
            if (event.target.classList.contains('expand')) {
                event.target.classList.remove('expand')
                event.target.innerHTML = '+'
            } else {
                event.target.classList.add('expand')
                event.target.innerHTML = '-'
            }
        }
    }
}
</script>
<style scoped>
div {
    margin-left:20px;
}
span.subtree {
    display:none;
}
span.expand + span.subtree {
    display:block;
} 
</style>
