# ol-map-screenshot

![Screenshot](https://github.com/jmmluna/ol-map-screenshot/blob/master/screenshot.jpg)

**ol-map-screenshot** is a simple and easy-to-use library to facilitate the [OpenLayers](https://openlayers.org/) map screenshot. ol-map-screenshot is inspired by [Map Export](https://openlayers.org/en/latest/examples/export-map.html) and [Export PDF](https://openlayers.org/en/latest/examples/export-pdf.html) examples by OpenLayers.

Currently, **ol-map-screenshot requires OpenLayers version 6.x**.

## Features ##
  - Provide promise based API (**async/await**).
  - Customizable parameters in JSON format for screenshot.
  - Supported JPEG and PNG image format.
  - It has the advantage of allowing rendering the map scale bar in the screenshot.
  - Information associated in the screenshot response.
  
## Usage ##
For NodeJS

    npm i ol-map-screenshot

```js
import olMapScreenshot from 'ol-map-screenshot';
...
const mapScreenshotParam = {
    dim: [190, 160]
};

const response = await olMapScreenshot.getScreenshot(map, mapScreenshotParam);
//response is JSON object. response.img will store the image in base 64
...
```

## Screenshot parameters JSON object ##

| name | value | Required | Descripción |
| --- | --- | --- | --- |
| `dim` | array | Y | Represents the desired image size in **mm** [width, height]. |
| `showDisplayScale` | boolean | N | Indicates that the map scale bar is displayed. Default is **false** |
| `format` | 'png' | N | Indicates the export format of the image. Default is **'jpeg'** |
| `resolution` | number | N | Screen resolution. Default is **150 dpi** |

## Screenshot response JSON object ##

| name | value | Descripción |
| --- | --- | --- |
| `img` | data:image/**format**;base64 | The base 64 image |
| `w` | number | Original value given of the image width in mm |
| `h` | number | Original value given of the image height in mm |
| `wPixel` | number | Image width value in pixel |
| `hPixel` | number | Image height value in pixel |
| `scaleBarValue` | number | Map scale bar value |
| `scaleLineValue` | number | Map scale line value |

## Example ##
![Screenshot](https://github.com/jmmluna/ol-map-screenshot/blob/master/example-screenshot.png)

```js
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import olMapScreenshot from 'ol-map-screenshot';

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
    mapScreenshotParam.format = "jpeg";
    const response = await doScreenshot();
    createPDFDocument(response);
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
    const response = await doScreenshot();
    const link = document.getElementById('image-download');
    link.download = fileName;
    link.href = response.img;
    link.click();
}

async function doScreenshot() {
    const mapCurrentSize = map.getSize();
    const response = await olMapScreenshot.getScreenshot(map, mapScreenshotParam);
    map.setSize(mapCurrentSize);
    return response;
}
```