<template>
  <div >
    <!--                   顶部导航栏                        -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" >消息中心</el-menu-item>
      <el-menu-item index="4" >订单管理</el-menu-item>
      <el-menu-item index="5" class="user-menu-item" ><i class="el-icon-user"></i>账户管理</el-menu-item> 
    </el-menu>
    <div class="img-container">
      <el-carousel :interval="5000" arrow="always" height="400px">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
    }
  }
}
</script>

<style scoped>
.el-menu-demo {
  background-color: #fff;
}
.container {
  width: 800px;
  height: 800px;
  border: 1px solid #000;
  margin: 0 auto;
}
.user-menu-item {
  position: absolute;
  left: 2400px;
}
.img-container {
  width: 60%;
  margin: 20px auto;
}
 .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
