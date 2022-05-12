<template>
    <div class="troubleRecord" id="troubleRecord">
        <div class="filteroption">
            <span class="select_name">分组</span>
            <div class="select_option selectDept">
                <el-select v-model="dept_select.value" size="small" placeholder="请选择" clearable>
                    <el-option v-for="item in dept_select.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <span class="select_name">人员</span>
            <div class="select_option selectPerson">
                <el-select v-model="person_select.value" size="small" placeholder="请选择" clearable>
                    <el-option v-for="item in person_select.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <span class="select_name">片区</span>
            <div class="select_option selectArea">
                <el-select v-model="area_select.value" size="small" placeholder="请选择" clearable>
                    <el-option v-for="item in area_select.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <span class="select_name">状态</span>
            <div class="select_option selectStatus">
                <el-select v-model="status_select.value" size="small" placeholder="请选择" clearable>
                    <el-option v-for="item in status_select.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <span class="select_name">日期</span>
            <div class="select_option selectDate">
                <el-date-picker v-model="date_select" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </div>
            <div class="buttons" style="display: inline-block;margin-left: 10px;">
                <el-button type="primary" size="small">查询</el-button>
                <el-button type="primary" size="small">导出</el-button>
            </div>
        </div>
        <div class="statistics">
            <h3 style="font-size: 14px;text-align: center;">隐患记录表（2020/01/15-2020/01/24）</h3>
            <el-table title="隐患记录表" :data="tableData" border stripe style="width: 100%;">
                <el-table-column prop="indexNo" label="序号" align="center" style="width: 60px;">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pipeLineName" label="管线名称" align="center"></el-table-column>
                <el-table-column prop="troubleLocation" label="隐患部位" align="center"></el-table-column>
                <el-table-column prop="position" label="地址" align="center"></el-table-column>
                <el-table-column prop="isCheck" label="是否验收" align="center"></el-table-column>
                <el-table-column prop="checkTime" label="验收时间" align="center"></el-table-column>
                <el-table-column prop="troubleReason" label="隐患原因" align="center"></el-table-column>
                <el-table-column prop="troubleReasonNote" label="隐患原因备注" align="center"></el-table-column>
                <el-table-column prop="troubleOccurTime" label="隐患发生时间" align="center"></el-table-column>
                <el-table-column prop="isIntoWorkSIteManagement" label="是否进入工地管理" align="center"></el-table-column>
                <el-table-column prop="constructionUnitName" label="施工单位名称" align="center"></el-table-column>
                <el-table-column prop="constructionDirector" label="施工负责人" align="center"></el-table-column>
                <el-table-column prop="phoneNo" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="removeTroubleAdvice" label="消除隐患建议" align="center"></el-table-column>
                <el-table-column prop="isRemoveTrouble" label="隐患是否消除" align="center"></el-table-column>
                <el-table-column prop="removeTime" label="消除时间" align="center"></el-table-column>
                <el-table-column prop="removeTroubleStatus" label="排除隐患情况" align="center"></el-table-column>
                <el-table-column prop="reportPerson" label="上报人" align="center"></el-table-column>
                <el-table-column prop="reportTime" label="上报时间" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //日期信息
            date_select: '',
            //分组筛选信息
            dept_select: {
                options: [
                    {value: '1', label: '巡检组'},
                    {value: '2', label: '抢修组'},
                    {value: '3', label: '维护组'}
                ],
                value: ''
            },
            //人员筛选信息
            person_select: {
                options: [
                    { value: 'ALL_SELECT', label: '全部' },
                    { value: '1', label: '韩雨辰' },
                    { value: '2', label: '朱循义' },
                    { value: '3', label: '魏先义' },
                    { value: '4', label: '侯俊杰' }
                ]
            },
            //片区筛选信息
            area_select: {
                options: [
                    { value: 'ALL_SELECT', label: '全部' },
                    { value: '1', label: 'A片区（三星片区）' },
                    { value: '2', label: 'B片区（老城区）' },
                    { value: '3', label: 'C片区（新城区）' },
                    { value: '4', label: 'D片区（韩滩片区）' },
                    { value: '5', label: 'E片区（云绣、杨柳、赵杨路西段、迎宾大道片区）' },
                    { value: '6', label: 'F片区（清江片区）' },
                    { value: '7', label: 'G片区（官仓片区）' }
                ]
            },
            //状态信息筛选
            status_select: {
                options: [
                    { value: 'ALL_SELECT', label: '全部' },
                    { value: '1', label: '已消除' },
                    { value: '2', label: '未消除' }
                ]
            },
            tableData:[
                {
                    pipeLineName: '/',
                    troubleLocation: '',
                    position: '',
                    isCheck: '',
                    checkTime: '',
                    troubleReason: '',
                    troubleReasonNote: '',
                    troubleOccurTime: '',
                    isIntoWorkSIteManagement: '',
                    constructionUnitName: '',
                    constructionDirector: '',
                    phoneNo: '',
                    removeTroubleAdvice: '',
                    isRemoveTrouble: '',
                    removeTime: '',
                    removeTroubleStatus: '',
                    reportPerson: '',
                    reportTime: ''
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
    .troubleRecord {
        width: 100%;
        height: 100%;
        padding: 5px;
        .select_name {
            font-size: 14px;
        }
    }
</style>