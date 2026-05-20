/**
 * VUE2
 */

import Vue from 'vue';
// Vue.config.productionTip = false
//import CompositionApi from '@vue/composition-api'
//
//Vue.use(CompositionApi)

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement)



import FormaterrePublish from './FormaterrePublish.vue'
import FormaterreKeywords from './FormaterreKeywords.vue'


Vue.customElement('formaterre-publish', FormaterrePublish)
Vue.customElement('formaterre-keywords', FormaterreKeywords)

/** VUE3 */
// import { defineCustomElement} from 'vue'
// import FormaterrePublishComponent from './FormaterrePublish.vue'
// import FormaterreKeywordsComponent from './FormaterreKeywords.vue'

// const FormaterrePublish = defineCustomElement(FormaterrePublishComponent)
// const FormaterreKeywords = defineCustomElement(FormaterreKeywordsComponent)
// customElements.define('formaterre-publish', FormaterrePublish)
// customElements.define('formaterre-keywords', FormaterreKeywords)
