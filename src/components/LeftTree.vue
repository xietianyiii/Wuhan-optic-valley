<template>
  <div class="leftTree">
    <img
      :v-show="!drawer"
      class="rightImg"
      src="../assets/right.png"
      @click="drawer = !drawer"
      alt=""
    />
    <el-drawer
      :wrapperClosable="false"
      :modal="false"
      title="图层目录"
      :visible.sync="drawer"
      direction="ltr"
    >
      <el-tree
        @check="changeTree"
        :data="layerList"
        show-checkbox
        node-key="id"
        :default-checked-keys="[0, 1, 2, 3, 4]"
        :props="defaultProps"
      >
      </el-tree>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      layerList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    initLayers() {
      const docCatalog = new Zondy.Catalog.MapDoc({
        host: "localhost",
        port: 6163,
        docName: "guanggu",
      });
      //
      docCatalog.getMapInfo((res) => {
        let arr = res.subLayerNames.map((item, index) => {
          return { id: index, label: item };
        });
        this.layerList = arr;
      });
    },
    changeTree(checkedNodes, data) {
      this.$guigu.setLayerStatus(data.checkedKeys.toString(), "show");
    },
  },
  mounted() {
    this.initLayers();
  },
};
</script>
<style lang="scss">
.el-drawer__wrapper {
  width: 14% !important;
  top: 10% !important;
  height: 60% !important;
  left: 1% !important;
}

.el-drawer {
  width: 100% !important;
}

.rightImg {
  position: absolute;
  width: 50px;
  height: 60px;
  top: 35%;
  left: 1%;
  z-index: 99;
  cursor: pointer;
}
</style>
