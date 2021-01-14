<template>
    <div style="height: 100%;background-color: #00a9ff;">
        <div class="box">
            <div class="img"></div>
            <div class="form">
                <div class="header">{{Header}}</div>
                <div class="input_box">
                    <el-input class="input" prefix-icon="el-icon-user" placeholder="请输入账号" clearable v-model="Form.user_no" type="text" @keyup.enter.native="login"/>
                    <el-input class="input" :show-password="true" prefix-icon="el-icon-lock" placeholder="请输入密码" clearable v-model="Form.password" type="password" @keyup.enter.native="login"/>
                </div>
                <div class="btn_box">
                    <div style="border-radius: 10px;overflow: hidden;display: inline-block;"><el-button type="primary"  @click="login">登录</el-button></div>
                    <div style="border-radius: 10px;overflow: hidden;display: inline-block;margin-left: 20px"><el-button @click="reset">重置</el-button></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            Header: '野乐Mes系统',
            Form: { // 登录框表单
                user_no: '',
                password: ''
            }
        }
    },
    methods: {
        // 登录按钮
        async login() {
            const { data : res } = await this.$http.post('login',this.Form).catch(()=>{this.$message.error(res.message)}) // 登录请求
            // switch (res.code){
            //     case 0: {
            //         this.$router.push('/layout')
            //         return this.$message.success('登录成功')
            //     }
            //     case 10004: {
            //         this.$router.push('/layout')
            //         return this.$message.success('登录成功')
            //     }
            //     case 10005 :{
            //         return this.$message.error('请输入账号、密码！')
            //     }
            //     case 20002 : {
            //         return this.$message.error('用户不存在！')
            //     }
            //     default:{
            //         return this.$message.error('未知错误！')
            //     }
            // }
            this.$router.push('/layout')

        },
        // 设置登录session
        setSession () {
            window.sessionStorage.setItem('login','true')
        },
        // 重置表格
        reset () {
            this.Form.user_no = '',
            this.Form.password = ''
        }
    },
}
</script>
<style>

    .box{
        margin-left: 50%;
        transform: translate(-50%);
        width: 80%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .img{
        background-image: url('../assets/body-bg.png');
        background-size: contain;
        width: 500px;
        height: 500px;
    }
    .form{
        border-radius: 15px;
        box-shadow: 7px 10px 20px 1px black;
        background-color: lightsteelblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 50%;
    }
    .header{
        font-size: 30px;
        margin-bottom: 10px;
    }
    .input_box{
        width: 60%;
    }
    .input{
        border-radius: 10px;
        overflow: hidden;
        margin-top: 20px;
    }
    .btn_box{
        margin-top: 5%;
    }
</style>
