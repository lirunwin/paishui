<template>
  <div>
    <more-infos
      :columns="columns"
      :table-data="notifications"
      :pagination="pagination"
      :total="notificationTotal"
      @deal="handleClick"
      @tag="handleClick"
      @size-change="handleSizeChange"
      @curr-change="handleCurrentChange"
      @selection-change="getSelections"
      @select-all="getSelections"
    >
      <template slot="filters">
        <el-row type="flex" justify="start" align="middle" :gutter="20">
          <el-col :span="6" style="display: flex; align-items: center">
            <span style="width: 45px">状态：</span>
            <el-select v-model="filter.flag" style="width: 140px" size="small">
              <el-option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </el-select>
          </el-col>
          <el-col :span="18" style="display: flex; align-items: center">
            <span style="width: 45px">时间：</span>
            <el-date-picker
              v-model="notificationTimeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
          <el-col style="display: flex">
            <el-button
              size="small"
              type="primary"
              @click="handleFiltersClick('query')"
              >查询</el-button
            >
            <el-button
              size="small"
              type="primary"
              :disabled="notiSelections.length === 0"
              @click="handleFiltersClick('mark')"
              >标记已读</el-button
            >
          </el-col>
        </el-row>
      </template>
    </more-infos>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import { getNotifications, markAsRead } from "@/api/dashboard";
import MoreInfos from "@/views/currentSystem/dashboard/components/Layout/MoreInfos.vue";
const columns = [
  {
    prop: "select",
    type: "selection",
    align: "center",
    width: 55,
  },
  {
    prop: "order",
    label: "序号",
    align: "center",
    width: 90,
  },
  {
    prop: "topic",
    align: "left",
    label: "标题内容",
  },
  {
    prop: "message",
    width: 200,
    align: "left",
    label: "内容描述",
  },
  {
    prop: "createTime",
    label: "时间",
    align: "center",
    width: 180,
  },
  {
    prop: "flag",
    label: "状态",
    align: "center",
    width: 100,
    formatter: (row, col, cellVal, index) => {
      if (cellVal === "0") return "未读";
      if (cellVal === "1") return "已读";
    },
  },
  {
    prop: "action",
    label: "操作",
    width: 140,
    align: "center",
    actions: [
      {
        key: "deal",
        label: "处理",
        color: "#409EFF",
        flag: "3",
      },
      {
        key: "tag",
        label: "标记",
        color: "#F56C6C",
        flag: "0",
      },
    ],
  },
];
@Component({
  components: { MoreInfos },
})
export default class Notification extends Vue {
  columns;
  notifications = [];
  filter = {
    flag: "0",
    endTime: "",
    beginTime: "",
  };
  options = [
    {
      label: "未读",
      value: "0",
    },
    {
      label: "已读",
      value: "1",
    },
    {
      label: "所有",
      value: "",
    },
  ];
  pagination = { size: 20, current: 1 };
  notificationTotal = 0;
  tableLoading = false;
  notificationTimeRange = "";
  notiSelections = [];
  mounted() {
    this.getNotificationList();
  }
  destroyed() {
    console.log("实例销毁完成");
    // this.$store.state.jumpText = ''
  }
  // 点击查询 标记
  handleFiltersClick(type) {
    if (type === "query") {
      this.getNotificationList();
    } else {
      const param = {
        messageIds: this.notiSelections.map((item) => item.id).join(","),
      };
      markAsRead(param).then(() => {
        this.$emit("reget-noti");
        this.getNotificationList();
        this.notiSelections = [];
      });
    }
  }
  // 获取消息列表
  getNotificationList() {
    this.tableLoading = true;
    this.filter.beginTime =
      (this.notificationTimeRange && this.notificationTimeRange[0]) || "";
    this.filter.endTime =
      (this.notificationTimeRange && this.notificationTimeRange[1]) || "";
    const data = Object.assign({}, this.pagination, this.filter);
    getNotifications(data).then((res) => {
      this.notificationTotal = res.result.total;
      const data = res.result.records;
      data.forEach((item, index) => (item.order = index + 1));
      this.notifications = data;
      this.tableLoading = false;
    });
  }
  // 列表行点击操作
  handleClick({ type, data }) {
    const setRoute = (row) => {
      console.log(row.routeIp, "row.routeIp");
      row.routeIp && this.$router.push({ path: row.routeIp });
      const splitRoute = row.routeIp.split("/");
      const target = splitRoute[splitRoute.length - 1];
      // const target = splitRoute[1]
      const origin = JSON.parse(
        JSON.stringify(this.$store.state.routeSetting.dynamicRoutes)
      );
      delete origin.dashboard;
      let result=null
      for (const key in origin) {
        for (const item of origin[key]) {
          if (!this.arrayIsNull(item.children)) {
            result = item.children.find((route) => {
              if (route.name === target || route.path === target) {
                return route;
              }
            });
            if (!this.arrayIsNull(result)) {
              result = key;
              return result;
            }
          }
        }
      }
      return result;
    };

    const setMapParent = (target) => {
      const origin = JSON.parse(
        JSON.stringify(this.$store.state.routeSetting.dynamicRoutes)
      );
      let result=null
      for (const key in origin) {
        for (const item of origin[key]) {
          if (!this.arrayIsNull(item.children)) {
            let result = item.children.find((route) => {
              if (route.name === target || route.path === target) {
                return route;
              }
            });
            if (!this.strIsNull(result)) {
              result = key;
              return result;
            }
          }
        }
      }
      return result;
    };

    // const { row } = data
    const row = data;
    //  console.log("类型：",type,JSON.stringify(row))

    const param = {
      messageIds: row.id.toString(),
    };
    markAsRead(param).then(() => {
      this.$emit("reget-noti");
      this.getNotificationList();
      if (type === "deal") {
        const routeStr = row.routeIp;
        //  routeStr = "Map,wxCheck,FullPanel,计划审核"

        if (this.strIsNull(routeStr)) {
          this.$message.error("路由不存在,无法跳转");
          return;
        } else {
          if (routeStr.indexOf(",") != -1) {
            const routeFirst = routeStr.split(",")[0].toLowerCase();
            if (["map", "xjxt", "whxt",'monitor'].indexOf(routeFirst) > -1) {
              const _index = routeStr.indexOf(",");
              const _params = routeStr.substring(_index + 1);
              console.log("参数：" + _params);
              var str = _params.split(",");
              var _target = str[0];
              var result = setMapParent(_target);
              console.log("返回值：" + result);
              this.$store.state.jumpText = _params;
              // // this.$router.push({path:'/map',meta: { activeMenu: 'xjMissionQuery' }})
              this.$router.push({
                name: "Map",
                params: { activeMenu: _target },
              });
              this.$store.dispatch("routeSetting/changeSys", result);

              // 关闭子主键
              this.$emit("close-notification");
            }
            // this.$router.push('/map')
            // this.$router.push({ path: '/map' , query:{ userId:"10011" } })
            // this.$router.push({ name: 'Map' , params: { params: _params }});
            // const sideBarShow = this.$store.state.app.sidebar.show
            // if (!sideBarShow) this.$store.dispatch('app/toggleSideBarShow', true)
            // this.$store.dispatch('routeSetting/changeSys', routeFirst)
            // this.$store.commit("map/RESET_ALL")
          } else {
            const result = setRoute(row);
            this.$store.dispatch("routeSetting/changeSys", result);
            this.$emit("close-notification");
          }
        }
      }
    });
  }
  // 每页数量变化
  handleSizeChange(size) {
    this.pagination.size = size;
    this.getNotificationList();
  }
  // 页码变化
  handleCurrentChange(page) {
    this.pagination.current = page;
    this.getNotificationList();
  }
  getSelections(selections) {
    this.notiSelections = selections;
  }
  /**
   * @description 判断数组是否为空
   */
  arrayIsNull(aryList) {
    return (
      typeof aryList === "undefined" || aryList == null || aryList.length == 0
    );
  }
  /**
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || "";
    return typeof strVal === "undefined" || strVal == null || strVal == "";
  }
}
</script>
