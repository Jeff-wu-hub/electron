<template>
    <div class="contain">
        <div class="TopTable">
            <el-date-picker v-model="monthAndWeek" type="week" format="yyyy 第 WW 周" placeholder="选择周" size="mini" @change="changeDay" class="date-pick"/>
<!--            表格开始-->
            <div class="tableBox">
            <table class="formTopTable">
<!--                表头-->
                <thead class="Thead">
                    <tr class="tableHeadTr"><td rowspan="2"></td><td class="tableHeadTd" colspan="7">九月</td></tr>
                    <tr class="tableHeadTr"><td class="tableHeadTd" v-for="(day,i) in dateValue" :key="i">{{day.day}}-{{day.week}}</td></tr>
                </thead>
<!--                表body-->
                <tbody class="Tbody">
                    <tr v-for="value in formTop" :key="value">
                        <td class="leftHead">{{value.name}}</td>
                        <td class="tableCell" v-for="cell in dateValue" :key="cell">
                            <div v-for="(span,index) in value.child" :key="index">
                                <div class="span" v-if="span.date === cell.date" @click="addInfo">{{span.timeStart}}-{{span.name}}-{{span.timeEnd}}</div>
                            </div>
                        </td>
                    </tr>
                    <tr style="max-height: 10%"><td colspan="8"></td></tr>
                    </tbody>
            </table>
            </div>
        </div>
        <div class="inputForm">
<!--            左下角输入框-->
            <el-card shadow="never" style="width: 100%;height: 100%">
<!--                提示信息-->
                <el-tag style="width: 100%" type="danger">工单信息</el-tag>
<!--                表单-->
                <el-form ref="form" :model="form">
<!--                    输入表单-->
                    <div class="inputGroup">
                        <el-form-item label="工单号:"><el-input type="text" size="mini" style="width: 75%" /></el-form-item>
                        <el-form-item label="主件号:"><el-input type="text" size="mini" style="width:75%"/></el-form-item>
                    </div>
<!--                    按钮控件-->
                    <div class="btnGroup">
                        <el-button size="mini" type="primary" class="btn">刷新工单</el-button>
                        <el-button size="mini" type="primary" class="btn">计算库存</el-button>
                        <el-button size="mini" type="primary" class="btn">查询</el-button>
                        <el-button size="mini" type="primary" class="btn">新增空排程</el-button>
                    </div>
                </el-form>
            </el-card>
        </div>
<!--        右下角表格-->
        <div class="BottomTable">
            <el-table size="mini" max-height="95%" border stripe highlight-current-row :data="formBottom">
                <el-table-column type="index" align="center"/>
                <el-table-column label="订单单号" align="center" prop="order"/>
                <el-table-column label="订单序号" align="center"/>
                <el-table-column label="工单号" align="center"/>
                <el-table-column label="主件品名" align="center"/>
                <el-table-column label="预计产量" align="center"/>
                <el-table-column label="交货日期" align="center"/>
                <el-table-column label="主件品号" align="center"/>
                <el-table-column label="规格" align="center"/>
                <el-table-column label="备注说明" align="center"/>
            </el-table>
<!--            分页-->
            <el-pagination background @current-change="changePage" layout="prev, pager, next,total" :current-page="page.pageNum" :total="page.total" :page-size="page.pageSize" class="page"></el-pagination>
        </div>
<!--        排班信息修改框-->

    </div>
</template>
<script>
export default {
    data(){
        return {
            //时间数组用于表头日期
            dateValue: [{
                date:'2020-1-1',
                week:'周一',
                day:'1日'
            },
                {
                    date:'2020-1-2',
                    week:'周二',
                    day:'2日'
                },
                {
                    date:'2020-1-3',
                    week:'周三',
                    day:'3日'
                },
                {
                    date:'2020-1-4',
                    week:'周四',
                    day:'4日'
                },
                {
                    date:'2020-1-5',
                    week:'周五',
                    day:'5日'
                },
                {
                    date:'2020-1-6',
                    week:'周二',
                    day:'6日'
                },
                {
                    date:'2020-1-7',
                    week:'周日',
                    day:'7日'
                }], // 存放一周表格标题
            monthAndWeek: '',//周数
            formTop:[
                {
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                }, {
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                },{
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                },{
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                }
                ,{
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                },{
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                },{
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    },{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    },{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    },{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    },{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    },{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                },{
                    name:'A-1线',
                    child:[{
                        date:'2020-1-3',
                        name:'WWC-190831-1(33)',
                        timeStart: '0:00',
                        timeEnd: '23:59'
                    }]
                }
            ], // 上表格数据
            columns:[], //列项
            form:{ // 输入的数据
            },
            page:{ //分页
                pageNum:1,
                pageSize:8,
                total:1000
            },
            formBottom:[ // 下表格  // 只能8个数据
                {
                    order:'XX'
                },{
                    order:'XX'
                },{
                    order:'XX'
                }
                ,{
                    order:'XX'
                },{
                    order:'XX'
                },{
                    order:'XX'
                },{
                    order:'XX'
                },{
                    order:'XX'
                }
            ]
        }
    },
    methods: {
        async changePage(){ // 改变页码
        },
        changeDay (){ // 改变天
            console.log(this.monthAndWeek)
        },
        //点击修改信息
        addInfo(){
            alert(1)
        }
    },
    mounted() {
    }
}
</script>
<style>
    .contain{
        display: grid;
        height:90vh;
        grid-template-columns: 20% 80%;
        grid-template-rows:60% 40%;
    }
    /*上表格位置*/
    .TopTable{
        overflow-y: scroll;
        height:500px;
        grid-column: span 2;
    }
    /*输入表单*/
    .inputForm{
        height: 100%;
        width: 100%;
        padding-top: 10px;
    }
    /*下表格*/
    .BottomTable{
        position: relative;
        margin-left: 10px;
        padding-top: 10px;
    }
    /*输入框*/
    .inputGroup{
        margin: 10px 0 0 10px;
    }
    /*按钮组*/
    .btnGroup{
        width: 100%;
        min-height: 80px;
        display: grid;
        grid-template-columns: repeat(2,50%);
        grid-template-rows: repeat(2,50%);
    }
    /*按钮第一个*/
    .btn:nth-child(1){
        margin-left: 10px;
    }
    /*每个按钮*/
    .btn{
        width: 80%;
        height: 30px;
        margin-top: 20px;
    }
    /*分页*/
    .page{
        margin-left: 50%;
        transform: translate(-50%);
    }
    /*日期选取*/
    .date-pick{
        float: right;
        margin: 10px 10px 10px 0;
    }
    /*上表格头日期行*/
    .tableHeadTr{
        width: 100%;
    }
    /*上表格*/
    .formTopTable{
        overflow: hidden;
        user-select: none;
        table-layout: fixed;
        background-color: rgba(255, 255, 255, 0.47);
        text-align: center;
        width: 100%;
        height: 10%;
        border: 1px solid rgba(10, 10, 10, 0.1);
    }
    /*上表格头部cell日期*/
    .tableHeadTd{
        border: 1px solid rgba(10, 10, 10, 0.1);
        height: 30px;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.11),rgba(255, 255, 255, 0.11), rgba(0, 0, 0, 0.23), rgba(0, 0, 255, 0.27),rgba(0, 0, 230, 0.25),rgba(0, 0, 255, 0.17),rgba(0, 0, 255, 0.07));
        background-size: 150%;
    }
    /*左边名称头*/
    .leftHead{
        min-width: 80px ;
        border: 1px solid rgba(10, 10, 10, 0.1);
        background-position-x: -30px;
        background-size: 150%;
        font-size: 20px;
        font-weight: 1000;
    }
    /*表格cell*/
    .tableCell{
        height: 50px;
        width: 14%;
        border: 1px solid rgba(10, 10, 10, 0.1);
        background-color: rgba(211, 211, 211, 0.44);
    }
    /*表格cell里面的单元格*/
    .span{
        cursor: pointer;
        position: relative;
        color: white;
        border-radius: 10px;
        background-color: #30B08F;
        border: 1px solid rgba(10, 10, 10, 0.1);
        overflow: hidden;
        font-size: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
    }
    .span::after{
        position: absolute;
        content: '';
        left: 0;
        top: -7px;
        width: 100%;
        height: 10px;
        background-color: red;
    }
    /*表格头部*/
    .Thead{
    }
    /*表格身部*/
    .Tbody{
        height: 100%;
        table-layout: fixed;
        overflow-y: auto;
    }
</style>
