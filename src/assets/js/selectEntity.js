let Cesium = require("cesium/Cesium");
import PubSub from "pubsub-js"
export default class selectEntity {

  sFromsubmit
  xuhaoFromsubmit
  constructor(viewer) {
    this.viewer = viewer;
  }

  setS(sFromsubmit) {
    this.sFromsubmit = sFromsubmit
  }

  setXuhao(xuhaoFromsubmit){
    this.xuhaoFromsubmit = xuhaoFromsubmit
  }

  selectEntityHighLight() {
    //设置timer用来区分单击事件和双击事件
    let timer=null
    // Information about the currently selected feature
    let selected = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    };

    let nameOverlay = document.createElement("div");
    this.viewer.container.appendChild(nameOverlay);
    nameOverlay.className = "backdrop";
    nameOverlay.style.display = "none";
    nameOverlay.style.position = "absolute";
    nameOverlay.style.bottom = "0";
    nameOverlay.style.left = "0";
    nameOverlay.style["pointer-events"] = "none";
    nameOverlay.style.padding = "4px";
    nameOverlay.style.backgroundColor = "white";

    // An entity object which will hold info about the currently selected feature for infobox display
    let selectedEntity = new Cesium.Entity();

    // Get default left click handler for when a feature is not picked on left click
    // let clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
    // If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
    let silhouetteBlue =
      Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
    silhouetteBlue.uniforms.length = 0.01;
    silhouetteBlue.selected = [];

    this.viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
      ])
    );

    // Silhouette a feature blue on hover.
    // this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
    //   // If a feature was previously highlighted, undo the highlight
    //   silhouetteBlue.selected = [];
    //
    //   // Pick a new feature
    //   let pickedFeature = viewer.scene.pick(movement.endPosition);
    //   if (!(pickedFeature instanceof Cesium.Cesium3DTileFeature)) {
    //     nameOverlay.style.display = "none";
    //     return;
    //   }
    //
    //   nameOverlay.style.display = "block";
    //   nameOverlay.style.bottom =
    //     this.viewer.canvas.clientHeight - movement.endPosition.y + "px";
    //   nameOverlay.style.left = movement.endPosition.x + "px";
    //   nameOverlay.textContent = pickedFeature.getProperty("xuhao");
    //
    //   // Highlight the feature if it's not already selected.
    //   if (pickedFeature !== selected.feature) {
    //     silhouetteBlue.selected = [pickedFeature];
    //   }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {

      clearTimeout(timer)//清除定时器

      timer = window.setTimeout(()=> {
        let pickedFeature = this.viewer.scene.pick(movement.position);
        let tilesetFilename = ["fm", "gx"];
        let tilesetFile = [
          window.gx,
          window.fm,
        ];
        if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {

          let str = pickedFeature.tileset._url;
          let str1 = str.split("/");
          let name = pickedFeature.getProperty("name");
          let xh=pickedFeature.getProperty("xuhao")

          let sRed=[];
          let sXuhao=[];
          if(this.xuhaoFromsubmit) {
            sRed= [...this.sFromsubmit]
            sXuhao=[...this.xuhaoFromsubmit]
          }
          if (str1[0] === "gx") {

            let s = "${name}===" + "'" + name + "'";

            if(!this.sFromsubmit){
              let s1=[]
              this.pipelineStyle(s1,s)
            }else {
              if(xh){
                for(let i=0;i<sRed.length;i++){
                  if(sXuhao[i]===xh){
                    sRed.splice(i,1)
                    sXuhao.splice(i,1)
                    i--
                  }
                }
              }
              console.log(sRed);
              this.pipelineStyle(sRed,s)
            }
          } else if (str1[0] === "fm") {
            let s = "${name}===" + "'" + name + "'";
            this.fmStyle(s)
          }
          // selectedEntity.name = pickedFeature.getProperty("id");
          // selectedEntity.description =
          //   'Loading <div class="cesium-infoBox-loading"></div>';
          // this.viewer.selectedEntity = selectedEntity;
          // selectedEntity.description =
          //   '<table class="cesium-infoBox-defaultTable"><tbody>' +
          //   "<tr><th>name</th><td>" +
          //   pickedFeature.getProperty("name") +
          //   "</td></tr>" +
          //   "<tr><th>xuhao</th><td>" +
          //   pickedFeature.getProperty("xuhao") +
          //   "</td></tr>" +
          //   "<tr><th>id</th><td>" +
          //   pickedFeature.getProperty("id") +
          //   "</td></tr>" +
          //   "</tbody></table>";
        }
        // else {
        //   this.otherStyle()
        //   this.pipelineStyle()
        // }
      }, 200);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
      clearTimeout(timer)
      let pickedFeature = this.viewer.scene.pick(movement.position);
      if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
        PubSub.publish("leftDoubleclick",pickedFeature.getProperty("xuhao"))
      }
      // console.log(this.sFromsubmit);
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }

  pipelineStyle(s1,s2) {
    if (s1.length) {
      const conditions = s1.map(item => {
        return [item, 'rgb(170,9,65)']
      })
      window.gx.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            ...conditions,
            [s2,"rgb(245,214,10)"],
            [true, "rgba(158,183,208,0.5)"],
          ],
        },
      });
    } else {
      window.gx.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            [s2,"rgb(245,214,10)"],
            [true, "rgba(158,183,208,0.5)"],
          ],
        },
      });
    }
  };

  fmStyle(s){
    window.fm.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          [s, "rgb(4,56,213)"],
          [true, "rgb(29,220,197)"],
        ],
      },
    });
  }
}
