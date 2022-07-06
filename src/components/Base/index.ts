import Vue from 'vue'
import Page from './Page/index.vue'
import Table from './Table/index.vue'
import Dialog from './Dialog/index.vue'
import Title from './Title/index.vue'

const namePrefix = 'Tf'

Vue.component(`${namePrefix}${Page.name}`, Page)
Vue.component(`${namePrefix}${Table.name}`, Table)
Vue.component(`${namePrefix}${Dialog.name}`, Dialog)
Vue.component(`${namePrefix}${Title.name}`, Title)
