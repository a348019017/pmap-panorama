
import { EquirectangularTilesAdapter } from "photo-sphere-viewer/dist/adapters/equirectangular-tiles";
import { Viewer } from "photo-sphere-viewer";
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import { GalleryPlugin } from "photo-sphere-viewer/dist/plugins/gallery";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import "photo-sphere-viewer/dist/plugins/markers.css";
import "photo-sphere-viewer/dist/plugins/gallery.css";

/**
 * Cesium卷帘封装类，除UI外封装一些内部功能,仅仅仅只包含左右的卷帘
 */
export class PanoramaViewer {



   /***
      * 构造全景图插件
      * 
      * @param {String} div 
      * @param {Object} option 
      * 
      */
  constructor(div, option) {
    let cfg = {
      adapter: EquirectangularTilesAdapter,
      container: document.getElementById(div),
      caption: "全景图",
      navbar: ["autorotate", "zoom", "caption", "fullscreen", "gallery"],
      plugins: [
        [MarkersPlugin, {}],
        [
          GalleryPlugin,
          {
            visibleOnLoad: true,
          },
        ],
      ],
    };

    this.PSV = new Viewer(cfg);

    //传入数据所在根目录
    this.baseUrl2 = option.baseUrl ? option.baseUrl : "";

    //默认加载第一个
    // if(imagescfg&&imagescfg.length>0)
    // {
    //    this.curphoto=this.curphotos.images[0];
    //    cfg.panorama=imagescfg[0].panorama;
    // }
    // this.PSV = new Viewer(cfg);

    this.PSV.on("panorama-loaded", () => {
      this.changepano(this.PSV.config.panorama.name);
    });
  }

  //加载数据,传入配置文件，配置文件记录相关信息
  load(url) {
    //默认加载第一组
  }

  //加载全部数据
  loadDatas(metadata) {
    let that = this;
    let imagescfg = this.curphotos.images.map((c) => {
      return that.image2config(c, that.curphotos.name);
    });
  }

  //加载单组数据
  loadData(metadata) {
    let that = this;
    let imagescfg = metadata.images.map((c) => {
      return that.image2config(c, metadata.name);
    });
    //获取到
    const galleryPlugin = this.PSV.getPlugin(GalleryPlugin);
    galleryPlugin.setItems(imagescfg);

    this.PSV.setPanorama(imagescfg[0].panorama);
    this.curphotos = metadata;
  }

  //切换全景图时,需要切换标注
  changepano(item) {
    this.curphoto = this.curphotos.images.find((i) => i.imagename == item);
    this.initpoi();
  }
  initpoi() {
    const markersPlugin = this.PSV.getPlugin(MarkersPlugin);
    markersPlugin.clearMarkers();
    //加载内置定义的markers，否则可能加载失败
    if (this.curphoto) {
      if (this.curphoto.markers) {
        this.curphoto.markers.forEach((p) => {
          markersPlugin.addMarker(p);
        });
      }
      //查询此全景图附近的POI，然后转换成MarkList然后添加进去，先只计算水平方向的offsetdebgre，放在中间，看是否准确。
      // this.onQueryNearby({ lon: this.curphoto.lonlat[0], lat:this.curphoto.lonlat[1] }, 3000, "超市", this.resultList3);
      // this.onQueryNearby({ lon: this.curphoto.lonlat[0], lat:this.curphoto.lonlat[1] }, 3000, "医院", this.resultList2);
      // this.onQueryNearby({ lon: this.curphoto.lonlat[0], lat:this.curphoto.lonlat[1] }, 3000, "学校", this.resultList);
    }
  }

  image2config(item, dkname) {
    let isusetile = false;
    item ? (isusetile = item.usetile) : undefined;

    return {
      id: item.imagename,
      name: item.imagename,
      thumbnail: `${this.baseUrl2}${dkname}/${item.imagename}/${item.imagename}_low.JPG`,
      panorama: {
        name: item.imagename,
        width: 8192,
        cols: 8,
        rows: 4,
        baseUrl: `${this.baseUrl2}${dkname}/${item.imagename}/${item.imagename}_low.JPG`,
        tileUrl: (col, row) => {
          return `${this.baseUrl2}${dkname}/${item.imagename}/row-${
            row + 1
          }-column-${col + 1}.jpg`;
        },
      },
      // option:{
      //   width: 8192,
      //   cols: 8,
      //   rows: 4,
      //   baseUrl: `${this.baseUrl2}${item.imagename}/${item.imagename}_low.JPG`,
      //   tileUrl: (col, row) => {
      //     return `${this.baseUrl2}${item.imagename}/row-${row+1}-column-${col+1}.jpg`;
      //   }
      // },
    };
  }
}
