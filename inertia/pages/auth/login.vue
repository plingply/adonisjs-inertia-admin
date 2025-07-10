<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" meth class="login-form">
      <div class="title-box">
        <h3 class="title">标题</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-button type="primary" size="large" @click="loginSubmit">登录</el-button>
      </el-form-item>
    </el-form>
    <div>
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.6" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.4)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.2)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2024 xuejj.com All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="Login">
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
const loginRef = ref(null)
import { login } from '../../api/auth'
import { ElMessage } from 'element-plus'
import cache from '../../utils/cache'
const loginForm = ref({
  username: '',
  // username: 'admin',
  password: '',
  // password: 'admin123',
} as any)

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
}

const loginSubmit = () => {
  if (!loginRef.value) return
  loginRef.value.validate(async (valid) => {
    if (valid) {
      login(loginForm.value.username, loginForm.value.password)
      .then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('登录成功')
          cache.set('userInfo', res.data.data)
          window.location.href = '/'
        } else {
          ElMessage.error('登录失败')
        }
      })
      .catch(() => {
        ElMessage.error('账号或密码错误')
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1));
}

.title-box {
  margin: 0px auto 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 64px;
    height: 64px;
  }
  .title {
    color: #1296db;
    font-size: 24px;
  }
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  position: relative;
  top: -50px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 140px;
  line-height: 140px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #333;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  filter: drop-shadow(2px 4px 6px black);
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
.waves {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 25vh;
  margin-bottom: -7px; /*Fix for safari gap*/
  min-height: 100px;
  max-height: 200px;
}

/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }
  .content {
    height: 30vh;
  }
  h1 {
    font-size: 24px;
  }
}
</style>
