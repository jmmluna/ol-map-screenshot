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
  
## Basic usage ##
Install the ol-map-screenshot package using npm:

    npm i ol-map-screenshot

To use the library just import it into the application:

```js
import olMapScreenshot from 'ol-map-screenshot';

const response = await olMapScreenshot.getScreenshot(map);
//response is JSON object. response.img will store the image in base 64
...
```
By default, the screenshot is the map size.

## Option usage ##
Parameters can be specified to customize map screenshot:
```js
import olMapScreenshot from 'ol-map-screenshot';

const response = await olMapScreenshot.getScreenshot(map, {
    dim: [190, 160], 
    scaleBarLength: 100
});

```

## Screenshot parameters JSON object ##

| name | value | Required | Description |
| --- | --- | --- | --- |
| `dim` | array | N | Desired image size in **mm** [width, height]. |
| `showDisplayScale` | boolean | N | Map scale bar is displayed. Default is **true** |
| `scaleBarLength` | number | N | Map scale bar length. Default is **140 px** |
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

## CORS ##
For security reasons, a browser can mark a canvas as tainted when you load images from another domain. In that case the browser blocks canvas exporting. To avoid this block, the **tileLoadFunction** property is set when creating the tile layer.

```js
getWMSLayer(layer) {
        return new TileLayer({
            title: layer.title,
            source: new TileWMS({
                url: layer.url,
                params: {
                    LAYERS: layer.name,
                    SRS: 'EPSG:3857',
                    FORMAT: 'image/png'
                },
                tileLoadFunction: proxyTileLoader.load
            }),
            visible: true
        });
    }
```
The **ProxyTileLoader.js** file is defined below:
```js
const proxy = "...?url="; //set proxy url

module.exports = {    
    load: function(tile, src) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", proxy + encodeURIComponent(src).replace(/'/g, "%27").replace(/"/g, "%22"));
        xhr.responseType = "arraybuffer";

        xhr.onload = function() {
            var arrayBufferView = new Uint8Array(this.response);
            var blob = new Blob([arrayBufferView], { type: 'image/png' });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            tile.getImage().src = imageUrl;
        };
        xhr.onerror = function() {
            console.log("ERROR loading tiles from proxy.");
        };

        xhr.send();
    }
};
```

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
    dim: [190, 160]
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
    try {
        return await olMapScreenshot.getScreenshot(map, mapScreenshotParam);
    } catch (ex) {
        showloader(false);
        alert(ex.message);
    }
}
```
## Contributing ##
Build the library with npm run build. This will fetch all dependencies and then compile the dist files. To load the example locally, you can start a web server with npm start and go to localhost: 9000.