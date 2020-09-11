<template>
  <div>
      用户名:<input type="text" v-model="loginForm.username" placeholder="请输入用户名"/>
      <br><br>
      密码： <input type="password" v-model="loginForm.password" placeholder="请输入密码"/>
      <br><br>
      <button v-on:click="login">登录</button>
  </div>
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
