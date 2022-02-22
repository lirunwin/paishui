<template>
  <div class="CRUD-component">
    <el-row style="margin-bottom: 20px">
      <el-col :span="20">
        <!-- <el-button type="primary" size="small" @click="handleBtnClick('query')" v-if="componentKey === 'system'">查询</el-button> -->
        <el-button type="primary" size="small" @click="handleBtnClick('add')"
          >新增</el-button
        >
        <el-button
          type="primary"
          size="small"
          :disabled="selections.length !== 1"
          @click="handleBtnClick('edit')"
          >修改</el-button
        >
        <el-button
          type="primary"
          size="small"
          :disabled="selections.length <= 0"
          @click="handleBtnClick('delete')"
          >删除</el-button
        >
      </el-col>
      <el-col :span="4">
        <span style="line-height: 34px">{{ title }}</span>
      </el-col>
    </el-row>
    <table-item
      :table-data="source"
      :column="columns"
      :tableheight="700"
      :pagination="false"
      :isSelect="false"
      border
      multiple
      stripe
      @handleSelectionChange="handleSelectionChange"
      @rowDblclick="handleDbclick"
    />
    <el-dialog
      :visible.sync="dialogShow"
      :title="currTitle"
      width="650px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="modulesForm"
        :model="form"
        :rules="formRules"
        label-position="right"
        label-width="140px"
      >
        <template v-for="item in forms">
          <el-form-item
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            style="margin-bottom: 20px"
          >
            <el-input v-if="item.type === 'input'" v-model="form[item.prop]" />
            <el-select v-else v-model="form[item.prop]">
              <el-option
                v-for="option in item.options"
                :key="option.id"
                :value="option.id"
                :label="option.label"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <template slot="footer">
        <el-button @click="handleDialogFooterBtnClick('cancel')"
          >取消</el-button
        >
        <el-button type="primary" @click="handleDialogFooterBtnClick('confirm')"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import tableItem from "@/components/Table/index.vue";
import { ElForm } from "element-ui/types/form";
@Component({
  name: "CRUDComponent",
  components: { tableItem },
})
export default class CRUDComponent extends Vue {
  @Prop({ default: [] }) columns: any[];
  @Prop({ default: "表格标题" }) title: string;
  @Prop(Function) query: any;
  @Prop(Function) add: any;
  @Prop(Function) edit: any;
  @Prop(Function) delete: any;
  @Prop({ default: "" }) componentKey: string;
  @Prop({ default: {} }) form: any;
  @Prop({ default: [] }) forms: any[];
  @Prop({ default: {} }) formRules: any;
  @Prop({ default: false }) notiMenu: boolean;
  @Prop({ default: "" }) systemId: string;

  currType = 1;
  options = [];
  source = [];
  dialogShow = false;
  selections = [];
  get currTitle() {
    return this.currType === 1 ? "新增" : "编辑";
  }
  @Watch("notiMenu")
  notiMenuChange(val) {
    if (val) {
      this.dealQuery();
    } else {
      this.source = [];
      this.$emit("menus-quer-close", { query: false, id: "" });
    }
  }
  @Watch("dialogShow")
  dialogShowChange(val) {
    if (!val) this.$emit("clear-field", this.componentKey);
  }
  mounted() {
    if (this.componentKey === "system") this.dealQuery();
  }

  handleBtnClick(type) {
    if (type === "query") {
      this.dealQuery();
    } else if (type === "add") {
      this.currType = 1;
      this.dialogShow = true;
    } else if (type === "edit") {
      this.currType = 2;
      this.dialogShow = true;
      this.$emit("set-form", {
        data: this.selections[0],
        type: this.componentKey,
      });
    } else if (type === "delete") {
      this.$confirm("是否要删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dealDelete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  }
  handleSelectionChange(selections) {
    this.selections = selections;
    if (this.componentKey === "system") {
      if (this.selections.length === 1) {
        this.$emit("query-menus", {
          query: true,
          id: this.selections[0].id,
        });
      } else this.$emit("query-menus", { query: false, id: "" });
    }
  }
  // 查询处理
  dealQuery() {
    const param = { size: 10000 };
    const params = { sysId: this.systemId };
    this.query(this.componentKey === "system" ? param : params).then((res) => {
      if (this.componentKey === "system") {
        this.source = res.result.records;
        this.$emit("set-system", this.source);
      } else {
        this.source = res.result;
        const top = this.source.filter((item) => item.parentId === null);
        this.$emit("set-parent", top);
      }
      this.source.forEach((item, index) => {
        item.order = index + 1;
      });
    });
  }
  // 删除处理
  dealDelete() {
    const param = { ids: this.selections.map((item) => item.id).join(",") };
    this.delete(param).then(() => {
      this.dealQuery();
    });
  }
  // 新增处理
  dealAdd() {
    this.add(this.form).then((res) => {
      this.dealQuery();
      this.dialogShow = false;
      this.$emit("clear-field", this.componentKey);
    });
  }
  // 编辑处理
  dealEdit() {
    const params = Object.assign({}, this.form, { id: this.selections[0].id });
    this.edit(params).then((res) => {
      this.dealQuery();
      this.dialogShow = false;
      this.$emit("clear-field", this.componentKey);
    });
  }
  // 弹窗按钮点击
  handleDialogFooterBtnClick(type) {
    if (type === "cancel") {
      this.dialogShow = false;
      this.$emit("clear-field", this.componentKey);
    } else {
      (this.$refs.modulesForm as ElForm).validate((valid) => {
        if (valid) {
          this.currType === 1 ? this.dealAdd() : this.dealEdit();
        }
      });
    }
  }

  //双击查看
  handleDbclick(data) {
    const that = this;
    that.selections = [];
    that.selections.push(data);
    // console.log('双击查看'+JSON.stringify(data))
    that.handleBtnClick("edit");
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table__body-wrapper {
  height: 100%;
}
</style>
