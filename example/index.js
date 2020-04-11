import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { MapExporter } from '../index';

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    target: 'map',
    view: new View({
        center: [-531626.1241455, 4563250.0861921],
        zoom: 14
    })
});

const mapExportParam = {
    dim: [190, 160],
    showDisplayScale: true
};

document.getElementById('export-jpeg').onclick = async() => {
    doDonwload('map-screenshot.jpg');
    // const data = await doScreenshot();
    // const link = document.getElementById('image-download');
    // link.download = "map-screenshot.jpg";
    // link.href = data.img;
    // link.click();
};

document.getElementById('export-png').onclick = async() => {
    mapExportParam.format = "PNG";
    doDonwload('map-screenshot.png');
    // const data = await doScreenshot();
    // const link = document.getElementById('image-download');
    // link.download = "map-screenshot.png";
    // link.href = data.img;
    // link.click();
};

document.getElementById('export-pdf').onclick = async() => {
    const data = await doScreenshot();
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont("times");
    pdf.setFontSize(16);
    pdf.setFontStyle("bold");
    pdf.text(10, 20, "ol-map-screenshop example!");
    pdf.addImage(data.img, 'JPEG', 10, 30, data.w, data.h);
    pdf.save('map-screenshot.pdf');
};

async function doDonwload(fileName) {
    const data = await doScreenshot();
    const link = document.getElementById('image-download');
    link.download = fileName;
    link.href = data.img;
    link.click();
}

async function doScreenshot() {
    const mapCurrentSize = map.getSize();
    const data = await MapExporter.getScreenshot(map, mapExportParam);
    map.setSize(mapCurrentSize);
    return data;
}