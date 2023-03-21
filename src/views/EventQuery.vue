<template>
  <div class="eventEle">
    <div id="popup" class="ol-popup">
      <a @click="toClose" id="popup-closer" class="ol-popup-closer"></a>
      <FormPopup :form="form" :type="eventType"></FormPopup>
    </div>

    <el-card class="event">
      <div slot="header" class="clearfix">
        <span>事件查询</span>
      </div>
      <div>
        <el-button
          size="small"
          @click="toDraw"
          :disabled="isDrawing"
          :type="isDrawing ? 'success' : 'primary'"
          icon="el-icon-copy-document"
          >矩形搜索
        </el-button>
      </div>
    </el-card>

    <el-table
      :row-style="rowStyle"
      height="250"
      v-show="dataList.length > 0"
      class="myTable"
      :data="dataList"
      border
    >
      <el-table-column prop="事件编号" label="事件编号" width="140">
      </el-table-column>
      <el-table-column prop="事件类型" label="事件类型"> </el-table-column>
      <el-table-column prop="事件等级" label="事件等级"> </el-table-column>
      <el-table-column prop="发生时间" label="发生时间" width="140">
      </el-table-column>
      <el-table-column prop="发生地点" label="发生地点" width="170">
      </el-table-column>
      <el-table-column prop="车牌号" label="车牌号"> </el-table-column>
      <el-table-column prop="驾驶员" label="驾驶员"> </el-table-column>
      <el-table-column prop="处理状态" label="处理状态"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="clickRow(scope.row, 'query')"
            :style="scope.row.FID == pickFeature.id_ && 'color:#fff'"
            type="text"
            size="mini"
            >查看
          </el-button>
          <el-button
            @click="clickRow(scope.row, 'edit')"
            type="text"
            :style="scope.row.FID == pickFeature.id_ && 'color:#fff'"
            size="mini"
            >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import createDraw from "../mapApi/Draw";
import mapQuery from "@/mapApi/Query";
import Point from "../mapApi/Point";
import FormPopup from "../components/FormPopup.vue";
let popup, source, layer, style1, style2, draw, features, positions;
export default {
  components: {
    FormPopup,
  },
  data() {
    return {
      isDrawing: false, //是否绘制中
      dataList: [], //事件数据表格
      pickFeature: {}, //选中的元素
      form: {}, //表单
      eventType: "", //表单类型
    };
  },
  methods: {
    toClose() {},
    clickRow(e, type) {
      this.eventType = type;
      popup.setPosition(e.position);
      if (this.pickFeature.id_) {
        this.pickFeature.setStyle(style1);
      }
      this.pickFeature = features.find((item) => {
        return item.id_ == e.FID;
      });
      this.pickFeature.setStyle(style2);
      this.form = this.pickFeature.values_.values_;
      this.$map.getView().animate({
        center: e.position,
        zoom: 16,
        duration: 2000,
      });
    },
    rowStyle({ row, rowIndex }) {
      if (row.FID == this.pickFeature.id_) {
        return {
          background: "rgb(64,158,255)",
          color: "#fff",
        };
      }
    },
    toDraw() {
      this.pickFeature = {};
      popup.setPosition(undefined);
      this.dataList = [];
      source.clear();
      this.isDrawing = true;
      draw = createDraw({
        type: "Rectangle",
        source: source,
        callback: (e) => {
          positions = e.feature.getGeometry();
          this.isDrawing = false;
          this.$map.removeInteraction(draw);
          this.toSearch();
        },
      });
      this.$map.addInteraction(draw);
    },
    toSearch() {
      mapQuery.queryByGeom({
        geometry: positions,
        service: {
          name: "guanggu",
          layerId: 2,
        },
        callback: (res) => {
          if (res.TotalCount > 0) {
            const format = new Zondy.Format.PolygonJSON();
            features = format.read(res);
            this.dataList = features.map((item) => {
              const position = item.getGeometry().flatCoordinates;
              const FID = item.id_;
              return { position, FID, ...item.values_.values_ };
            });
            source.clear();
            source.addFeatures(features);
          } else {
            this.$message.info("未查询到信息");
          }
        },
      });
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
      });
      style1 = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.85],
          scale: 0.2,
          opacity: 0.8,
          src: require("../assets/event1.png"),
        }),
      });
      layer.setStyle(style1);
      style2 = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.85],
          scale: 0.2,
          opacity: 0.9,
          src: require("../assets/event2.png"),
        }),
      });
      this.$map.addLayer(layer); //第一、加了图层
    },
    editToSql() {
      let attr = [];
      for (let key in this.form) {
        attr.push(this.form[key]);
      }
      Point.update({
        fid: this.pickFeature.id_,
        position: this.pickFeature.getGeometry().flatCoordinates,
        attr: attr,
        service: {
          name: "guanggu",
          layerId: 2,
        },
        callback: (data) => {
          if (data.succeed) {
            this.$message.success("修改成功");
            this.eventType = "query";
            this.$guigu.refresh();
            this.pickFeature = {};
            popup.setPosition(undefined);
            this.toSearch();
          }
        },
      });
    },
  },
  mounted() {
    this.initOverLay();
    this.initLayer();
  },
  destroyed() {
    this.$map.removeInteraction(draw);
    this.$map.removeLayer(layer);
    this.$map.getOverlays().clear();
  },
};
</script>
<style lang="scss">
.event {
  position: absolute;
  right: 4%;
  z-index: 999;
  top: 10vh;
}

.myTable {
  height: 33%;
  width: 68%;
  position: absolute;
  left: 16%;
  bottom: 4%;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 999;

  .el-table__cell {
    overflow: hidden;
    padding: 0;
  }

  td {
    div {
      padding: 0;
      font-size: 13px;
      text-align: center;
    }
  }

  th {
    div {
      height: 30px;
      line-height: 30px !important;
      text-align: center;
    }
  }

  tr:hover > td {
    background: #ccc !important;
    color: #333;
  }
}
</style>
