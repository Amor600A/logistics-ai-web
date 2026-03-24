<template>
  <!-- 路由链接 -->
  <nav>
    <router-link style="padding-right:20px;" to="/">首页</router-link>
    <router-link style="padding-right:20px;" to="/extract">关于</router-link>
    <router-link style="padding-right:20px;" to="/tree">树形结构</router-link>
    <router-link to="/menu">菜单</router-link>
  </nav>
  <!-- 路由出口：显示匹配的组件 -->
  <router-view></router-view>
</template>
