import {Application} from 'pixi.js';
import {get} from 'svelte/store';
import GraphingPaper from './papers/GraphingPaper';
import BoundBox from './components/BoundBox';
import ReferenceFrame from './papers/ReferenceFrame';
import Menu from './components/Menu.svelte';
import Slider from './components/Slider.svelte';
import InteractiveLayer from './Layers/InteractiveLayer';

export default class TryGraph {
    constructor(canvas, overlay, width, data = {}) {
        //Create a pixi application
        this.app = new Application({
            view: canvas,
            backgroundColor: 0xFFFFFF,
            width: get(width),
            height: get(width),
            resizeTo: canvas,
        });
        this.overlay = overlay;
        
        //Set crosshair on hover
        this.setCursor('crosshair');
        
        //Create the reference frame
        this.reference = new ReferenceFrame(this, {
            x_range: [-10, 10],
            y_range: [-10, 10],
            //limits dictate what the reported bounds are by the reference frame
            x_limit: [-10, 10], 
            y_limit: [-10, 10],
            origin: [0, 0],
        });
        
        //Create a bounding box
        this.target = new BoundBox(this, {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });
        
        //Create the paper
        this.paper = new GraphingPaper(this, {
            x_range: [-10, 10],
            y_range: [-10, 10],
            origin: [0, 0],
            major_tick: 1,
            minor_tick: 0.2,
            scale: 'even'
        });

        this.interactiveLayer = new InteractiveLayer(this, {});

        this.menu = new Menu({
            target: overlay,
            props: {
                functions: this.interactiveLayer.getActions(),
            }
        });

        //Subscribe to changes in size
        width.subscribe(v => {
            this.paper.draw();
        });

        this.draw();
    }

    reframe() {
        this.reference.compute();
    }

    
    draw(fixFrame = false) {
        if (!fixFrame) this.reference.compute();
        this.paper.draw();
        this.interactiveLayer.draw();
    }
    
    getDimensions() {
        return [this.app.view.width, this.app.view.height];
    }
    
    setCursor(cursor) {
        this.app.view.parentElement.style.cursor = cursor;
    }

    add(...args) {
        this.app.stage.addChild(...args);
    }

    remove(...args) {
        this.app.stage.removeChild(...args);
    }

    on(...args) {
        this.app.renderer.plugins.interaction.on(...args);
    }

    once(...args) {
        this.app.renderer.plugins.interaction.once(...args);
    }

    removeListener(...args) {
        this.app.renderer.plugins.interaction.removeListener(...args);
    }

    addGlobalListener(...args) {
        this.app.view.addEventListener(...args);
    }

    removeGlobalListener(...args) {
        this.app.view.removeEventListener(...args);
    }
}