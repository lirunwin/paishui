<template>
  <div>
    <div class="app-container">
      <float-panels title="浮动窗口" />
      <!-- 用户权限管理 -->
      <div class="handerUser">
        <div class="data_box">
          <input-item
            can-clear
            type="text"
            placeholder="请输入用户名"
            title="用户名："
            nominate="realName"
            custom-style="display: inline-block"
            :value="realName"
            :max-length="50"
            :disabled="false"
            :required="false"
            @changeValue="onInput"
          />
          <input-item
            can-clear
            type="text"
            placeholder="请输入登录名"
            title="登录名："
            nominate="username"
            custom-style="display: inline-block"
            :value="username"
            :max-length="50"
            :disabled="false"
            :required="false"
            @changeValue="onInput"
          />
          <select-item
            can-clear
            placeholder="请选择部门"
            title="部门："
            nominate="departmentId"
            custom-style="display: inline-block"
            :value="departmentId"
            :disabled="false"
            :required="false"
            :filterable="true"
            :options="departments"
            @changeSelectValue="changeSelectValue"
          />
          <select-item
            can-clear
            placeholder="请选择启用状态"
            title="启用状态："
            nominate="enableFlag"
            custom-style="display: inline-block"
            :value="enableFlag"
            :disabled="false"
            :required="false"
            :filterable="true"
            :options="statusOptions"
            @changeSelectValue="changeSelectValue"
          />
          <select-item
            can-clear
            placeholder="请选择锁定状态"
            title="锁定状态："
            nominate="lockFlag"
            custom-style="display: inline-block"
            :value="lockFlag"
            :disabled="false"
            :required="false"
            :filterable="true"
            :options="lockOptions"
            @changeSelectValue="changeSelectValue"
          />
          <select-item
            can-clear
            placeholder="请选择审核状态"
            title="审核状态："
            nominate="auditStatus"
            custom-style="display: inline-block"
            :value="auditStatus"
            :disabled="false"
            :required="false"
            :filterable="true"
            :options="auditOptions"
            @changeSelectValue="changeSelectValue"
          />
        </div>
        <div class="btn_box">
          <el-button type="primary" size="small" @click="onSubmitS"
            >查询用户</el-button
          >
          <!-- <el-button type="primary" size="small" @click="onSubmitAll">全部用户</el-button> -->
          <el-button type="primary" size="small" @click="handleAdded"
            >新增用户</el-button
          >
          <!-- <el-button type="primary" size="small" @click="handleAddedCopy">复制用户</el-button> -->
          <el-button
            :disabled="disabledEdit"
            type="primary"
            size="small"
            @click="handleEdit"
            >修改用户</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="multipleSelection.length === 0"
            @click="handleManyUser"
            >删除用户</el-button
          >
          <!-- <el-button type="primary" size="small" :disabled="disabledEdit" @click="enableSettings">启用设置</el-button> -->
          <!-- <el-button type="primary" size="small">批量导入</el-button> -->
          <!-- <el-button type="primary" size="small" :disabled="disabledEdit" :style="disabledEdit ? 'background:#bec5c9;border-color: #bec5c9;' : ''" @click="roleBinding">角色绑定</el-button> -->
          <!-- <el-button type="primary" size="small" @click="userUnlock">用户解锁</el-button> -->
          <!-- <el-button type="primary" size="small" :disabled="multipleSelection.length !== 1" @click="roleBinding">角色绑定</el-button> -->
          <el-button
            type="primary"
            size="small"
            :disabled="multipleSelection.length === 0"
            @click="roleBinding"
            >角色绑定</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="canAudit"
            @click="audit"
            >审核</el-button
          >
          <!-- <el-button type="primary" size="small" @click="batchImport">批量导入</el-button> -->
          <el-button type="primary" size="small" @click="templateDownload"
            >模版下载</el-button
          >
          <el-upload
            action="fakeaction"
            style="margin: 0 10px; display: inline-block"
            :http-request="batchImport"
            :show-file-list="false"
            :file-list="files"
            accept=".xls, .xlsx"
          >
            <el-button size="small" type="primary">批量导入</el-button>
          </el-upload>
          <el-button type="primary" size="small" @click="exportDownload"
            >导出</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="multipleSelection.length === 0"
            @click="resetPwd"
            >重置密码</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="existEnableFlag"
            @click="handleAuthOperation('enable')"
            >启用</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="existDisableFlag"
            @click="handleAuthOperation('disable')"
            >禁用</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="existLockFlag"
            @click="handleAuthOperation('unlock')"
            >解锁</el-button
          >
          <!-- <el-button type="primary" size="small" :disabled="multipleSelection.length === 0" @click="handleAuthOperation('lock')">锁定</el-button> -->
          <input
            id="file"
            ref="files"
            type="file"
            style="display: none"
            @change="upload"
          />
        </div>
      </div>
      <table-item
        :table-data="list"
        :column="column"
        :for-id="true"
        :pagination="true"
        :pagesize="pagination.size"
        :currentpage="pagination.current"
        :tableheight="620"
        :border="true"
        :multiple="true"
        :total="total"
        :fixed="true"
        :isdelete="false"
        :is-select="false"
        :stripe="true"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @handleSelectionChange="handleSelectionChange"
        @handleEdit="handleEdit"
        @rowDblclick="handleDbclick"
      />
    </div>
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <div class="dialog_style">
        <MergeUser
          v-if="dialogVisible"
          ref="ruleForm"
          :data="editData"
          :company="departments"
          :options-role="role.optionsRole"
          @remind="remind"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      title="删除用户"
      :visible.sync="dialogDelete"
      width="500px"
    >
      <span>确认是否删除用户？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog v-dialogDrag title="启用设置" :visible.sync="enable.enableSetting" width="500px">
      <input-item type="text" placeholder title="用户名：" custom-style="display: inline-block; width: 80%; line-height: 32px;" :value="enable.enableName" :max-length="50" :disabled="true" :required="false" />
      <select-item placeholder="请选择" title="是否启用：" nominate="enableFlag" custom-style="display: inline-block; margin-top: 20px;width: 80%;line-height: 32px;" :value="enableFlag" :disabled="false" :required="false" :filterable="true" :options="enable.optionsEnable" @changeSelectValue="changeSelectValue" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="enable.enableSetting = false">取 消</el-button>
        <el-button type="primary" @click="confirmEnable">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog
      v-dialogDrag
      title="角色权限绑定"
      :visible.sync="role.roleBind"
      width="500px"
      height="300px"
    >
      <div style="height: 200px; width: 100%">
        <input-item
          type="text"
          placeholder
          title="用户名："
          custom-style="display: inline-block; width: 80%; line-height: 32px;"
          :value="role.roleName"
          :max-length="50"
          :disabled="true"
          :required="false"
        />
        <!-- <select-item
        placeholder="请选择"
        title="角色："
        nominate="roleId"
        custom-style="display: inline-block; margin-top: 20px;width: 80%;line-height: 32px;"
        :value="roleId"
        :disabled="false"
        :required="false"
        :filterable="true"
        :options="role.optionsRole"
        @changeSelectValue="changeSelectValue"
      />-->
        <SelectMultiple
          placeholder="请选择"
          title="角色复制："
          nominate="copyRole"
          custom-style="display: inline-block; width: 80%; line-height: 32px;"
          :value="copyRole"
          :disabled="false"
          :required="false"
          :filterable="true"
          :collapsetags="true"
          :options="copyUsers"
          :clearable="true"
          @changeSelectMultipleValue="copyRoleChange"
        />

        <SelectMultiple
          placeholder="请选择"
          title="角色："
          nominate="roleId"
          custom-style="display: inline-block; width: 80%; line-height: 32px;"
          :value="roleId"
          :disabled="false"
          :required="false"
          :filterable="true"
          :options="role.optionsRole"
          @changeSelectMultipleValue="changeSelectMultipleValue"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="role.roleBind = false">取 消</el-button>
        <el-button type="primary" @click="confirmRoleBind">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="multipleSelection.length != 0"
      v-dialogDrag
      title="审核用户"
      :visible.sync="auditVisible"
      width="500px"
    >
      <div class="user-base-info">
        <span class="audit-title">申请信息：</span>
        <div>
          <span>登录名：</span><span>{{ multipleSelection[0].username }}</span>
        </div>
        <div>
          <span>用户名：</span><span>{{ multipleSelection[0].realName }}</span>
        </div>
        <div>
          <span>联系电话：</span><span>{{ multipleSelection[0].phone }}</span>
        </div>
        <div>
          <span>邮箱：</span><span>{{ multipleSelection[0].email }}</span>
        </div>
        <div>
          <span>部门：</span><span>{{ multipleSelection[0].deptName }}</span>
        </div>
        <div>
          <span>个性签名图片：</span
          ><img :src="multipleSelection[0].esignature" />
        </div>
        <div>
          <span>用户头像：</span><img :src="multipleSelection[0].avatar" />
        </div>
        <div>
          <span>工作岗位：</span><span>{{ multipleSelection[0].job }}</span>
        </div>
        <div>
          <span>工作职责：</span><span>{{ multipleSelection[0].note }}</span>
        </div>
        <div>
          <span>申请说明：</span
          ><span>{{ multipleSelection[0].applystate }}</span>
        </div>
        <div>
          <span>申请人：</span
          ><span>{{ multipleSelection[0].createUserName }}</span>
        </div>
        <div>
          <span>申请时间：</span
          ><span>{{ multipleSelection[0].createTime }}</span>
        </div>
      </div>
      <div class="audit-info">
        <span class="audit-title">审核信息：</span>
        <el-form
          ref="auditForm"
          :model="auditInfo"
          :rules="auditRules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item style="margin-bottom: 15px" label="角色复制">
            <el-select
              v-model="copyRole"
              multiple
              style="width: 300px"
              placeholder="请选择需要复制的用户角色"
              filterable
              clearable
              collapse-tags
              @change="setCopyRoleId"
            >
              <el-option
                v-for="item in copyUsers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="角色：" prop="roles" style="margin-bottom: 20px">
            <el-select v-model="auditInfo.roles" style="width: 300px" multiple>
              <template v-for="item in role.optionsRole">
                <el-option :key="item.id" :value="item.id" :label="item.name" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="审核状态："
            prop="auditStatus"
            style="margin-bottom: 20px"
          >
            <el-select
              v-model="auditInfo.auditStatus"
              style="width: 300px"
              placeholder="请选择审核状态"
            >
              <el-option key="0" value="0" label="不同意" />
              <el-option key="2" value="2" label="同意" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核说明：">
            <el-input
              v-model="auditInfo.auditState"
              style="width: 300px"
              type="textarea"
              placeholder="请输入审核说明"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAuditBtnClick('cancel')">取 消</el-button>
        <el-button type="primary" @click="handleAuditBtnClick('confirm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog v-if="detailInfo" title="用户详情" :visible.sync="detailDialog" append-to-body>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="baseInfo">
          <el-row>
            <el-col :span="12" class="base-info">
              <el-row>
                <span class="title">申请人：</span
                ><span>{{ detailInfo.createUserName }}</span>
              </el-row>
              <el-row>
                <span class="title">申请时间：</span
                ><span>{{ detailInfo.createTime }}</span>
              </el-row>
              <el-row>
                <span class="title">登录名：</span
                ><span>{{ detailInfo.username }}</span>
              </el-row>
              <el-row>
                <span class="title">用户名：</span
                ><span>{{ detailInfo.realName }}</span>
              </el-row>
              <el-row>
                <span class="title">联系电话：</span
                ><span>{{ detailInfo.phone }}</span>
              </el-row>
              <el-row>
                <span class="title">邮箱：</span
                ><span>{{ detailInfo.email }}</span>
              </el-row>
              <el-row>
                <span class="title">部门：</span
                ><span>{{ detailInfo.deptName }}</span>
              </el-row>
              <el-row>
                <span class="title">工作岗位：</span
                ><span>{{ detailInfo.job }}</span>
              </el-row>
            </el-col>
            <el-col :span="12" class="base-info">
              <el-row>
                <span class="title">个性签名图片：</span>
                <img
                  v-if="detailInfo.esignature !== null"
                  :src="detailInfo.esignature"
                />
              </el-row>
              <el-row>
                <span class="title">用户头像：</span>
                <img
                  v-if="detailInfo.avatar !== null"
                  :src="detailInfo.avatar"
                />
              </el-row>
              <el-row>
                <span class="title">工作职责：</span
                ><span v-html="detailInfo.jobduties" />
              </el-row>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="分配权限" name="authGruop">
          <el-row class="custom-row">
            <span class="title">角色：</span
            ><span>{{ detailInfo.roleName }}</span>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="申请信息" name="applyInfo">
          <el-row class="custom-row">
            <span class="title">申请人：</span
            ><span>{{ detailInfo.createUserName }}</span>
          </el-row>
          <el-row class="custom-row">
            <span class="title">申请时间：</span
            ><span>{{ detailInfo.createTime }}</span>
          </el-row>
          <el-row class="custom-row">
            <span class="title">申请说明：</span
            ><span>{{ detailInfo.applystate }}</span>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="审核信息" name="auditInfo">
          <el-row class="custom-row">
            <span class="title">审核人：</span
            ><span>{{ detailInfo.auditorname }}</span>
          </el-row>
          <el-row class="custom-row">
            <span class="title">审核时间：</span
            ><span>{{ detailInfo.audittime }}</span>
          </el-row>
          <el-row class="custom-row">
            <span class="title">审核说明：</span
            ><span>{{ detailInfo.auditstate }}</span>
          </el-row>
          <el-row class="custom-row">
            <span class="title">审核意见：</span
            ><span>{{ detailInfo.auditstatus | formatteAuditStatus }}</span>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import TableItem from "@/components/Table/index.vue";
import InputItem from "@/components/FormItem/Input/index.vue";
import SelectItem from "@/components/FormItem/Select/index.vue";
import SelectMultiple from "@/components/FormItem/SelectMultiple/index.vue";
import MergeUser from "./mergeUser/index.vue";
import { FloatPanels } from "@/layout/components/index";
import {
  getUserList,
  deleteUser,
  roleBind,
  setUserUnlock,
  getCompany,
  getRoleList,
  editUser,
  batchUser,
  initialPwd,
  downloadTemplate,
  auditUser,
  setUserLock,
  setUserDisable,
  setUserEnable,
  getFiles,
} from "@/api/base";
import { getToken, setSessionStorage } from "@/utils/auth";
import { imageByName } from "@/api/ftp";
import { ElForm } from "element-ui/types/form";
@Component({
  name: "UserRights",
  components: {
    TableItem,
    InputItem,
    SelectItem,
    MergeUser,
    SelectMultiple,
    FloatPanels,
  },
  filters: {
    formatteAuditStatus(val) {
      switch (val) {
        case "0":
          return "不同意";

        case "1":
          return "未审核";

        case "2":
          return "同意";
      }
    },
  }
})
export default class UserRights extends Vue {
  list = [];
  total = 0;
  column = [
    // {
    //   label: '序号',
    //   width: 60,
    //   prop: 'order',
    //   // sortable: true
    //   formatter: (row, column, cellValue, index) => {
    //     return index + 1
    //   }
    // },
    {
      label: "登录名",
      width: 120,
      prop: "username",
      sortable: true,
    },
    {
      label: "用户名",
      width: 120,
      prop: "realName",
      sortable: true,
    },
    {
      label: "部门",
      // width: 120,
      prop: "deptName",
      sortable: true,
    },
    {
      label: "联系电话",
      width: 120,
      prop: "phone",
      sortable: true,
    },
    {
      label: "邮箱",
      // width: 120,
      prop: "email",
      sortable: true,
    },
    {
      label: "角色",
      width: 120,
      prop: "roleName",
      sortable: true,
    },
    {
      label: "工作岗位",
      width: 120,
      prop: "job",
      sortable: true,
    },
    {
      label: "创建类型",
      // width: 120,
      prop: "createType",
      sortable: true,
      formatter: (row, column, cellValue, index) => {
        if (cellValue === "0") return "自建";
        if (cellValue === "1") return "申请";
      },
    },
    {
      label: "启用状态",
      width: 120,
      prop: "enableFlag",
      formatter: (row, column, cellValue, index) => {
        if (cellValue === "0") return "禁用";
        if (cellValue === "1") return "启用";
      },
      sortable: true,
    },
    {
      label: "锁定状态",
      width: 120,
      prop: "lockFlag",
      sortable: true,
      formatter: (row, column, cellValue, index) => {
        if (cellValue === "0") return "锁定";
        if (cellValue === "1") return "正常";
      },
    },
    {
      label: "审核意见",
      width: 120,
      prop: "auditstatus",
      sortable: true,
      formatter: (row, column, cellValue, index) => {
        if (cellValue === "0") return "不同意";
        if (cellValue === "1") return "未审核";
        if (cellValue === "2") return "同意";
      },
    },
    {
      label: "申请/创建时间",
      width: 140,
      prop: "createTime",
      sortable: true,
    },
    {
      label: "申请/创建人",
      width: 120,
      prop: "createUserName",
      sortable: true,
    }
  ];
  // 获取前等待
  listLoading = true;
  multipleSelection = [];
  formInline = {
    user: "",
    region: "",
  };
  realName = ""; // 用户名
  username = ""; // 登录名
  departmentId = ""; // 部门
  enableFlag = ""; // 启用状态
  lockFlag = ""; // 锁定状态
  auditStatus = ""; // 审核状态
  auditOptions = [
    {
      id: "",
      name: "全部",
    },
    {
      id: "0",
      name: "不同意",
    },
    {
      id: "2",
      name: "同意",
    },
  ]; // 审核状态列表
  auditVisible = false;
  company = "";
  departments = []; // 部门列表
  statusOptions = [
    {
      id: "",
      name: "全部",
    },
    {
      id: "0",
      name: "禁用",
    },
    {
      id: "1",
      name: "启动",
    },
  ]; // 启用状态选项
  lockOptions = [
    {
      id: "",
      name: "全部",
    },
    {
      id: "0",
      name: "锁定",
    },
    {
      id: "1",
      name: "正常",
    },
  ]; // 锁定状态选项
  dialogVisible = false;
  dialogTitle = "新增用户";
  editData = null;
  dialogDelete = false; // 删除
  enable = {
    enableSetting: false, // 启用设置
    optionsEnable: [
      {
        id: "1",
        name: "启用",
      },
      {
        id: "0",
        name: "不启用",
      },
    ],
    enableName: "",
  };
  role = {
    roleBind: false,
    roleName: "",
    optionsRole: [],
  };
  auditRules = {
    roles: [{ required: true, validator: this.roleValidate, trigger: "blur" }],
    auditStatus: [
      { required: true, message: "审核状态不能为空", trigger: "change" },
    ],
  };
  // 审核信息
  auditInfo = {
    roles: undefined,
    auditStatus: undefined,
    auditState: undefined,
  };
  files = []; // 上传文件
  roleId = []; // 角色编号集合
  userId = []; // 用户编号集合
  pagination = { current: 1, size: 20 }; // 分页参数信息
  disabledEdit = true;
  detailDialog = false;
  detailInfo = null
  activeNames = ["baseInfo"];

  copyRole = []; // 选择的复制角色用户
  copyUsers = []; // 用户列表
  roleValidate(rule, value, callback) {
    console.log(value);
    if (value.length === 0) {
      return callback(new Error("角色不能为空!"));
    } else {
      callback();
    }
  }
  get canAudit() {
    console.log("账号：" + this.$store.state.user.username);
    return !(
      this.multipleSelection.length === 1 &&
      this.multipleSelection[0].auditstatus === "1" &&
      this.multipleSelection[0].auditor === this.$store.state.user.username
    );
  }
  get existEnableFlag() {
    const selAry = this.multipleSelection;
    const newAry = selAry.filter((item) => {
      return item.enableFlag === "0";
    });
    const enableFlag = selAry.length > 0 && newAry.length === selAry.length;
    return !enableFlag;
  }
  get existDisableFlag() {
    const selAry = this.multipleSelection;
    const newAry = selAry.filter((item) => {
      return item.enableFlag === "1";
    });
    const enableFlag = selAry.length > 0 && newAry.length === selAry.length;
    return !enableFlag;
  }
  get existLockFlag() {
    const selAry = this.multipleSelection;
    const newAry = selAry.filter((item) => {
      return item.lockFlag === "0";
    });
    const enableFlag = selAry.length > 0 && newAry.length === selAry.length;
    return !enableFlag;
  }
  @Watch("multipleSelection")
  multipleSelectionChange(value) {
    if (value.length !== 1 || value.some((item) => item.auditstatus === "1"))
      this.disabledEdit = true;
    else this.disabledEdit = false;
  }
  @Watch("$store.state.user.applied")
  userAppliChange(val) {
    if (val) {
      this.fetchData(this.pagination);
    }
  }
  @Watch("auditVisible")
  auditVisibleChange(val) {
    if (!val) {
      Object.keys(this.auditInfo).forEach((item) => {
        this.auditInfo[item] = undefined;
      });
    }
  }
  created() {
    this.fetchData(this.pagination);
    this.getCompanyInfo();
    this.getRoleInfo();
    // const data = param2Obj('https://fz.bajiaohua.cn/?crowdfundId=9')
    this.getCopyDeptUserList();
    
  }
  // 权限操作
  handleAuthOperation(type) {
    // const ids = {ids: this.multipleSelection.map(item => item.id).join(',')};
    const ids = new FormData();
    ids.append("ids", this.multipleSelection.map((item) => item.id).join(","));
    const success = (resp, message) => {
      if (resp.code === 1) {
        this.$message({
          message: message,
          type: "success",
        });
      }
      this.onSubmit();
      // this.fetchData(this.pagination)
    };
    switch (type) {
      case "enable":
        setUserEnable(ids).then((res) => success(res, "启用成功！"));
        break;
      case "disable":
        setUserDisable(ids).then((res) => success(res, "禁用成功！"));
        break;
      case "unlock":
        setUserUnlock(ids).then((res) => success(res, "解锁成功！"));
        break;
      case "lock":
        setUserLock(ids).then((res) => success(res, "锁定成功！"));
        break;
    }
  }
  // 双击table行
  handleDbclick(data) {
    console.log("双击查看");
    this.detailDialog = true;
    this.detailInfo = data;
    this.detailInfo.jobduties = "";
    // 对职责进行处理
    if (!this.strIsNull(this.detailInfo.note)) {
      this.detailInfo.jobduties = this.detailInfo.note
        .replace(/\r\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/\s/g, " ");
    }

    const arr = [this.detailInfo.avatar, this.detailInfo.esignature];
    arr.forEach((item, index) => {
      if (item === null) return;
      imageByName(item).then((res) => {
        if (res.status === 200) {
          index === 1
            ? (this.detailInfo.esignature = res.config.url)
            : (this.detailInfo.avatar = res.config.url);
        }
      });
    });
  }
  // 审核用户
  audit() {
    this.auditVisible = true;
    this.copyRole = [];
    const arr = [
      this.multipleSelection[0].avatar,
      this.multipleSelection[0].esignature,
    ];
    arr.forEach((item, index) => {
      imageByName(item).then((res) => {
        if (res.status === 200) {
          index === 1
            ? (this.multipleSelection[0].esignature = res.config.url)
            : (this.multipleSelection[0].avatar = res.config.url);
        }
      });
    });

    // 审核页面，默认同意
    this.auditInfo.auditStatus = "2";
  }
  // 批量导入
  batchImport(params) {
    const { type } = params.file;
    console.log(type);
    const types = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!types.includes(type)) {
      this.$message({
        type: "error",
        message: "只能上传xlsx,xls文件",
      });
      return;
    }
    const form = new FormData();
    form.append("templateServiceType", "userService");
    form.append("file", params.file);
    batchUser(form).then((res) => {
      if (res.code !== -1) {
        this.$message({
          message: "导入成功!",
          type: "success",
        });
        // this.fetchData(this.pagination)
        this.onSubmit();
      } else {
        console.log("导入失败", res.message);
        this.$message({
          message: "导入失败!",
          type: "error",
        });
      }
    });
  }
  // 重置密码
  resetPwd() {
    const data = {
      users: this.multipleSelection.map((item) => {
        item.firstlog = 1;
        return item;
      }),
    };
    initialPwd(data).then(() => {
      this.$message({
        type: "success",
        message: "重置密码成功",
      });
    });
  }
  // 获取列表数据
  fetchData(data) {
    const that = this;
    this.listLoading = true;
    getUserList(data).then((res) => {
      this.list = res.result.records;
      this.list.forEach((item, index) => {
        item.phone = that.strIsNull(item.phone) ? "" : item.phone; // 联系电话
        item.email = that.strIsNull(item.email) ? "" : item.email; // 邮箱
        item.job = that.strIsNull(item.job) ? "" : item.job; // 工作岗位
        item.note = that.strIsNull(item.note) ? "" : item.note; // 工作职责
      });
      // for(let i in)
      this.total = res.result.total;
      this.listLoading = false;
      if (this.$store.state.user.applied)
        this.$store.dispatch("user/finnishApply", false);
    });
  }

  // 获取单位信息
  getCompanyInfo() {
    getCompany({ size: 10000 }).then((res) => {
      res.result.records.forEach((item) => {
        item.id = item.id + "";
      });
      this.departments = res.result.records;
    });
  }

  // 获取角色信息
  getRoleInfo() {
    getRoleList({ size: 10000 }).then((res) => {
      this.role.optionsRole = res.result.records;
      for (let i = 0; i < this.role.optionsRole.length; i++) {
        this.role.optionsRole[i].id = this.role.optionsRole[i].id.toString();
        this.role.optionsRole[i].name = this.role.optionsRole[i].roleName;
      }
    });
  }
  // 审核弹窗按钮点击事件
  handleAuditBtnClick(type) {
    if (type === "cancel") {
      this.auditVisible = false;
      (this.$refs.auditForm as ElForm).clearValidate();
    } else {
      (this.$refs.auditForm as ElForm).validate((valid) => {
        if (valid) {
          const copyData = JSON.parse(JSON.stringify(this.auditInfo));
          copyData.roles = copyData.roles.join(",");
          const data = Object.assign(copyData, this.multipleSelection[0]);
          data.auditstate = data.auditState;
          data.auditstatus = data.auditStatus;
          auditUser(data).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "用户审核成功",
              });
              this.onSubmit();
              // this.fetchData(this.pagination)
              this.auditVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  }

  handleCurrentChange(currentPage) {
    // console.log('2222111')
    this.pagination.current = currentPage;
    this.onSubmit();
  }

  handleSizeChange(pagesize) {
    // console.log('aaaa')
    this.pagination.size = pagesize;
    this.onSubmit();
  }

  handleSelectionChange(value) {
    this.multipleSelection = value;
    // console.log('1111', value)
  }

  // handleClick(value) {
  //   console.log('查看', value)
  // },

  handleEdit() {
    console.log("编辑", this.multipleSelection);
    this.dialogTitle = "修改用户";
    this.dialogVisible = true;
    this.editData = this.multipleSelection[0];
    // this.$refs.ruleForm.handleEdit(value)
  }

  // handleDelete(value) {
  //   console.log('删除', value)
  // },
  onSubmitS() {
    this.pagination.current = 1;
    this.onSubmit();
  }
  onSubmit() {
    let data = {
      userLevel: "1", // 默认只展示为0的用户
      realName: this.realName,
      username: this.username,
      departmentId: this.departmentId,
      enableFlag: this.enableFlag,
      lockFlag: this.lockFlag,
      auditstatus: this.auditStatus,
    };
    data = Object.assign({}, data, this.pagination);
    this.fetchData(data);
    console.log("submit!");
  }

  onSubmitAll() {
    this.fetchData(this.pagination);
  }

  handleAdded() {
    console.log("新增");
    // this.$refs.ruleForm.resetFields()
    this.dialogTitle = "新增用户";
    this.dialogVisible = true;
    this.editData = {};
  }
  /**
   * @description 赋值新增 用户角色
   */
  handleAddedCopy() {
    console.log("新增");
    // this.$refs.ruleForm.resetFields()
    this.dialogTitle = "复制新增用户";
    this.dialogVisible = true;
    const roleIdAry = [];
    console.log("角色绑定", JSON.stringify(this.multipleSelection));
    const currentUsers = this.multipleSelection;
    if (currentUsers.length !== 0) {
      // 获取选中的角色数据
      currentUsers.forEach((userinfo) => {
        const roleIdList = userinfo.roleIdList;
        if (!this.strIsNull(roleIdList)) {
          const roleIds = roleIdList.split(",");
          // 角色ID
          roleIds.forEach((roleId) => {
            roleIdAry.push(roleId);
          });
        }
      });
    }
    const roleIds = Array.from(new Set(roleIdAry));

    this.editData = {
      roles: roleIds,
    };
  }

  handleManyUser() {
    console.log("批量删除");
    if (this.multipleSelection.length > 0) {
      this.dialogDelete = true;
    } else {
      this.$message.error("请选择要删除的用户");
    }
  }
  // 确认删除
  confirmDelete() {
    console.log("2222", this.multipleSelection);
    const ids = [];
    for (let i = 0; i < this.multipleSelection.length; i++) {
      ids.push(this.multipleSelection[i].id);
    }
    const data = {
      ids: ids.toString(),
    };
    const _this = this;
    deleteUser(data).then((res) => {
      if (res.code !== -1) {
        _this.$message.success("删除成功");
        _this.onSubmit();
      }
    });
    this.dialogDelete = false;
  }

  enableSettings() {
    console.log("启用设置", this.multipleSelection);
    if (this.multipleSelection.length === 1) {
      this.enable.enableSetting = true;
      this.enable.enableName = this.multipleSelection[0].realName;
      this.enableFlag = this.multipleSelection[0].enableFlag;
    } else {
      this.$message.error("请选择要启用的一个用户");
    }
  }

  // 启用设置
  confirmEnable() {
    const data = new FormData();
    data.append("id", this.multipleSelection[0].id);
    data.append("enableFlag", this.enableFlag);

    editUser(data).then((res) => {
      this.$message.success("设置成功");
      // this.fetchData(this.pagination)
      this.onSubmit();
    });
    this.enable.enableSetting = false;
  }

  roleBinding() {
    console.log("角色绑定", JSON.stringify(this.multipleSelection));
    const currentUsers = this.multipleSelection;

    if (currentUsers.length !== 0) {
      this.role.roleBind = true;
      const roleIdAry = [];
      const userIdAry = [];
      const userNameAry = [];
      // 获取选中的角色数据
      currentUsers.forEach((userinfo) => {
        const roleIdList = userinfo.roleIdList;
        if (!this.strIsNull(roleIdList)) {
          const roleIds = roleIdList.split(",");
          // 角色ID
          roleIds.forEach((roleId) => {
            roleIdAry.push(roleId);
          });
        }
        // 用户编号
        userIdAry.push(userinfo.id);
        // 用户名称
        userNameAry.push(userinfo.realName);
      });

      this.role.roleName = userNameAry.toString();
      this.userId = userIdAry;
      this.roleId = Array.from(new Set(roleIdAry));
      this.copyRole = [];
      console.log(
        "角色：" +
          JSON.stringify(this.roleId) +
          " 用户：" +
          JSON.stringify(this.userId) +
          "  " +
          this.role.roleName
      );

      // this.role.roleName = this.multipleSelection[0].realName
      // console.log('32232', this.multipleSelection)
      // this.roleId = this.multipleSelection[0].roleIdList
      //   ? this.multipleSelection[0].roleIdList.split(',')
      //   : []
    } else {
      this.$message.error("请选择至少一个用户");
    }

    // if (this.multipleSelection.length !== 1) {
    //   this.role.roleBind = true
    //   this.role.roleName = this.multipleSelection[0].realName
    //   console.log('32232', this.multipleSelection)
    //   this.roleId = this.multipleSelection[0].roleIdList
    //     ? this.multipleSelection[0].roleIdList.split(',')
    //     : []
    // } else {
    //   this.$message.error('请选择要绑定的一个用户')
    // }
  }

  // 角色绑定
  confirmRoleBind() {
    const data = {
      userids: this.userId.toString(),
      roles: this.roleId.toString(),
    };

    console.log("参数：", JSON.stringify(data));
    // return false

    roleBind(data).then((res) => {
      if (res.code !== -1) {
        this.$message.success("绑定成功");
        // this.fetchData(this.pagination)
        this.onSubmit();
      }
    });
    this.role.roleBind = false;
  }

  userUnlock() {
    console.log("用户解锁");
    if (this.multipleSelection.length !== 1) {
      this.$message.error("请选择要绑定的一个用户");
    }
    const data = {
      id: this.multipleSelection[0].id,
    };
    setUserUnlock(data).then((res) => {
      this.$message.success(res.message);
    });
  }

  templateDownload() {
    const params = {
      templateFlag: 0,
      templateServiceType: "userService",
    };
    downloadTemplate(params).then((res) => {
      console.log(res);
      const blob = URL.createObjectURL(
        new Blob([res as any], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const a = document.createElement("a");
      a.href = blob;
      a.download = "批量账号创建模板.xlsx";
      a.click();
    });
  }

  /**
   * 导出
   */
  exportDownload() {
    const params = {
      templateFlag: 1,
      templateServiceType: "userService",
    };

    const data = {
      userLevel: "1", // 默认只展示为0的用户
      realName: this.realName,
      username: this.username,
      departmentId: this.departmentId,
      enableFlag: this.enableFlag,
      lockFlag: this.lockFlag,
      auditstatus: this.auditStatus,
    };
    if (this.strIsNull(data.realName)) {
      delete data.realName;
    }
    if (this.strIsNull(data.username)) {
      delete data.username;
    }
    if (this.strIsNull(data.departmentId)) {
      delete data.departmentId;
    }
    if (this.strIsNull(data.enableFlag)) {
      delete data.enableFlag;
    }
    if (this.strIsNull(data.lockFlag)) {
      delete data.lockFlag;
    }
    if (this.strIsNull(data.auditstatus)) {
      delete data.auditstatus;
    }
    const dto = {
      dto: JSON.stringify(data),
    };
    const exportParams = Object.assign({}, dto, params);
    console.log(exportParams);
    downloadTemplate(exportParams).then((res) => {
      console.log(res);
      const blob = URL.createObjectURL(
        new Blob([res as any], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const a = document.createElement("a");
      a.href = blob;
      a.download = "用户信息.xlsx";
      a.click();
    });
  }

  /**
   * 输入框组件数据绑定方法事件
   * @param {*} key
   * @param {*} event
   */
  onInput(key, event) {
    this[key] = event;
  }

  /**
   * 下拉选择组件数据绑定方法事件
   */
  changeSelectValue(key, event) {
    this[key] = key === "departmentId" ? event.toString() : event;
    // console.log('2222', this.roleId)
  }

  changeSelectMultipleValue(key, event) {
    console.log("222222", key, event);
    this[key] = event;
  }
  // 提交
  submitForm() {
    (this.$refs.ruleForm as MergeUser).submitForm();
    // if (this.msg === '成功') {
    //   this.dialogVisible = false
    //   this.fetchData()
    // }
  }

  // 取消重置表单
  resetForm() {
    (this.$refs.ruleForm as MergeUser).resetFields();
    this.dialogVisible = false;
  }

  // 提示
  remind(data) {
    this.dialogVisible = false;
    // this.fetchData(this.pagination)
    this.onSubmit();
  }
  // 批量上传
  upload() {
    const fileObj = (document.getElementById("file") as any).files; // js 获取文件对象
    const form = new FormData();
    form.append("file", fileObj[0]);
  }

  /**
   * @description 获取用户信息
   */
  getCopyDeptUserList() {
    const data = {
      userLevel: 1,
      current: 1,
      size: 10000000,
    };
    this.copyUsers = [];
    getUserList(data).then((res) => {
      // console.log(res);
      res.result.records.forEach((item) => {
        this.copyUsers.push({
          id: item.id,
          name: item.realName,
          roleIdList: item.roleIdList,
        });
      });
    });
  }

  /**
   * @description 获取选中用户的角色，并赋值
   */
  copyRoleChange(key, event) {
    console.log("copyRoleChange：", key, event);
    this[key] = event;
    this.roleId = this.comCopyRole(event);
  }

  /**
   * @description 获取选中用户的角色，并赋值
   */
  setCopyRoleId(roleAry) {
    console.log("setCopyRoleId：" + roleAry);
    this.auditInfo.roles = this.comCopyRole(roleAry);
  }

  /**
   * @description 获取选择的用户
   */
  comCopyRole(roleAry) {
    const that = this;
    // 筛选出角色
    const roleUsers = that.copyUsers.filter((item, index) => {
      return roleAry.includes(item.id);
    });

    const roleIdAry = [];
    // 获取选中的角色数据
    roleUsers.forEach((userinfo) => {
      const roleIdList = userinfo.roleIdList;
      if (!that.strIsNull(roleIdList)) {
        const roleIds = roleIdList.split(",");
        // 角色ID
        roleIds.forEach((roleId) => {
          roleIdAry.push(roleId);
        });
      }
    });
    const roleId = Array.from(new Set(roleIdAry));

    return roleId;
  }

  /*
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || "";
    return (
      typeof strVal === "undefined" ||
      strVal == null ||
      strVal == "" ||
      strVal == "null"
    );
  }
}
</script>
<style lang="scss" scoped>
.handerUser {
  line-height: 54px;
  margin: 0px 0px 20px;
}

.el-select {
  display: block;
}
.user-base-info {
  > div {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    > span {
      &:nth-of-type(1) {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
      &:nth-of-type(2) {
        width: calc(100% - 100px);
      }
      & + img {
        width: calc(100% - 410px);
      }
    }
  }
}
.audit-info {
  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
    > span {
      display: block;
      width: 100px;
      text-align: right;
    }
  }
}
.audit-title {
  display: block;
  text-align: center;
  margin-bottom: 10px;
}
.base-info {
  .el-row {
    display: flex;
    margin-bottom: 20px;
    .title {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    .title + span,
    img {
      display: inline-block;
      width: 380px;
    }
    img {
      width: 120px;
    }
  }
}
.custom-row {
  display: flex;
  margin-bottom: 20px;
  span {
    display: inline-block;
    width: 80%;
    &.title {
      width: 100px;
      text-align: right;
    }
  }
}
</style>
