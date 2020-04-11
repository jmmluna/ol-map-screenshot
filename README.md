# ol-map-screenshot
**ol-map-screenshot** is a simple and easy-to-use library to facilitate the [OpenLayers](https://openlayers.org/) map screenshot. ol-map-screenshot is inspired by [Map Export](https://openlayers.org/en/latest/examples/export-map.html) and [Export PDF](https://openlayers.org/en/latest/examples/export-pdf.html) examples by OpenLayers.

Currently, **ol-map-screenshot requires OpenLayers version 6.x**.

features
--------
  - Based on promises (**async/await**).
  - Customizable screenshot.
  - JPEG and PNG format supported.
  - It has the advantage of allowing rendering the map scale bar in the screenshot

## Usage ##
For node.js

    npm i ol-map-screenshot

```js
import olMapSreenshot from 'ol-map-screenshot';
...
const mapExportParam = {
    dim: [190, 160]
};

const response = await olMapSreenshot.getScreenshot(map, mapExportParam);
//response is JSON object. response.img will store the image in base 64
...
```

## Parameters ##

| name | value | Descripción |
| --- | --- | --- |
| `dim` | array | represents the desired image size in **mm** [width, height]. **Required** |
| `showDisplayScale` | boolean | indicates that the map scale bar is displayed. Default is **false** |
| `format` | 'png' | indicates the export format of the image. Default is **'jpeg'** |
| `resolution` | number | screen resolution. Default is **150 dpi** |

## Response object ##

| name | value | Descripción |
| --- | --- | --- |
| `img` | data:image/**format**;base64 | The base 64 image |
| `w` | number | original value given of the image width in mm |
| `h` | number | original value given of the image height in mm |
| `wPixel` | number | image width value in pixel |
| `hPixel` | number | image height value in pixel |
| `scaleBarValue` | number | map scale bar value |
| `scaleLineValue` | number | map scale line value |
