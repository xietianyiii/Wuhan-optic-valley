<template>
  <div></div>
</template>
<script>
let layer, source, draw;
export default {
  data() {
    return {};
  },
  methods: {
    initMeasuring() {
      source = new ol.source.Vector(); //图层数据源
      layer = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          //图层样式
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, 0.2)", //填充颜色
          }),
          stroke: new ol.style.Stroke({
            color: "#ffcc33", //边框颜色
            width: 2, // 边框宽度
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: "#ffcc33",
            }),
          }),
        }),
      });
      this.$map.addLayer(layer);
      this.$map.on("pointermove", this.pointerMoveHandler);
    },
    initDraw() {
      const type = this.$route.query.type == "area" ? "Polygon" : "LineString";
      draw = new ol.interaction.Draw({
        source: source, //测量绘制层数据源
        type: /** @type {ol.geom.GeometryType} */ (type), //几何图形类型
        style: new ol.style.Style({
          //绘制几何图形的样式
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new ol.style.Stroke({
            color: "rgba(0, 0, 0, 0.5)",
            lineDash: [10, 10],
            width: 2,
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: "rgba(0, 0, 0, 0.7)",
            }),
            fill: new ol.style.Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
          }),
        }),
      });
      draw.on(
        "drawstart",
        (evt) => {
          this.sketch = evt.feature; //绘制的要素
          let tooltipCoord = evt.coordinate; // 绘制的坐标
          //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
          this.listener = this.sketch.getGeometry().on("change", (evt) => {
            var geom = evt.target; //绘制几何要素
            var output;
            if (geom instanceof ol.geom.Polygon) {
              output = this.formatArea(/** @type {ol.geom.Polygon} */ (geom)); //面积值
              tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
            } else if (geom instanceof ol.geom.LineString) {
              output = this.formatLength(
                /** @type {ol.geom.LineString} */ (geom)
              ); //长度值
              tooltipCoord = geom.getLastCoordinate(); //坐标
            }
            this.measureTooltipElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
            this.measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
          });
        },
        this
      );
      draw.on(
        "drawend",
        (evt) => {
          this.measureTooltipElement.className = "tooltip tooltip-static"; //设置测量提示框的样式
          this.measureTooltip.setOffset([0, -7]);
          // unset sketch
          this.sketch = null; //置空当前绘制的要素对象
          // unset tooltip so that a new one can be created
          this.measureTooltipElement = null; //置空测量工具提示框对象
          this.createMeasureTooltip(); //重新创建一个测试工具提示框显示结果
          ol.Observable.unByKey(this.listener);
        },
        this
      );
      this.$map.addInteraction(draw);
    },
    pointerMoveHandler(evt) {
      if (evt.dragging) {
        return;
      }
      var helpMsg = "开始绘制"; //当前默认提示信息
      //判断绘制几何类型设置相应的帮助提示信息
      if (this.sketch) {
        const geom = this.sketch.getGeometry();
        if (geom instanceof ol.geom.Polygon) {
          helpMsg = "请连续点击绘制区域"; //绘制多边形时提示相应内容
        } else if (geom instanceof ol.geom.LineString) {
          helpMsg = "请连续点击绘制线段"; //绘制线时提示相应内容
        }
      }
      this.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
      this.helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
      this.removeClass("hidden", this.helpTooltipElement);
    },
    createMeasureTooltip() {
      if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(
          this.measureTooltipElement
        );
      }
      this.measureTooltipElement = document.createElement("div");
      this.measureTooltipElement.className = "tooltip tooltip-measure";
      this.measureTooltip = new ol.Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
      });
      this.$map.addOverlay(this.measureTooltip);
    },
    createHelpTooltip() {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
      }
      this.helpTooltipElement = document.createElement("div");
      this.helpTooltipElement.className = "tooltip hidden";
      this.helpTooltip = new ol.Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
      });
      this.$map.addOverlay(this.helpTooltip);
    },
    removeClass(kls, dom) {
      var klsReg = new RegExp(kls, "ig");
      for (var i = 0; i < dom.length; i++) {
        var node = dom[i];
        var klses = node.className;
        if (klsReg.test(klses)) {
          node.className = node.className.replace(kls, "");
        }
      }
    },
    formatArea(polygon) {
      var area;
      var sphere = new ol.Sphere();
      var sourceProj = this.$map.getView().getProjection(); //地图数据源投影坐标系
      var geom = /** @type {ol.geom.Polygon} */ (
        polygon.clone().transform(sourceProj, "EPSG:4326")
      ); //将多边形要素坐标系投影为EPSG:4326
      area = Math.abs(
        sphere.getArea(geom, { projection: sourceProj, radius: 6378137 })
      ); //获取面积
      var output;
      if (area > 10000) {
        output =
          Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>"; //换算成KM单位
      } else {
        output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>"; //m为单位
      }
      return output; //返回多边形的面积
    },
    formatLength(line) {
      var length;
      var sphere = new ol.Sphere();
      var sourceProj = this.$map.getView().getProjection(); //地图数据源投影坐标系
      length = sphere.getLength(line, {
        projection: sourceProj,
        radius: 6378137,
      });
      var output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km"; //换算成KM单位
      } else {
        output = Math.round(length * 100) / 100 + " " + "m"; //m为单位
      }
      return output; //返回线的长度
    },
  },
  mounted() {
    this.initMeasuring();
    this.initDraw();
    this.createMeasureTooltip();
    this.createHelpTooltip();
  },
  watch: {
    $route(to, from) {
      this.$map.removeInteraction(draw);
      draw = null;
      this.initDraw();
    },
  },
  destroyed() {
    this.$map.un("pointermove", this.pointerMoveHandler);
    this.$map.getOverlays().clear();
    this.$map.removeInteraction(draw);
    source.clear();
    this.$map.removeLayer(layer);
  },
};
</script>
<style lang="scss">
.el-notification {
  top: 70px !important;
}

.el-notification.right {
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
}

.tooltip-measure {
  opacity: 1;
  font-weight: bold;
}

.tooltip-static {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}

.tooltip-measure:before,
.tooltip-static:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: "";
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}

.tooltip-static:before {
  border-top-color: #ffcc33;
}
</style>
