import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import olMapScreenshot from '../index';

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

const mapScreenshotParam = {
    dim: [190, 160],
    showDisplayScale: true
};

document.getElementById('export-jpeg-button').onclick = async() => {
    doDonwload('map-screenshot.jpg');
};

document.getElementById('export-png-button').onclick = async() => {
    mapScreenshotParam.format = "png";
    doDonwload('map-screenshot.png');
};

document.getElementById('export-pdf-button').onclick = async() => {
    showloader(true);
    mapScreenshotParam.format = "jpeg";
    const response = await doScreenshot();
    createPDFDocument(response);
    showloader(false);
};

function createPDFDocument(data) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont("times");
    pdf.setFontSize(16);
    pdf.setFontStyle("bold");
    const title = "ol-map-screenshop example!";
    const pageWidth = pdf.internal.pageSize.width;
    const titleLength = (pdf.getTextDimensions(title).w / (72 / 25.6)) + 2;
    pdf.text((pageWidth / 2) - titleLength, 20, title);
    pdf.setFontSize(10);
    pdf.setFontStyle("italic");
    pdf.text(10, 28, "Location: Córdoba, Andalucia, España");
    pdf.addImage(data.img, 'JPEG', 10, 30, data.w, data.h);
    pdf.save('map-screenshot.pdf');
}

async function doDonwload(fileName) {
    showloader(true);
    const response = await doScreenshot();
    const element = document.createElement('a');
    element.setAttribute('href', response.img);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showloader(false);
}

async function doScreenshot() {
    const mapCurrentSize = map.getSize();
    const response = await olMapScreenshot.getScreenshot(map, mapScreenshotParam);
    map.setSize(mapCurrentSize);
    return response;
}

function showloader(visible) {
    const loader = document.getElementById('loader');
    if (visible)
        loader.style.display = 'block';
    else
        loader.style.display = 'none';
}