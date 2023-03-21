<template>
  <div>
    <div id="popup" class="ol-popup">
      <a
        @click="toClose"
        href="#"
        id="popup-closer"
        class="ol-popup-closer"
      ></a>
      <div id="popup-content" ref="myContent">
        <h5>{{ where }}</h5>
        <!-- <video :src="videoUrl"></video> -->
        <video
          autoplay
          width="100%"
          height="100%"
          src="../assets/video.mp4"
        ></video>
      </div>
    </div>
  </div>
</template>
<script>
import mapQuery from "@/mapApi/Query";
let layer, popup;
export default {
  // 双向绑定数据
  data() {
    return {
      where: "",
      videoUrl: "",
    };
  },
  methods: {
    toClose() {
      popup.setPosition(undefined);
    },
    initData() {
      const source = new ol.source.Vector({});
      layer = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          image: new ol.style.Icon({
            scale: 0.2,
            opacity: 1,
            src: require("../assets/video.png"),
          }),
        }),
      });
      this.$map.addLayer(layer); //第一、加了图层
      mapQuery.queryBySQL({
        where: "",
        service: {
          name: "guanggu",
          layerId: 3,
        },
        callback: (res) => {
          const format = new Zondy.Format.PolygonJSON();
          const features = format.read(res);
          source.addFeatures(features);
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
      this.$map.on("click", this.toClick); //第三、加了地图的点击事件
      this.$map.on("pointermove", this.toMove); //第四、加了鼠标的移动事件
    },
    toClick(e) {
      const feature = this.$map.forEachFeatureAtPixel(
        e.pixel,
        function (feature, layer) {
          return feature;
        }
      );
      if (feature) {
        const position = feature.getGeometry().flatCoordinates;
        popup.setPosition(position);
        this.$map.getView().animate({
          center: position,
          zoom: 16,
          duration: 2000,
        });
        this.where = feature.values_.values_.位置;
        this.videoUrl = feature.values_.values_.URL;
      }
    },
    toMove(e) {
      const pixel = this.$map.getEventPixel(e.originalEvent);
      const hit = this.$map.hasFeatureAtPixel(pixel);
      this.$map.getTargetElement().style.cursor = hit ? "pointer" : "";
    },
  },
  mounted() {
    this.initData();
    this.initOverLay();
  },
  destroyed() {
    this.$map.removeLayer(layer);
    this.$map.getOverlays().clear();
    this.$map.un("click", this.toClick);
    this.$map.un("pointermove", this.toMove);
  },
};
</script>
<style lang="scss">
.ol-popup {
  width: 300px;
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 45px;
  left: -50px;
  z-index: 998;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "✖";
}

#popup-content {
  font-size: 14px;
  font-family: "微软雅黑";
}
</style>
