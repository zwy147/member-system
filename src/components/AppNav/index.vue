<template>
  <div class="nav">
    <!-- default-active="/" 默认选中首页
    :router="true"开启路由模式，开启后，index值代表路由地址 -->
    <el-menu
      :router="true"
      default-active="/"
      class="el-menu-vertical-demo"
      background-color="#b4cc9b"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/member/">
        <i class="el-icon-user-solid"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>
      <el-menu-item index="/supplier/">
        <i class="el-icon-shopping-cart-1"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <el-menu-item index="/good/">
        <i class="el-icon-s-goods"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <el-menu-item index="/staff/">
        <i class="el-icon-user"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<style scoped>
.el-menu{
    border-right: none;
}
</style>