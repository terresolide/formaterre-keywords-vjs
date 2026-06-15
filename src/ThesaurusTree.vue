<template>
    <span>
       
    <div v-for="item in items"><input type="checkbox" :checked="isChecked(item)" @click="toggle(item)"/> 
        <span class="item-value">{{ item.value }}</span>
        <template v-if="item.items && item.items.length > 0">
            <span class="mini-button expand" @click="toggleExpand($event)">-</span>
            <span class="subtree">
              <thesaurus-tree :items="item.items" :thesaurus="thesaurus" :selected="selected" @add="add" @remove="remove"></thesaurus-tree>
            </span>
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
        remove (thesaurus, item) {
            this.$emit('remove', thesaurus, item)
        },
        isChecked (item) {
            var find = this.selected.find(x => x.uri === item.uri)
            console.log(find)
            return find
        },
        toggle (item) {
           if (this.isChecked(item)) {
                console.log('remove')
                this.remove(this.thesaurus, item)
           } else {
                console.log('add')
                this.add(item)
           }
        },
        toggleExpand (event) {
            console.log(event)
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
