<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '8em', size: 'medium' }" :model="formData" inline>
    <template v-for="{ label, name, options, ...rest } of queries">
      <template v-if="name === 'queryLike'">
        <el-form-item :key="name" :label="`${label} : `" :prop="name">
          <el-input
            v-model="formData[name]"
            :placeholder="`请输入${label}`"
            v-bind="rest"
            size="small"
            maxlength="50"
            clearable
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item :key="name" :label="`${label} : `" :prop="name">
          <template v-if="name === 'status'">
            <el-checkbox v-model="formData[name]" :true-label="options[0].id" :false-label="options[1].id">
              查看绑定历史
            </el-checkbox>
          </template>
          <template v-else-if="options.length > 2">
            <el-select v-model="formData[name]" :placeholder="`请选择${label}`" v-bind="rest" size="small" clearable>
              <el-option v-for="item of options" :key="item.id" :index="item.id" :value="item.id" :label="item.label" />
            </el-select>
          </template>
          <template v-else>
            <el-checkbox-group v-model="formData[name]" v-bind="rest" size="small" :max="1">
              <el-checkbox v-for="opt of options" :label="opt.id" :key="opt.id" :value="opt.id">
                {{ opt.label }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </template>
    </template>
    <el-form-item class="btns">
      <el-button
        type="primary"
        size="small"
        :loading="loading.query"
        :disabled="loading.query"
        @click="onQuery"
        style="margin-left:50px"
        icon="el-icon-search"
        >查询</el-button
      >
      <el-button
        type="primary"
        size="small"
        :loading="loading.add"
        :disabled="loading.add"
        @click="$emit('add')"
        style="margin-left: 80px"
        icon="el-icon-plus"
        >新增</el-button
      >

      <el-button
        type="danger"
        size="small"
        :loading="loading.del"
        :disabled="loading.del || !ids.length"
        @click="$emit('del', ids)"
        icon="el-icon-delete"
        >删除</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { getRegisters } from './api'
import { mdAppVersion, mdAuditStataus, mdStatus } from './utils'

@Component({ name: 'QueryForm', components: {} })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false, add: false, del: false }) })
  loading!: { query?: boolean; add?: boolean; del?: boolean }

  @Prop({ type: Array, default: () => [] }) selected!: { id?: string }[]

  formData: { [x: string]: any } = { status: '1', appVersionNew: ['1'], auditStataus: [] }

  users = []

  get queries(): { name: string; label: string; disabled?: boolean; options?: { id?: string; label?: string }[] }[] {
    const format = (options = {}, key) => {
      const temp = Object.keys(options).map((key) => ({ id: key, label: options[key] }))
      // if (temp.length < 3 && key !== 'status') this.formData = { ...this.formData, [key]: [] }
      return temp
    }

    return [
      { name: 'queryLike', label: '关键字' },
      { name: 'userUserId', label: '人员', options: this.users },
      {
        name: 'auditStataus',
        label: '注册状态',
        options: format(mdAuditStataus, 'auditStataus')
      },
      { name: 'appVersionNew', label: 'app版本', options: format(mdAppVersion, 'appVersionNew') },
      { name: 'status', label: '数据', options: format(mdStatus, 'status') }
    ]
  }

  get ids() {
    return this.selected.map((item) => item.id)
  }

  onQuery() {
    const temp = Object.keys(this.formData).reduce((data, current) => {
      data[current] = Array.isArray(this.formData[current]) ? this.formData[current].join() : this.formData[current]
      return data
    }, {})
    this.$emit('query', temp)
  }

  async getRegisters() {
    const { result = [] } = (await getRegisters()) || {}
    this.users = result.map(({ id, realName: label }) => ({ id, label }))
  }

  mounted() {
    this.onQuery()
    this.getRegisters()
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  .btns {
    flex: 1 1 auto;
  }
}
</style>
