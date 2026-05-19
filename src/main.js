import { defineCustomElement} from 'vue'
import FormaterrePublishComponent from './FormaterrePublish.vue'
import FormaterreKeywordsComponent from './FormaterreKeywords.vue'

const FormaterrePublish = defineCustomElement(FormaterrePublishComponent)
const FormaterreKeywords = defineCustomElement(FormaterreKeywordsComponent)
customElements.define('formaterre-publish', FormaterrePublish)
customElements.define('formaterre-keywords', FormaterreKeywords)
