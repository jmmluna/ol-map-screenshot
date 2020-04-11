import { ScaleLine } from 'ol/control';

const SCALE_LINE_TARGET = 'scale-line';
const SCALE_BAR_TARGET = 'scale-bar';

class MapImageRenderer {

    getImage(param) {
        const map = param.map;
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = param.widthPixel;
        mapCanvas.height = param.heightPixel;
        const mapContext = mapCanvas.getContext('2d');
        Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), (canvas) => {
            if (canvas.width > 0) {
                const opacity = canvas.parentNode.style.opacity;
                mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                const transform = canvas.style.transform;
                const matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
                CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
                mapContext.drawImage(canvas, 0, 0);
            }
        });

        let mapImage = {};
        if (param.showDisplayScale) {
            const scaleInfo = this.createScaleMap(map, mapContext, mapCanvas, param.dinWidth);
            mapImage = { img: mapCanvas.toDataURL(param.format), scaleBarValue: scaleInfo.scaleBarValue, scaleLineValue: scaleInfo.scaleLineValue };
        } else
            mapImage = { img: mapCanvas.toDataURL(param.format) };

        return mapImage;
    }

    addScaletoCanvas(ctx, canvas, dinWidth, scaleBarValue, scaleLineValue) {
        const scaleBarValueFormat = '1 : ' + scaleBarValue;
        const line1 = 6;
        //Offset from the left
        const x_offset = 10;
        //offset from the bottom
        const y_offset = 30;
        const fontsize1 = 20;
        const font1 = fontsize1 + 'px Arial';
        // how big should the scale be (original css-width multiplied)
        const multiplier = 2;
        const scalewidth = parseInt(dinWidth, 10) * multiplier;

        //Scale Text
        ctx.beginPath();
        ctx.textAlign = "left";
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.font = font1;
        ctx.strokeText(scaleBarValueFormat, 20 + x_offset + fontsize1 / 2, canvas.height - y_offset - fontsize1 / 2);
        ctx.fillText(scaleBarValueFormat, 20 + x_offset + fontsize1 / 2, canvas.height - y_offset - fontsize1 / 2);

        //Scale Dimensions
        var xzero = scalewidth + x_offset;
        var yzero = canvas.height - y_offset;
        var xfirst = x_offset + scalewidth * 1 / 4;
        var xsecond = xfirst + scalewidth * 1 / 4;
        var xthird = xsecond + scalewidth * 1 / 4;
        var xfourth = xthird + scalewidth * 1 / 4;

        // Stroke
        ctx.beginPath();
        ctx.lineWidth = line1 + 2;
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#ffffff";
        ctx.moveTo(x_offset, yzero);
        ctx.lineTo(xzero + 1, yzero);
        ctx.stroke();

        //sections black/white
        ctx.beginPath();
        ctx.lineWidth = line1;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x_offset, yzero);
        ctx.lineTo(xfirst, yzero);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = line1;
        ctx.strokeStyle = "#FFFFFF";
        ctx.moveTo(xfirst, yzero);
        ctx.lineTo(xsecond, yzero);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = line1;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(xsecond, yzero);
        ctx.lineTo(xthird, yzero);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = line1;
        ctx.strokeStyle = "#FFFFFF";
        ctx.moveTo(xthird, yzero);
        ctx.lineTo(xfourth, yzero);
        ctx.stroke();

        ctx.beginPath();
        ctx.textAlign = "left";
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.font = font1;
        ctx.strokeText(scaleLineValue, xfourth + 5, yzero + 20);
        ctx.fillText(scaleLineValue, xfourth + 5, yzero + 20);
    }

    createScaleMap(map, mapContext, mapCanvas, dinWidth) {
        this.createScaleContainer();
        this._scaleLine = this.getScaleControl(false, SCALE_LINE_TARGET);
        this._scaleBar = this.getScaleControl(true, SCALE_BAR_TARGET);
        map.addControl(this._scaleLine);
        map.addControl(this._scaleBar);
        map.renderSync();
        const scaleBarValue = Math.round(this._scaleBar.getScaleForResolution()).toLocaleString();
        const scaleLineValue = document.getElementsByClassName("ol-scale-line-inner")[0].innerHTML;
        this.addScaletoCanvas(mapContext, mapCanvas, dinWidth, scaleBarValue, scaleLineValue);
        return { scaleBarValue: scaleBarValue, scaleLineValue: scaleLineValue }
    }

    createScaleContainer() {
        const scaleElement = document.createElement('div');
        scaleElement.style.display = 'none';
        const scaleBarElement = document.createElement('div');
        scaleBarElement.setAttribute('id', SCALE_BAR_TARGET);
        const scaleLineElement = document.createElement('div');
        scaleLineElement.setAttribute('id', SCALE_LINE_TARGET)

        scaleElement.appendChild(scaleBarElement);
        scaleElement.appendChild(scaleLineElement);
        document.body.appendChild(scaleElement);
    }

    getScaleControl(isBar, target) {
        return new ScaleLine({
            units: 'metric',
            bar: isBar,
            steps: 4,
            text: true,
            minWidth: 140,
            target: target
        });
    }
}

export default new MapImageRenderer();