<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'small' }" :model="formData" inline>
    <el-form-item label="关键字:">
      <el-input v-model="formData.queryLike" placeholder="支持车牌号、使用人" size="small" maxlength="50" clearable />
    </el-form-item>
    <el-form-item label="部门" prop="department">
      <el-select
        v-model="formData.department"
        size="small"
        clearable
        filterable
        placeholder="请选择部门"
        @change="onDepartmentChange"
      >
        <el-option v-for="dept of departments" :key="dept.id" :value="String(dept.id)" :label="dept.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="负责人" prop="chargePerson">
      <el-select v-model="formData.chargePerson" size="small" clearable filterable placeholder="请选择负责人">
        <el-option v-for="user of users" :key="user.id" :value="String(user.id)" :label="user.realName" />
      </el-select>
    </el-form-item>
    <el-form-item label="日期" prop="chargePerson">
      <el-date-picker
        v-model="formData.date"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="~"
        style="width: 250px"
        format="yyyy-MM-dd"
        size="small"
        arrow-control
        clearable
        value-format="yyyy-MM-dd"
      />
    </el-form-item>

    <el-form-item class="btns">
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        @click="onQuery"
        style="margin-left: 3em"
        icon="el-icon-search"
      >
        查询
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import moment from 'moment'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IDepartment, IVehicleArchiveQuery } from '../../api'
import { DICTONARY } from '../../utils'

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false }) })
  loading!: { query?: boolean }
  @Prop({ type: Array, default: () => [] }) departments!: IDepartment[]
  @Prop({ type: Array, default: () => [] }) defaultQuery!: string[]

  DICTONARY = DICTONARY

  get users() {
    const { users } = this.departments.find((item) => String(item.id) === this.formData.department) || {}
    return users
  }

  formData: Partial<IVehicleArchiveQuery> & { queryLike?: string; date?: Date[] } = {
    queryLike: '',
    department: '',
    chargePerson: '',
    date: [moment().add(-7, 'day').startOf('day').toDate(), moment().startOf('day').toDate()]
  }

  onDepartmentChange() {
    this.formData.chargePerson = undefined
  }

  onQuery() {
    const { date, ...rest } = this.formData
    const [beginTime, endTime] = date || []
    const format = 'YYYY-MM-DD HH:mm:ss'
    this.$emit('query', {
      ...rest,
      beginTime: beginTime ? this.$moment(beginTime).startOf('day').format(format) : '',
      endTime: endTime ? this.$moment(endTime).startOf('day').format(format) : ''
    })
  }

  mounted() {
    this.onQuery()
  }
}
</script>
