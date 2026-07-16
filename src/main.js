import { defineCustomElement} from 'vue'


// import FormaterrePublishComponent from './FormaterrePublish.vue'
// import FormaterreKeywordsComponent from './FormaterreKeywords.vue'
import FormaterreOrganisationComponent from './FormaterreOrganization.vue'

// const FormaterrePublish = defineCustomElement(FormaterrePublishComponent)
// const FormaterreKeywords = defineCustomElement(FormaterreKeywordsComponent)
const FormaterreOrganisation = defineCustomElement(FormaterreOrganisationComponent)
// customElements.define('formaterre-publish', FormaterrePublish)
// customElements.define('formaterre-keywords', FormaterreKeywords)
customElements.define('formaterre-organisation', FormaterreOrganisation)
