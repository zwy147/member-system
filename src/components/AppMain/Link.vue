<template>
  <div>
    <el-breadcrumb  separator="/">
      <el-breadcrumb-item class="clo" :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<style scoped>
.el-breadcrumb {
  height: 10px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.clo {
  border-left: 3px solid #31c17b;
  padding-left: 10px;
}
</style>