<template>
  <div id="app">
    <Header></Header>
    <LeftTree></LeftTree>
    <router-view class="inMap"></router-view>
    <div id="map_container">
      <div id="mouse-position"></div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Header from "./components/Header.vue";
import LeftTree from "./components/LeftTree.vue";

export default {
  components: {
    Header,
    LeftTree,
  },
  mounted: function () {
    const docLayer = new Zondy.Map.Doc("", "guanggu", {
      host: "localhost",
      port: 6163,
    });

    const TianDiMap_vec = new ol.layer.Tile({
      title: "天地图矢量图层",
      source: new ol.source.XYZ({
        url:
          "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" +
          "8a5c2b00e94b49659861e064c37f778d",
        wrapX: false,
      }),
    });
    const TianDiMap_cva = new ol.layer.Tile({
      title: "天地图矢量注记图层",
      source: new ol.source.XYZ({
        url:
          "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" +
          "8a5c2b00e94b49659861e064c37f778d",
        wrapX: false,
      }),
    });
    // const gaodeMapLayer = new ol.layer.Tile({
    //   title: "高德地图",
    //   source: new ol.source.XYZ({
    //     url: "http://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    //     wrapX: false,
    //   }),
    // });
    const map = new ol.Map({
      target: "map_container",
      layers: [TianDiMap_vec, TianDiMap_cva, docLayer],
      view: new ol.View({
        projection: "EPSG:4326",
        center: [114.38, 30.49],
        zoom: 13,
      }),
    });

    // 1. 视图跳转控件
    const ZoomToExtent = new ol.control.ZoomToExtent({
      extent: [114.254, 34.43, 114.5, 34.55],
    });
    map.addControl(ZoomToExtent);

    const mousePositionControl = new ol.control.MousePosition({
      /* 坐标格式 */
      coordinateFormat: ol.coordinate.createStringXY(2),
      projection: "EPSG:4326",
      /* 坐标信息显示样式类名,默认是'ol-mouse-position' */
      className: "custom-mouse-position",
      target: document.getElementById("mouse-position"),
      undefinedHTML: "&nbsp",
    });
    map.addControl(mousePositionControl);

    const overviewMapControl = new ol.control.OverviewMap({
      /* 鹰眼控件样式  */
      className: "ol-overviewmap ol-custom-overviewmap gdSl",
      layers: [TianDiMap_vec],
      /* 鹰眼控件展开时功能按钮上的标识(网页的JS的字符编码) */
      collapseLabel: "\u00BB",
      /* 鹰眼控件折叠时功能按钮上的标识(网页的JS的字符编码) */
      label: "\u00AB",
      /* 初始为展开显示方式 */
      collapsed: false,
      view: new ol.View({
        projection: "EPSG:4326",
      }),
    });
    map.addControl(overviewMapControl);
    Vue.prototype.$map = map;
    Vue.prototype.$guigu = docLayer;
  },
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

#app {
  width: 100vw;
  height: 100wh;
  overflow: hidden;
  box-sizing: content-box;

  #map_container {
    width: 100vw;
    height: 100vh;

    .ol-zoom {
      top: 5rem;
      left: auto;
      right: 0.5rem;
    }

    .ol-zoom-extent {
      top: 9rem;
      left: auto;
      right: 0.5rem;
    }

    .custom-mouse-position {
      z-index: 999;
      left: 50%;
      transform: translateX(-50%);
      position: fixed;
      bottom: 4px;
      color: red;
      font-size: 16px;
      font-family: "微软雅黑";
    }

    .gdSl {
      border: 2px solid rgb(18, 156, 236);
    }

    .inMap {
      position: absolute;
    }

    .ol-control {
      padding: 0;
    }

    .ol-overviewmap-map {
      width: 80px;
      height: 80px;
      position: relative;
      margin: 0;
      padding: 0;
    }

    .ol-custom-overviewmap {
      height: 82px;
      right: 0.3rem;
      bottom: 0.3rem;
      top: auto;
      left: auto;
    }

    .ol-overviewmap {
      button {
        display: none;
      }
    }
  }
}
</style>
