import mapImageRenderer from './MapImageRenderer';

// 1 dpi = 1 Pixeles por Inch(25.4 mm)
const MM_x_DPI = 25.4;
const DEFAULT_RESOLUTION = 150; //dpi

class MapExporter {

    async getScreenshot(map, param) {
        const promise = new Promise((resolve, reject) => {
            const options = this.getOptions(map, param);
            if (options.validation) {
                reject({ message: options.validation });
                return;
            }

            const mapCurrentSize = map.getSize();
            this.setResolutionAndSize(map, options.widthPixel, options.heightPixel);

            map.once('rendercomplete', async() => {
                const mapImage = mapImageRenderer.getImage(options);
                map.setSize(mapCurrentSize);
                resolve({
                    img: mapImage.img,
                    w: options.w,
                    h: options.h,
                    wPixel: options.widthPixel,
                    hPixel: options.heightPixel,
                    scaleBarValue: mapImage.scaleBarValue,
                    scaleLineValue: mapImage.scaleLineValue
                });
            });
        });

        map.renderSync();
        return promise;
    }

    setResolutionAndSize(map, widthPixel, heightPixel) {
        var printSize = [widthPixel, heightPixel];
        map.setSize(printSize);
        var mapSize = map.getSize();
        var scaling = Math.min(widthPixel / mapSize[0], heightPixel / mapSize[1]);
        var viewResolution = map.getView().getResolution();
        map.getView().setResolution(viewResolution / scaling);
    }

    getOptions(map, param) {
        const size = map.getSize();
        let widthPixel = size[0];
        let heightPixel = size[1];
        param = param ? param : {};
        let scaleBarLength = param.scaleBarLength ? parseInt(param.scaleBarLength) : 140;
        let resolution = DEFAULT_RESOLUTION;
        if (param.resolution)
            resolution = param.resolution;
        let w = Math.round(widthPixel / resolution * MM_x_DPI);
        let h = Math.round(heightPixel / resolution * MM_x_DPI);

        if (param.dim) {
            if (!(param.dim instanceof Array))
                return { validation: "The dim parameter must be an array." }

            if (param.dim.length !== 2)
                return { validation: "The dim parameter must be an array of two elements [width x height]" }

            widthPixel = Math.round(param.dim[0] * resolution / MM_x_DPI);
            heightPixel = Math.round(param.dim[1] * resolution / MM_x_DPI);
            w = param.dim[0];
            h = param.dim[1];
        }

        let format = 'image/jpeg';
        if (param.format)
            format = param.format.toLowerCase() === 'PNG' ? 'image/png' : format;

        return {
            map: map,
            w: w,
            h: h,
            widthPixel: widthPixel,
            heightPixel: heightPixel,
            scaleBarLength: scaleBarLength,
            format: format,
            showDisplayScale: param.showDisplayScale === undefined ? true : param.showDisplayScale
        };
    }
}

export default new MapExporter();