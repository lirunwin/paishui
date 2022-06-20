<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '7em', size: 'small' }" :model="formData" inline>
    <el-form-item label="关键字:">
      <el-input v-model="formData.queryLike" placeholder="汛情位置地址模糊查询" size="small" maxlength="50" clearable />
    </el-form-item>
    <el-form-item label="是否为警情:">
      <el-checkbox-group v-model="formData.police" size="small" :max="1">
        <el-checkbox :label="1">是</el-checkbox>
        <el-checkbox :label="0">否</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="部门:" prop="department">
      <el-select
        v-model="department"
        size="small"
        clearable
        filterable
        placeholder="请选择部门"
        @change="onDepartmentChange"
      >
        <el-option v-for="dept of departments" :key="dept.id" :value="String(dept.id)" :label="dept.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="上报人:" prop="findUser">
      <el-select v-model="formData.createUserid" size="small" clearable filterable placeholder="请选择上报人">
        <el-option v-for="user of users" :key="user.id" :value="String(user.id)" :label="user.realName" />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="状态:">
      <el-checkbox-group v-model="formData.statusMulti" size="small" min="1">
        <template v-for="(value, key) of DICTONARY.event.status">
          <template v-if="!['0', '1'].includes(key)">
            <el-checkbox :key="key" :label="key">{{ value }}</el-checkbox>
          </template>
        </template>
      </el-checkbox-group>
    </el-form-item> -->
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
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { IDepartment, IFlood } from '../../api'
import { DICTONARY } from '../../utils'

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false }) })
  loading!: { query?: boolean }
  @Prop({ type: Array, default: () => [] }) departments!: IDepartment[]

  DICTONARY = DICTONARY

  department: string = ''

  get users() {
    const { users } = this.departments.find((item) => String(item.id) === this.department) || {}
    return users
  }

  formData: Partial<
    Omit<IFlood, 'police'> & {
      police: string[]
      queryLike: string
      //  statusMulti: string[]
    }
  > = {
    queryLike: '',
    police: [],
    // statusMulti: ['2', '3', '4', '5'],
    createUserid: ''
  }

  onDepartmentChange() {
    this.formData.createUserid = undefined
  }

  onQuery() {
    const {
      queryLike,
      police,
      // statusMulti,
      ...rest
    } = this.formData

    this.$emit('query', {
      ...rest,
      queryLike,
      police: police.join()
      // statusMulti: statusMulti.join()
    })
  }

  mounted() {
    this.onQuery()
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-wrap: wrap;
}
</style>
