import {Loader, Sprite} from 'pixi.js';

const img = "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"

export default class BackgroundPaper {
    constructor(trygraph, image, options) {
        this.trygraph = trygraph;
        this.options = options;
        const loader = new Loader();
        loader.add('cat', `data:image/png;base64,${image ? image : img}`).load(() => {
            this.graphic = new Sprite(loader.resources['cat'].texture);
            this.graphic.position.set(0, 800 - this.graphic.height);
            this.trygraph.add(this.graphic);
        });
    }
    
    draw() {
    }
}