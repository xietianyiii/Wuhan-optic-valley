class Query {
    queryByGeom({
        geometry,
        service,
        callback,
    }, type = 'Rectangle') {
        var queryStruct = new Zondy.Service.QueryFeatureStruct();
        //是否包含几何图形信息
        queryStruct.IncludeGeometry = true;
        //是否包含属性信息
        queryStruct.IncludeAttribute = true;
        //是否包含图形显示参数
        queryStruct.IncludeWebGraphic = false;
        //创建一个用于查询的区
        var geomObj
        if (type == 'Circle') {
            geomObj = new Zondy.Object.Circle()
        } else {
            geomObj = new Zondy.Object.Polygon();
        }
        //将ol转化为mapgis的查询对象
        geomObj.setByOL(geometry);
        //指定查询规则
        var rule = new Zondy.Service.QueryFeatureRule({
            //是否将要素的可见性计算在内
            EnableDisplayCondition: false,
            //是否完全包含
            MustInside: false,
            //是否仅比较要素的外包矩形
            CompareRectOnly: false,
            //是否相交
            Intersect: true
        });
        //实例化查询参数对象
        var queryParam = new Zondy.Service.QueryParameter({
            geometry: geomObj,
            resultFormat: "json",
            struct: queryStruct,
            rule: rule
        });
        queryParam.recordNumber = 100;
        //实例化地图文档查询服务对象
        var queryService = new Zondy.Service.QueryDocFeature(queryParam, service.name, service.layerId, {
            ip: "localhost",
            port: "6163" //访问IGServer的端口号，.net版为6163，Java版为8089
        });
        //执行查询操作，querySuccess为查询回调函数
        queryService.query(callback);
    }

    queryBySQL({
        where,
        service,
        callback
    }) {
        //1-1设置查询结构
        const queryStruct = new Zondy.Service.QueryFeatureStruct();
        queryStruct.IncludeGeometry = true;
        queryStruct.IncludeWebGraphic = true
        const queryParam = new Zondy.Service.QueryParameter({
            struct: queryStruct
        })
        queryParam.where = where
        /* 1-3、调用查询服务 */
        const queryService = new Zondy.Service.QueryDocFeature(
            queryParam,
            service.name,
            service.layerId, {
            ip: 'localhost',
            port: 6163
        }
        )
        queryService.query(callback)
    }

    queryByFID({
        fid,
        service,
        callback
    }) {
        //1-1设置查询结构
        const queryStruct = new Zondy.Service.QueryFeatureStruct();
        queryStruct.IncludeGeometry = true;
        queryStruct.IncludeWebGraphic = true
        const queryParam = new Zondy.Service.QueryParameter({
            struct: queryStruct,
            objectIds: fid
        })
        /* 1-3、调用查询服务 */
        const queryService = new Zondy.Service.QueryDocFeature(
            queryParam,
            service.name,
            service.layerId, {
            ip: 'localhost',
            port: 6163
        }
        )
        queryService.query(callback)
    }
}
export default new Query()