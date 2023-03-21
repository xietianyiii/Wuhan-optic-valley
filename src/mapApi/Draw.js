/**
 * 根据类型创建画笔
 * @param {object} source ol.source 数据源对象
 * @param {string} type 画笔的类型 ['Point', 'LineString', 'Circle', 'Polygon', 'Square', 'Box']
 * @param {function} callback 绘制完成的回调函数
 * @returns {ol.interaction.Draw} draw
 */
function createDraw({ source, type = "Point", callback }) {
    let draw = null
    let geometryFunction = null
    let maxPoints = 0
    if (type == 'Square') {
        type = 'Circle'
        geometryFunction = ol.interaction.Draw.createRegularPolygon(4)
    } else if (type == 'Rectangle') {
        type = 'LineString'
        geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
                //多边形
                geometry = new ol.geom.Polygon(null)
            }
            var start = coordinates[0]
            var end = coordinates[1]
            geometry.setCoordinates([
                [
                    [start[0], start[1]],
                    [start[0], end[1]],
                    end,
                    [end[0], start[1]],
                    start,
                ],
            ])
            return geometry
        }
        maxPoints = 2
    }

    draw = new ol.interaction.Draw({
        source: source,
        type: type,
        geometryFunction: geometryFunction,
        maxPoints: maxPoints,
    })

    // callback && draw.on('drawend', callback)

    if (callback) {
        draw.on('drawend', callback)
    }

    return draw
}

export default createDraw