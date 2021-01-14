<template>
    <div style="width: 100%">
        <div class="funcBox">
            <div class="inputAndSearch">
                <el-input style="width: 300px;margin-right: 20px" placeholder="请输入名称进行搜索" size="mini"/>
                <el-button size="mini" type="primary" @click="getInfo" >搜索</el-button>
            </div>
            <div class="datePiker">
                <span class="datePikerSpan">开始月份 : </span>
                    <el-date-picker v-model="start_date" type="month" placeholder="选择日期" size="mini"/>
                    <span class="datePikerSpan" style="margin-left: 10px">结束月份 : </span>
                    <el-date-picker v-model="end_date" type="month" placeholder="选择日期" size="mini"/>
            </div>
        </div>
        <wlGantt :data="form"
                 :treeProps="columns"
                 :edit="false"
                 dateType="monthAndDay"
                 :fit="false"
                 default-expand-all
                 :end-date="end_date"
                 :start-date="start_date"
                 :autoGanttDateType="false"
                 height="75vh"
                 :border="false"
                 :cell-style="cellStyle"/>
        <el-pagination
                style="margin-left: 50%;transform: translate(-30%);margin-top: 20px"
                background
                layout="prev, pager, next,total"
                :total="page.total"
                :page-size="page.pageSize"
                :current-page.sync="page.pageNum"
                @current-change="getDataSize"/>
    </div>
</template>
<script>
export default {
    data() {
        return {
            formTemp:[], // 临时数据
            input: '',
            columns:{
                children: 'children',
                name: 'name',
                startDate:'starDate',
                endDate:'enDate'
            },
            form: [], // gantt图数据
            start_date: '2020-07-01',
            end_date: '2020-10-15',
            dayMax: '',
            dayMin: '',
            page:{
                pageNum:1,
                total:'',
                pageSize:8

            }
        }
    },
    methods:{
        // 获取最大天数和最小天数
        getDay (form) {
            form.forEach((item) => {
                let max = new Date(item.endDate).getTime()
                let min = new Date(item.startDate).getTime()
                if (!this.dayMin) {
                    this.dayMin = min
                    this.dayMax = max
                }
                if (min < this.dayMin) {
                    this.dayMin = min
                }
                if (max > this.dayMax) {
                    this.dayMax = max
                }
            })
            this.start_date = new Date(this.dayMin)
            this.end_date = new Date(this.dayMax)
        },
        async getInfo () {
            const { data: res } = await this.$http.get('/analyse/plan_gantt')
            if (res.code!==0) {
                return this.$message.error(res.data.message)
            }
            for(let item in res.data){
               let a = {
                   name: res.data[item].name,
                   startDate: res.data[item].startDate,
                   endDate: res.data[item].endDate,
                   children:[]
               }
               for(let i in res.data[item].children){
                   let b = {
                       id:res.data[item].children[i].plan_id,
                       name: res.data[item].children[i].name,
                       startDate: res.data[item].children[i].plan_complete_time,
                       endDate: res.data[item].children[i].send_time
                   }
                   a.children.push(b)
               }
               this.formTemp.push(a)
            }
            this.page.total = this.formTemp.length
            this.getDataSize(1)
        },
        // 表格样式
        cellStyle({row, column, rowIndex, columnIndex}) {
            if (columnIndex > 2 ) {
                return {
                    borderBottom:'1px solid rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(0,0,0,0.05)'
                }
            }
        },
        // 获取表格每页数据量
        getDataSize(e){
            let min = (e-1)*8
            let max =  e*8
            this.form = this.formTemp.slice(min,max)
        }
    },
    created() {
        this.getInfo()

    },
    beforeMount() {
        // this.getDay(this.form) // 获取最大天与最小天
    }

}
</script>
<style>
    .datePiker{
        margin:10px 0 20px 0;
    }
    .el-date-editor{
        margin-right: 20px;
    }
    .datePikerSpan{
        font-weight: bold;
        margin-right: 20px;
    }
    .inputAndSearch{
        margin:10px 0 20px 10px;
    }
    .funcBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
