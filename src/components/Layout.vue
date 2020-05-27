<template>
  <div>
    <app-header></app-header>
    <app-nav></app-nav>
    <app-main></app-main>
  </div>
</template>
<script>
import AppHeader from "./AppHeader";
import AppNav from "./AppNav";
import AppMain from "./AppMain";
export default {
  components: {
    AppHeader,
    AppNav,
    AppMain
  }
};
</script>

<style scoped>
/* 头部 */
.header {
  position: absolute;
  line-height: 50px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #a7cc7a;
  color: #5d7046;
}
/* 左侧导航 */
.nav {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0px;
  bottom: 0px;
  padding: 15px;
  background: #b4cc9b;
  color: #5d7046;
  overflow-y: auto;
}
/* 主区域 */
.main {
  position: absolute;
  top: 50px;
  right: 0px;
  left: 230px;
  bottom: 0px;
  padding: 10px;
  background-color: #e3f0df;
  color: #5d7046;
  overflow-y: auto;
}
</style>