<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- 路由链接 -->
  <nav>
    <router-link to="/">首页</router-link>
    <router-link to="/extract">关于</router-link>
  </nav>
  <!-- 路由出口：显示匹配的组件 -->
  <router-view></router-view>
</template>

<script setup>
// 👇 新增这一行，导入 HelloWorld 组件
// import HelloWorld from './components/HelloWorld.vue'
</script>
