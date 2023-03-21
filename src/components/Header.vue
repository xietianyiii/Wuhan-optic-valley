<template>
  <div class="header">
    <img src="../assets/header.png" alt="" />
    <h2>光谷智慧交通系统</h2>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      router
    >
      <el-menu-item index="/video">实时监控</el-menu-item>
      <el-menu-item index="/eventQuery">事件查询</el-menu-item>
      <el-menu-item index="/addEvent">事件添加</el-menu-item>
      <el-submenu index="/measuring">
        <template slot="title">工具箱</template>
        <el-menu-item index="/measuring?type=area">面积测量</el-menu-item>
        <el-menu-item index="/measuring?type=distance">距离测量</el-menu-item>
      </el-submenu>
    </el-menu>
    <h4>admin</h4>
    <div class="h"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "/",
    };
  },
  methods: {
    handleSelect(e) {
      this.activeIndex = e;
    },
  },
  mounted() {
    this.activeIndex = window.location.hash.split("#")[1].split("?")[0];
  },
};
</script>
<style lang="scss">
.header {
  display: flex;
  position: absolute;
  z-index: 1000;
  width: 100%;
  height: 60px;
  background-color: rgb(255, 255, 255);

  .h {
    margin-top: 28px;
    margin-right: 1.7%;
    width: 0px;
    height: 0px;
    border: 5px solid transparent;
    border-top-color: rgb(17, 16, 16);
  }

  img {
    margin-left: 1%;
  }

  h2 {
    margin-left: 1%;
    line-height: 60px;
  }

  h4 {
    margin-left: auto;
    margin-right: 0.8%;
    line-height: 60px;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  .el-menu--horizontal > .el-menu-item.is-active {
    color: #fff !important;
    background-color: rgb(33, 150, 243) !important;
    border: none !important;
  }

  .el-menu-demo {
    margin-left: 1%;

    .el-menu-item {
      color: #333;
      font-size: 16px;
      height: 60px;
      line-height: 60px;
    }

    .el-submenu__title {
      color: #333 !important;
      font-size: 16px;
    }
  }
}
</style>
