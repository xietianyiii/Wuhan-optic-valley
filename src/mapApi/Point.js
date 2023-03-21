/* es6封装添加点 */
// const POINT_STYLE = {
//     Angle: 0, //角度
//     Color: 5,  //子图的颜色
//     Space: 0,
//     SymHeight: 3, //点的高度
//     SymID: 1, //子图号
//     SymWidth: 3 //点的宽度
// }
const HOST = 'localhost';
const PORT = 6163;
/**
 * @param {object} service  {name,layerId,host,port}
 */
class Point {
    add({
        position,
        attr,
        service,
        callback
    }) {
        /* 1、几何信息 */
        //创建一个点形状，描述点形状的几何信息
        var gpoint = new Zondy.Object.GPoint(position[0], position[1]); //createPoint();
        //设置当前点要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({
            PntGeom: [gpoint]
        });
        /* 2、图形参数 */
        //描述点要素的符号参数信息
        // var pointInfo = new Zondy.Object.CPointInfo(POINT_STYLE);
        //设置当前点要素的图形参数信息
        var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
            InfoType: 1,
            // PntInfo: pointInfo
        });
        /* 3、属性 */
        /* 4、几何+图形+属性 构建要素*/
        //创建一个要素
        var feature = new Zondy.Object.Feature({
            fGeom: fGeom,
            GraphicInfo: webGraphicInfo,
            AttValue: attr
        });
        //设置要素为点要素
        feature.setFType(1);
        //创建一个要素数据集
        /* 5、创建要素集添加要素 */
        var featureSet = new Zondy.Object.FeatureSet();
        //添加要素到要素数据集
        featureSet.addFeature(feature);
        /* 6、调用中地服务,添加要素 */
        //创建一个编辑服务类
        var editService = new Zondy.Service.EditDocFeature(service.name, service.layerId, {
            ip: "localhost",
            port: "6163" //访问IGServer的端口号，.net版为6163，Java版为8089
        });
        //执行添加点要素功能
        editService.add(featureSet, callback);
    }


    onPntSuccess(layer) {
        return function (data) {
            if (data.succeed) {
                alert("操作点要素成功！");
                layer.refresh();
            } else {
                alert("操作点要素失败！");
            }
        }
    }
    /* 查询 */
    query({
        position,
        service,
        callback
    }) {
        //1、创建一个用于查询的点形状
        var pointObj = new Zondy.Object.Point2D(position[0], position[1]);
        //设置查询点的搜索半径
        pointObj.nearDis = 0.01
        //2、初始化查询结构对象，告诉服务端查询结果中应该包含哪些信息
        var queryStruct = new Zondy.Service.QueryFeatureStruct()
        //是否包含几何图形信息
        queryStruct.IncludeGeometry = true;
        //是否包含属性信息
        queryStruct.IncludeAttribute = true;
        //是否包含图形显示参数
        queryStruct.IncludeWebGraphic = true;
        //3、创建查询规则
        var rule = new Zondy.Service.QueryFeatureRule({
            //是否将要素的可见性计算在内
            EnableDisplayCondition: false,
            //是否完全包含
            MustInside: false,
            //是否仅比较要素的外包矩形
            CompareRectOnly: false,
            //是否相交
            Intersect: true
        })
        //4、实例化查询参数对象
        var queryParam = new Zondy.Service.QueryParameter({
            geometry: pointObj,
            resultFormat: 'json',
            struct: queryStruct,
            rule: rule
        })
        //5、实例化地图文档查询服务对象
        var queryService = new Zondy.Service.QueryDocFeature(
            queryParam,
            service.name,
            service.layerId, {
            ip: service.host || HOST,
            port: service.port || PORT //访问IGServer的端口号, .net为6163,Java为8089
        }
        )
        queryService.query(callback)
    }

    update({
        fid,
        position,
        attr,
        service,
        callback
    }) {
        /* 1、确定修改的几何位置 */
        var gpoint = new Zondy.Object.GPoint(position[0], position[1]) // 修改位置
        /* 设置当前点要素的几何信息 */
        var fGeom = new Zondy.Object.FeatureGeometry({
            PntGeom: [gpoint]
        })
        /* 2、样式信息 */
        /* 2.2 设置样式信息 */
        // var pointInfo = new Zondy.Object.CPointInfo(POINT_STYLE)
        /* 设置当点要素的图形参数信息 */
        var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
            InfoType: 1, //点
            // PntInfo: pointInfo
        })
        /* 3、属性 */
        /* 4、设置要素 */
        var feature = new Zondy.Object.Feature({
            fGeom: fGeom, //坐标--几何信息
            GraphicInfo: webGraphicInfo, //样式信息
            AttValue: attr //属性
        })
        /* 设置要素为点要素 
        点 -->1
        线 -->2
        面 -->3
        */
        feature.setFType(1)
        feature.setFID(fid) //++
        /* 5、设置要素集,添加要素 */
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()
        /* 添加要素到要素数据集 */
        featureSet.addFeature(feature)
        /* 6、调用服务,执行更新 */
        /* 
    创建一个编辑服务类 
    第一个参数：服务的名称 第二参数：图层的名称
    */
        var editService = new Zondy.Service.EditDocFeature(service.name, service.layerId, {
            ip: 'localhost',
            port: '6163' //访问IGServer的端口号, .net为6163,Java为8089
        })
        //执行添加点要素功能
        editService.update(featureSet, callback)
    }
}
export default new Point()