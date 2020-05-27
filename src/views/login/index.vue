<template>
  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不为空", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("验证成功");
          login(this.form.username, this.form.password).then(response => {
            const resp = response.data;
            console.log(resp, resp.flag, resp.data.token);
            if (resp.flag) {
              //验证成功，通过token获取用户信息
              getUserInfo(resp.data.token).then(response => {
                const respUser = response.data;
                if (respUser.flag) {
                  console.log("userInfo", respUser.data);
                  //保存token,用户信息
                  localStorage.setItem(
                    "zhu-member-user",
                    JSON.stringify(respUser.data)
                  );
                  localStorage.setItem("zhu-member-token", respUser.data.token);
                  //前往主页
                  this.$router.push("/");
                } else {
                  this.$message({
                    message: respUser.message,
                    type: "warning"
                  });
                }
              });
              this.$message({
                message: resp.message,
                type: "success"
              });
            } else {
              //登陆失败，弹出警告
              //alert(resp.message)
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("验证失败");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.jpg");
}
.login-form {
  width: 400px;
  /* 上下间距220px,左右自动居中 */
  margin: 220px auto;
  background-color: rgb(237, 245, 212, 0.8);
  padding: 30px;
  border-radius: 30px;
}
.login-title {
  color: #3b3d31;
  text-align: center;
}
</style>

