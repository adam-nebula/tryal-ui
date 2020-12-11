import * as PIXI from 'pixi.js';
import {get} from 'svelte/store';
import GraphingPaper from './papers/GraphingPaper';

export default class TryGraph {
    constructor(canvas, width, data = {}) {
        this.app = new PIXI.Application({
            view: canvas,
            backgroundColor: 0xFFFFFF,
            width: get(width),
            height: get(width),
            resizeTo: canvas,
        });
        
        
        const paper = new GraphingPaper(this, {
            x_range: [-10, 10],
            y_range: [-10, 10],
            origin: [0, 0],
            major_tick: 1,
            minor_tick: 0.2,
            scale: 'even'
        });
        canvas.addEventListener('wheel', event => {
            event.preventDefault();
            paper.setZoom(paper.getZoom() + (event.deltaY * 0.001));
        });

        //On mouse down
        canvas.addEventListener('mousedown', () => {
            //Add a movement listener
            const onMove = event => {
                const offset = paper.getOffset();
                paper.setOffset(offset[0] + event.movementX, offset[1] + event.movementY);
            }
            canvas.addEventListener('mousemove', onMove);

            //Remove it if the mouse up or leave events fire
            canvas.addEventListener('mouseup', () =>
                canvas.removeEventListener('mousemove', onMove));
            canvas.addEventListener('mouseleave', () =>
                canvas.removeEventListener('mousemove', onMove));
        })

        //Subscribe to changes in size
        width.subscribe(v => {
            paper.draw();
        });

        paper.draw();

    }
}