<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '7em', size: 'small' }" :model="formData" inline>
    <el-form-item label="关键字:">
      <el-input
        v-model="formData.queryLike"
        placeholder="支持事件类型、名称、地址"
        size="small"
        maxlength="50"
        clearable
      />
    </el-form-item>

    <el-form-item label="事件类别:">
      <el-checkbox-group v-model="formData.category" size="small">
        <el-checkbox v-for="(value, key) of DICTONARY.event.category" :key="key" :label="key">{{ value }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="状态:">
      <el-checkbox-group v-model="formData.statusMuti" size="small">
        <el-checkbox v-for="(value, key) of DICTONARY.event.status" :key="key" :label="key">{{ value }}</el-checkbox>
      </el-checkbox-group>
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
      <div>
        <el-button
          type="primary"
          size="small"
          :loading="loading.report"
          :disabled="loading.report"
          @click="$emit('report')"
          icon="el-icon-plus"
        >
          上报
        </el-button>
        <el-button
          type="primary"
          size="small"
          :loading="loading.assign"
          :disabled="loading.assign || ids.length !== 1"
          @click="$emit('assign', ids)"
          icon="el-icon-plus"
        >
          派工
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { IEvent } from '../../api'
import { DICTONARY } from '../../utils'

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Object, default: () => ({ query: false, report: false, assign: false }) })
  loading!: { query?: boolean; report?: boolean; assign?: boolean }
  @Prop({ type: Array, default: () => [] }) selected!: IEvent[]

  DICTONARY = DICTONARY

  formData: { queryLike: string; category: string[]; statusMuti: string[] } = {
    queryLike: '',
    category: [],
    statusMuti: []
  }

  onQuery() {
    const { queryLike, category, statusMuti } = this.formData
    this.$emit('query', { queryLike, category: category.join(), statusMuti: statusMuti.join() })
  }

  get ids() {
    return this.selected.map((item) => item.id)
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  >>> .el-form-item.btns {
    flex: 1 1 auto;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &::before,
      &::after {
        display: none;
      }
    }
  }

  >>> .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
}
</style>
