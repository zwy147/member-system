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
          const pro = this.$store.dispatch("Login", this.form).then(response => {
              if (response.flag) {
                // 前往首页
                this.$router.push("/");
              } else {
                this.$message({
                  message: response.message,
                  type: "warning"
                });
              }
            })
            .catch(error => {});
          console.log("pro", pro);
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

