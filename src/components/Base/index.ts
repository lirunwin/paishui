import Vue from 'vue'
import Page from './Page/index.vue'
import Table from './Table/index.vue'
const namePrefix = 'Tf'

Vue.component(`${namePrefix}${Page.name}`, Page)
Vue.component(`${namePrefix}${Table.name}`, Table)
