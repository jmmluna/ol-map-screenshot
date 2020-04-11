import mapImageRenderer from './MapImageRenderer';

// 1 dpi = 1 Pixeles por Inch(25.4 mm)
const MM_x_DPI = 25.4;
const DEFAULT_RESOLUTION = 150; //dpi

class MapExporter {

    async getScreenshot(map, param) {

        const promise = new Promise((resolve, reject) => {
            const options = this.getOptions(map, param);
            if (options.validation)
                reject(options.validation);

            this.setResolutionAndSize(map, options.widthPixel, options.heightPixel);

            map.once('rendercomplete', async() => {
                const mapImage = mapImageRenderer.getImage(options);
                resolve({
                    img: mapImage.img,
                    w: param.dim[0],
                    h: param.dim[1],
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
        if (!param.dim)
            return { validation: "The dim parameter is required." }

        if (!(param.dim instanceof Array))
            return { validation: "The dim parameter must be an array." }

        if (param.dim.length !== 2)
            return { validation: "The dim parameter must be an array of two elements [width x height]" }

        let resolution = DEFAULT_RESOLUTION;
        if (param.resolution)
            resolution = param.resolution;

        const widthPixel = Math.round(param.dim[0] * resolution / MM_x_DPI);
        const heightPixel = Math.round(param.dim[1] * resolution / MM_x_DPI);

        let format = 'image/jpeg';
        if (param.format)
            format = param.format.toLowerCase() === 'PNG' ? 'image/png' : format;

        return {
            map: map,
            widthPixel: widthPixel,
            heightPixel: heightPixel,
            dinWidth: param.dim[0],
            format: format,
            showDisplayScale: param.showDisplayScale
        };
    }
}

export default new MapExporter();