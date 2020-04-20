# ol-map-screenshot

![Screenshot](https://github.com/jmmluna/ol-map-screenshot/blob/master/screenshot.jpg)

**ol-map-screenshot** is a simple and easy-to-use library to provide the [OpenLayers](https://openlayers.org/) map screenshot. ol-map-screenshot is inspired by [Map Export](https://openlayers.org/en/latest/examples/export-map.html) and [Export PDF](https://openlayers.org/en/latest/examples/export-pdf.html) examples by OpenLayers.

Currently, **ol-map-screenshot requires OpenLayers version 6.x**.

## Features ##
  - Promise-based API (**async/await**).
  - Customizable screenshot options using JSON format.
  - JPEG and PNG image format support.
  - Map scale bar rendering in the screenshot.
  - Screenshot metadata provided in the response.
  
## Usage ##
Install the ol-map-screenshot package using npm:

    npm i ol-map-screenshot

To use the library just import it into the application:

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

| name | value | Required | Description |
| --- | --- | --- | --- |
| `dim` | array | Y | Desired image size in **mm** [width, height]. |
| `showDisplayScale` | boolean | N | Map scale bar is displayed. Default is **false** |
| `format` | 'png' | N | Export format of the image. Default is **'jpeg'** |
| `resolution` | number | N | Screen resolution. Default is **150 dpi** |

## Screenshot response JSON object ##

| name | value | Description |
| --- | --- | --- |
| `img` | data:image/**format**;base64 | The base 64 image |
| `w` | number | Given image width in mm |
| `h` | number | Given image height in mm |
| `wPixel` | number | Image width value in pixels |
| `hPixel` | number | Image height value in pixels |
| `scaleBarValue` | number | Map scale bar value |
| `scaleLineValue` | number | Map scale line value |

## Example ##

[Live example](https://jmmluna.github.io/ol-map-screenshot/example/dist/)

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
    const element = document.createElement('a');
    element.setAttribute('href', response.img);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

async function doScreenshot() {
    const mapCurrentSize = map.getSize();
    const response = await olMapScreenshot.getScreenshot(map, mapScreenshotParam);
    map.setSize(mapCurrentSize);
    return response;
}
```
## Contributing ##
Build the library with npm run build. This will fetch all dependencies and then compile the dist files. To load the example locally, you can start a web server with npm start and go to localhost: 9000.