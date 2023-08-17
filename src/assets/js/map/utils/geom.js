/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2023-01-03 11:07:24
 * @company: 
 * @LastEditors: WQF
 * @LastEditTime: 2023-01-11 17:53:46
 * @Description: 
 * @$END: ===================
 */
import WKT from 'wkt'
import * as turf from '@turf/turf'


export function geoJson2Wkt(geojson) {
    return WKT.stringify(geojson)
}

export function wkt2GeoJson(wkt) {
    return WKT.parse(wkt)
}

export function wkt2coords(wkt) {
    var geojson = wkt2GeoJson(wkt)
    return geojson.geometry.coordinates
}

export function coords2Wkt(dim, coords) {
    var geojson = null
    switch (String(dim).toLowerCase()) {
        case '0'://POINT
        case 'point':
            geojson = turf.point(coords)//[x,y]
            geojson = turf.envelope(turf.buffer(geojson, 50, { units: 'meters' }))
            break;
        case '1'://LINESTRING
        case 'polyline':
            geojson = turf.lineString(coords)//[[x1,y1],[x2,y2],[x3,y3]...]
            break;
        case '2'://POLYGON
        case 'polygon':
            geojson = turf.polygon(coords)//[[[x1,y1],[x2,y2],[x3,y3]...]]
            break;
        default:
            break;
    }
    return geoJson2Wkt(geojson)
}
