# ol-map-screenshot
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
