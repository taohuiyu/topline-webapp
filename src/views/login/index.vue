<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />
    <!-- 登录表单 -->
<ValidationObserver ref="loginForm">
  <van-cell-group>
    <!--
      name 提示的文本
      rules 验证规则
        required 必填项
        email
        max
      v-slot="{ errors }" 获取校验结果数据
        errors[0] 读取校验结果的失败信息
      -->
    <!-- <ValidationProvider name="手机号" rules="required|email|max:5" v-slot="{ errors }"> -->
   <ValidationProvider name="手机号" rules="required" v-slot="{ errors }">
     <!-- <p>{{errors[0]}}</p> -->
      <van-field
        v-model="user.mobile"
        center
        required
        clearable
        label="手机号"
        placeholder="请输入手机号"
       :error-message="errors[0]"
      />
   </ValidationProvider>

  <ValidationProvider name="验证码" rules="required|max:6" v-slot="{ errors }">
    <!-- <p>{{errors[0]}}</p> -->
      <van-field
        v-model="user.code"
        center
        type="password"
        label="验证码"
        placeholder="请输入验证码"
        required
       :error-message="errors[0]"
      />
   </ValidationProvider>
   </van-cell-group>
</ValidationObserver>
<!-- /登录表单 -->
    <!-- 登录按钮 -->
    <div class="btn-wrap">
      <van-button  @click="onLogin" type="info" class="btn">登录</van-button>
    </div>
    <!-- /登录按钮 -->
  </div>
</template>
<script>
// 登录处理函数
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '18406555690',
        code: '246810'
      }
    }
  },
  methods: {
    async onLogin () {
      // 表单验证
      const isValid = await this.$refs.loginForm.validate()
      // 如果验证失败，请求停止,阻止表单提交
      if (!isValid) {
        return
      }
      // 验证通过，loading ,请求
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登录中'
      })
      try {
        const { data } = await login(this.user)
        // 结束loading提示
        toast.clear()
        this.$toast.success('登录成功')
        // 登陆成功以后将数据存储到容器中
        this.$store.commit('setUser', data.data)
      } catch (err) {
        toast.clear()
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  .btn-wrap {
    padding: 20px;
    .btn {
      width: 100%;
      background-color: #6db4fb;
      color: #fff;
    }
  }
}
</style>
