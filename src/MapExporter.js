import mapImageRenderer from './MapImageRenderer';

const RESOLUTION_DPI = 150;

class MapExporter {

    async getScreenshot(map, param) {

        const promise = new Promise((resolve) => {
            const options = this.getOptions(map, param);
            this.setResolutionAndSize(map, options.widthPixel, options.heightPixel);

            map.once('rendercomplete', async() => {
                const mapImage = mapImageRenderer.getImage(options);
                resolve({ img: mapImage.img, w: param.dim[0], h: param.dim[1], printerScale: mapImage.scaleBarValue });
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
        const widthPixel = Math.round(param.dim[0] * RESOLUTION_DPI / 25.4);
        const heightPixel = Math.round(param.dim[1] * RESOLUTION_DPI / 25.4);
        const format = param.format === 'PNG' ? 'image/png' : 'image/jpeg';

        return {
            map: map,
            widthPixel: widthPixel,
            heightPixel: heightPixel,
            dinWidth: param.dim[0],
            format: format,
            showDisplayScale: true
        };
    }
}

export default new MapExporter();