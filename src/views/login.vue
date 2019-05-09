<template>
    <div class="loginWrap">
      <div class="login_box">
        <div class="logo_black"><i></i><span>衢州市“芯城市”智慧物联-非机动车场景演示系统</span></div>
        <div>
          <el-form :model="loginData" :rules="loginDataRule" ref="loginRef">
            <el-form-item prop="username">
              <el-input placeholder="账号" v-model="loginData.username" @keyup.enter.native="loginCheck">
                <i slot="prefix" class="account_icon"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="密码" v-model="loginData.password" type="password" @keyup.enter.native="loginCheck">
                <i slot="prefix" class="pwd_icon"></i>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btnBox"><button class="btn" @click="goLogin('loginRef')">登录</button></div>
      </div>
      <div class="login_bg1"></div>
      <div class="login_bg2"></div>
    </div>
</template>

<script>
   import {toLogin} from "../api/remConfig";
   export default {
      name: "login",
      data(){
        return{
          loginData:{
            username:'',
            password:''
          },
          loginDataRule:{
            username:[
              {required:true,message:'请输入账号',trigger:'blur'},
              {pattern:/^(?!(\s+$))/,message:'请输入账号'}
            ],
            password:[
              {required:true,message:'请输入密码',trigger:'blur'},
              {pattern:/^(?!(\s+$))/,message:'请输入密码'}
            ]
          }
        }
      },
      methods:{
        loginCheck(e){
          let keyCode = window.event ? e.keyCode : e.which;
          if (keyCode == 13){
            this.goLogin('loginRef');
          }
        },
        goLogin(formName){
          this.$refs[formName].validate((valid)=>{
            if(valid){
              toLogin(this.loginData).then(refs=>{
                console.log(refs);
                if(refs.data=='success'){
                  this.$message({
                    type: 'success',
                    message:'登录成功'
                  });
                  localStorage.setItem('userName',refs.data.data);
                  this.$router.push('/index');
                }else{
                  this.$message({
                    type: 'error',
                    message:'用户名或密码错误'
                  })
                }
              }).catch(err=>{
                console.log(err);
                this.$message({
                  type: 'error',
                  message:err
                })
              })
            }else{
              console.log('error submit!');
              return false;
            }
          })
        }
      }
    }
</script>

<style scoped lang="scss">
  .loginWrap{
    width:100%;
    height:100vh;
    background:#F0F2F5;
    position:relative;
    display:flex;
    justify-content: center;
    align-items: center;
    .login_box{
      width:5.4rem;
      height:3.2rem;
      background:#fff;
      border-radius: 0.1rem;
      box-sizing: border-box;
      padding:0.3rem 0 0;
      .logo_black{
        margin-bottom:0.3rem;
        display: flex;
        justify-content: center;
        span{
          font-size:0.20rem;
          line-height: 0.4rem;
        }
        i{
          display:inline-block;
          margin-right:0.1rem;
          width:0.4rem;
          height:0.4rem;
          background:url("../img/jinghui.png") no-repeat center;
          background-size:100% 100%;
          vertical-align: middle;
        }
      }
      .el-input{
        width:3.68rem;
        margin-bottom:0.05rem;
        .el-input__prefix{
          .account_icon,.pwd_icon{
            position:absolute;
            top:50%;
            margin-top:-0.08rem;
            background:url("../img/login_account.svg") no-repeat center;
            width:0.16rem;
            height:0.16rem;
          }
          .pwd_icon{
            background:url("../img/login_pwd.svg") no-repeat center;
          }
        }
      }
      .btnBox{
        display: flex;
        justify-content: center;
      }
      .btn{
        width:3.68rem;
        height:0.4rem;
        background: #1890FF;
        border-radius:0.04rem;
        font-size:0.16rem;
        color: #FFFFFF;
        outline: none;
        border:none;
        cursor: pointer;
      }

    }
    .login_bg1{
      position:absolute;
      width:2.34rem;
      height:1.95rem;
      background:url("../img/login_bg1.svg") no-repeat center;
      background-size:100% 100%;
      top:1.4rem;
      left:0.8rem;
    }
    .login_bg2{
      position:absolute;
      width:3.171rem;
      height:2.83rem;
      background:url("../img/login_bg2.svg") no-repeat center;
      background-size:100% 100%;
      top:2.94rem;
      right:0.59rem;
    }
  }
  .loginWrap /deep/ .login_box{
    .el-form{
      .el-form-item{
        margin-bottom:0.29rem;
      }
      .el-form-item__content{
        .el-form-item__error{
          left:0.7rem;
        }
      }
    }
  }
</style>
