<template>
  <div>
    <h1>欢迎来到会员管理系统！</h1>
    <div class="moving same">
        <div class="block">
            <el-carousel height="400">
              <el-carousel-item v-for="item in 4" :key="item">
                  <img class="img-lb" src="@/assets/lbt.jpg">
              </el-carousel-item>
            </el-carousel>
        </div> 
    </div>

    </div>
</template>
<style scoped>
 /*轮播图部分*/
.moving{
  text-align: center;
  margin: 50px 180px;
}
/*轮播图图片部分*/
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
}
/* .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
} */
.moving>img{
    width: 1280px;
    height: 400px;
}
div {
  text-align: center;
}
</style>