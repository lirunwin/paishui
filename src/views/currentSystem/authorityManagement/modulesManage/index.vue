<template>
  <div class="modules-manage">
    <el-row type="flex" :gutter="20" style="height: 100%">
      <el-col :span="12">
        <CRUD
          title="子系统管理"
          :columns="systemCols"
          component-key="system"
          :query="querySystemList"
          :add="addNewSystem"
          :edit="editSystem"
          :delete="delSystem"
          :form="systemForm"
          :forms="systemForms"
          :form-rules="systemFormRule"
          @query-menus="menusGet"
          @set-form="formSet"
          @set-system="getAllSys"
          @clear-field="clear"
        />
      </el-col>
      <el-divider direction="vertical" class="divider" />
      <el-col :span="12">
        <CRUD
          title="菜单管理"
          :columns="menuCols"
          component-key="menu"
          :query="queryMenuList"
          :add="addNewMenu"
          :edit="editMenu"
          :delete="delMenu"
          :form="menuForm"
          :forms="menuForms"
          :form-rules="menuFormRule"
          :noti-menu="notiMenu"
          :system-id="sysId"
          @menus-query-close="menusGet"
          @set-parent="beloneParents"
          @set-form="formSet"
          @clear-field="clear"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import CRUD from "./components/CRUD.vue";
import {
  querySystemList,
  addNewSystem,
  editSystem,
  delSystem,
  queryMenuList,
  addNewMenu,
  editMenu,
  delMenu,
} from "@/api/base";
const systemCols = [
  {
    label: "序号",
    prop: "order",
    width: 60,
  },
  {
    label: "系统名称",
    prop: "sysname",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
  {
    label: "系统类型",
    prop: "type",
  },
];
const menuCols = [
  {
    label: "序号",
    prop: "order",
    width: 60,
  },
  {
    label: "显示顺序",
    prop: "sort",
    width: 60,
  },
  {
    label: "跳转用名称",
    prop: "name",
    width: 140,
  },
  {
    label: "路径",
    prop: "path",
  },
  {
    label: "所属父级",
    prop: "parentId",
  },
  {
    label: "图标",
    prop: "icon",
  },
  {
    label: "类型",
    prop: "type",
  },
  {
    label: "启用/禁用",
    prop: "statusFlag",
    formatter: (row, col, cellVal, index) => {
      if (cellVal === "0") return "禁用";
      if (cellVal === "1") return "启用";
    },
  },
  {
    label: "所属系统",
    prop: "sysId",
  },
  {
    label: "使用组件",
    prop: "component",
  },
  {
    label: "标题",
    prop: "label",
  },
  {
    label: "使用弹窗",
    prop: "widgetid",
  },
  {
    label: "路径Id",
    prop: "pathId",
  },
  {
    label: "父级路径id",
    prop: "parentPathid",
    width: 150,
  },
];
@Component({
  name: "ModulesManage",
  components: { CRUD },
})
export default class ModulesManage extends Vue {
  querySystemList = querySystemList;
  addNewSystem = addNewSystem;
  editSystem = editSystem;
  delSystem = delSystem;
  queryMenuList = queryMenuList;
  addNewMenu = addNewMenu;
  editMenu = editMenu;
  delMenu = delMenu;
  systemCols = systemCols;
  menuCols = menuCols;
  systemForm = {
    sysname: "",
    type: "",
  };
  systemFormRule = {
    sysname: [
      { required: true, message: "系统名称是必填项！", trigger: "blur" },
    ],
  };
  systemForms = [
    {
      label: "系统名称",
      prop: "sysname",
      type: "input",
    },
    {
      label: "系统类型",
      prop: "type",
      type: "input",
    },
  ];
  menuForm = {
    sort: "", // 显示顺序
    name: "", // 跳转用名称
    path: "", // 路径
    parentId: "", // 所属父级
    icon: "", // 图标
    type: "", // 类型
    statusFlag: "1", // 启用禁用
    sysId: "", // 所属系统
    meta: "", // 元属性
    component: "", // 使用组件
    label: "", // 标题
    widgetid: "", // 使用弹窗
    pathId: "", // 路径Id
    parentPathid: "", // 父级路径id
  };
  menuForms = [
    {
      label: "显示顺序",
      prop: "sort",
      type: "input",
    },
    {
      label: "跳转用名称",
      prop: "name",
      type: "input",
    },
    {
      label: "路径",
      prop: "path",
      type: "input",
    },
    {
      label: "所属父级",
      prop: "parentId",
      type: "select",
      options: [],
    },
    {
      label: "图标",
      prop: "icon",
      type: "input",
    },
    {
      label: "类型",
      prop: "type",
      type: "input",
    },
    {
      label: "启用禁用",
      prop: "statusFlag",
      type: "select",
      options: [
        {
          label: "启用",
          id: "1",
        },
        {
          label: "禁用",
          id: "0",
        },
      ],
    },
    {
      label: "所属系统",
      prop: "sysId",
      type: "select",
      options: [],
    },
    {
      label: "元属性",
      prop: "meta",
      type: "input",
    },
    {
      label: "使用组件",
      prop: "component",
      type: "input",
    },
    {
      label: "标题",
      prop: "label",
      type: "input",
    },
    {
      label: "使用弹窗",
      prop: "widgetid",
      type: "input",
    },
    {
      label: "路径Id",
      prop: "pathId",
      type: "input",
    },
    {
      label: "父级路径id",
      prop: "parentPathid",
      type: "input",
    },
  ];
  menuFormRule = {
    name: [
      { required: true, message: "跳转用名称是必填项！", trigger: "blur" },
    ],
    statusFlag: [
      { required: true, message: "启用禁用是必填项！", trigger: "blur" },
    ],
    sysId: [{ required: true, message: "所属系统是必填项！", trigger: "blur" }],
    meta: [{ required: true, message: "元属性是必填项！", trigger: "blur" }],
    label: [{ required: true, message: "标题是必填项！", trigger: "blur" }],
  };
  notiMenu = false;
  sysId = "";
  menusGet(data) {
    this.notiMenu = data.query;
    this.sysId = data.id;
  }
  getAllSys(data) {
    const arr = data.map((item) => {
      return { id: item.id, label: item.sysname };
    });
    this.menuForms.forEach((item) => {
      if (item.prop === "sysId") item.options = arr;
    });
  }
  beloneParents(data) {
    this.menuForms.forEach((item) => {
      if (item.prop === "parentId") item.options = data;
    });
  }
  formSet(source) {
    const { data, type } = source;
    if (type === "system") {
      Object.keys(this.systemForm).forEach((key) => {
        this.systemForm[key] = data[key];
      });
    } else {
      Object.keys(this.menuForm).forEach((key) => {
        this.menuForm[key] = data[key];
      });
    }
  }
  clear(key) {
    if (key === "system") {
      Object.keys(this.systemForm).forEach((key) => {
        this.systemForm[key] = "";
      });
    } else {
      Object.keys(this.menuForm).forEach((key) => {
        this.menuForm[key] = "";
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.modules-manage {
  height: calc(100vh - 107px);
  padding: 20px;
  .divider {
    height: 100%;
  }
}
</style>
