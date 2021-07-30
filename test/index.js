import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import olMapScreenshot from "../index";

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    target: "map",
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

(async() => {
    try {
        doDonwload("map-screenshot", "png");
        // doDonwload("map-screenshot", "jpg");
    } catch (e) {
        alert("Error: " + e);
    }
})();

async function doDonwload(fileName, format) {
    const response = await olMapScreenshot.getScreenshot(map, { format: format });
    const element = document.createElement("a");
    element.setAttribute("href", response.img);
    element.setAttribute("download", `${fileName}.${format}`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}