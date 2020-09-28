<template>
  <div id="poster">
    <a-form :form="form" class="login-container">
      <h3 class="login-title">账户登录</h3>
      <a-form-item>
        <a-input v-model="loginForm.username" placeholder="账号">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-input-item>
        <a-input v-model="loginForm.password" placeholder="密码">
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-input-item>
      <a-form-item style="width: 100%">
        <a-button type="primary" style="margin: 25px auto auto auto;width: 100%;background: #505458;" v-on:click="login">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
    <!--<div>
        用户名:<input type="text" v-model="loginForm.username" placeholder="请输入用户名"/>
        <br><br>
        密码： <input type="password" v-model="loginForm.password" placeholder="请输入密码"/>
        <br><br>
        <button v-on:click="login">登录</button>
    </div>-->
</template>

<script>
  export default {
    name: 'Login',
    data: function() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        responseResult: []
 
      }
    },
    methods: {
      login: function() {
        this.$axios
          .post('/api/login', {
            username: this.loginForm.username,
            password: this.loginForm.password
          })
          .then(successResponse => {
              console.log(successResponse);
            if (successResponse.data.code === 200) {
              localStorage.setItem('ID',successResponse.data.data);
              this.$router.replace({path: '/home'});
            }
            else{
                if(successResponse.data.code === 401)
                alert(successResponse.data.msg);
            }
          })
          .catch(failResponse => {
          })
      }
    }
  }
</script>

<style>
  #poster {
    background: url("../assets/bkg.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  /*body {
    margin: 0px;
  }*/

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 110px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login-title {
    margin: 0px auto 25px auto;
    text-align: center;
    color: #505458;
  }
</style>
