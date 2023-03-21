<template>
  <div class="addEle">
    <div id="popup" class="ol-popup">
      <a @click="toClose" id="popup-closer" class="ol-popup-closer"></a>
      <FormPopup ref="child" :form="form" :type="eventType"></FormPopup>
    </div>
    <el-card class="addEvent">
      <div slot="header" class="clearfix">
        <span>事件添加</span>
      </div>
      <div>
        <el-button
          style="margin-left: 18px"
          size="small"
          @click="toDraw"
          :disabled="isDrawing"
          :type="isDrawing ? 'success' : 'primary'"
          icon="el-icon-document-add"
        >
          选择地点</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import FormPopup from "../components/FormPopup.vue";
import createDraw from "../mapApi/Draw";
import Point from "../mapApi/Point";
let popup, layer, source, position, draw;
export default {
  components: {
    FormPopup,
  },
  data() {
    return {
      eventType: "add", //事件类型
      isDrawing: false, //是否绘制中
      form: {}, //表单
    };
  },
  methods: {
    toClose() {
      source.clear();
      popup.setPosition(undefined);
      this.form = {};
      this.$nextTick(() => {
        this.$refs.child.formClear();
      });
    },
    toDraw() {
      this.toClose();
      this.eventType = "add";
      this.isDrawing = true;
      draw = createDraw({
        type: "Point",
        source: source,
        callback: (e) => {
          this.isDrawing = false;
          this.$map.removeInteraction(draw);
          position = e.feature.getGeometry().flatCoordinates;
          popup.setPosition(position);
          this.$map.getView().animate({
            center: position,
            zoom: 16,
            duration: 2000,
          });
        },
      });
      this.$map.addInteraction(draw);
    },
    initOverLay() {
      const container = document.getElementById("popup");
      popup = new ol.Overlay({
        element: container,
        autoPan: true,
        positioning: "bottom-center",
        stopEvent: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      this.$map.addOverlay(popup); //第二、加了透明层
    },
    initLayer() {
      source = new ol.source.Vector({});
      layer = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 0.85],
            scale: 0.2,
            opacity: 0.9,
            src: require("../assets/event1.png"),
          }),
        }),
      });
      this.$map.addLayer(layer); //第一、加了图层
    },
    addToSql() {
      let attr = [];
      for (let key in this.form) {
        attr.push(this.form[key]);
      }
      Point.add({
        position: position,
        attr: attr,
        service: {
          name: "guanggu",
          layerId: 2,
        },
        callback: (data) => {
          if (data.succeed) {
            this.$message.success("添加成功!");
            this.$guigu.refresh();
            this.eventType = "query";
          } else {
            this.$message.error("添加失败");
          }
        },
      });
    },
  },
  mounted() {
    this.initLayer();
    this.initOverLay();
  },
  destroyed() {
    this.$map.removeInteraction(draw);
    this.$map.removeLayer(layer);
    this.$map.getOverlays().clear();
  },
};
</script>
<style lang="scss">
.addEvent {
  position: absolute;
  right: 4%;
  top: 10vh;
  z-index: 999;
}
</style>
