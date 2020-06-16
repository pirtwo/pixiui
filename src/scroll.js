import * as PIXI from 'pixi.js';
import Sound from 'pixi-sound';
import PixiUI from './pixiui';

export default class Scroll extends PixiUI {
    /**
     * 
     * @param {object} arg
     * @param {number} arg.width
     * @param {number} arg.height
     * @param {boolean} arg.backdrop
     */
    constructor({
        width,
        height,
        areaWidth,
        areaHeight,
        frames,
        sounds
    }) {
        super({
            frames,
            sounds
        });

        this.areaWidth = areaWidth;
        this.areaHeight = areaHeight;
        this.maskWidth = width;
        this.maskHeight = height;

        this.body = new PIXI.Sprite(this.frames.body);
        this.body.width = areaWidth;
        this.body.height = areaHeight;

        // create x-axies scrollbar
        this.scrollbarX = new Scrollbar({
            value: 0,
            isVertical: false,
            multiplier: this.areaWidth - this.maskWidth,
            trackLength: this.maskWidth - 40,
            graspLength: this.maskWidth -
                (this.maskWidth * (this.areaWidth - this.maskWidth) / this.areaWidth),
            frames: frames,
            pointerMoveCallback: () => {
                console.log(this.scrollbarX.value)
                this.body.x = this.scrollbarX.value * -1;
            }
        }).setPosition(20, this.maskHeight - 10);


        //create y-axies scrollbar
        this.scrollbarY = new Scrollbar({
            value: 0,
            isVertical: true,
            multiplier: this.areaHeight - this.maskHeight,
            trackLength: this.maskHeight - 40,
            graspLength: this.maskHeight -
                (this.maskHeight * (this.areaHeight - this.maskHeight) / this.areaHeight),
            frames: frames,
            pointerMoveCallback: () => {
                console.log(this.scrollbarY.value);
                this.body.y = this.scrollbarY.value * -1;
            }
        }).setPosition(this.maskWidth - 10, 20);

        this.mask = this.getMask();
        this.addChild(this.body, this.scrollbarX, this.scrollbarY, this.mask);
    }

    getMask() {
        let mask = new PIXI.Graphics();
        mask.beginFill(0xFFFFFF);
        mask.drawRect(0, 0, this.maskWidth, this.maskHeight);
        mask.endFill();
        return mask;
    }
}


class Scrollbar extends PixiUI {
    constructor({
        value = 0,
        multiplier,
        trackLength,
        graspLength,
        isVertical = false,
        frames,
        sounds,
        pointerUpCallback,
        pointerDownCallback,
        pointerMoveCallback
    }) {
        super({
            frames,
            sounds,
            pointerUpCallback,
            pointerDownCallback,
            pointerUpOutsideCallback: pointerUpCallback
        });
        this.value = value;
        this.multiplier = multiplier;
        this.isVertical = isVertical;
        this.grasp = new PIXI.Sprite(this.frames.grasp);
        this.grasp.width = graspLength;
        this.grasp.height = 10;
        this.track = new PIXI.Sprite(this.frames.track);
        this.track.width = trackLength;
        this.track.height = 2;
        this._minX = 0;
        this._maxX = this.track.width - this.grasp.width;
        this.pointerMoveCallback = pointerMoveCallback;

        this.interactive = true;
        this.grasp.interactive = true;
        this.grasp.buttonMode = true;
        this.grasp.anchor.set(0, 0.5);
        this.grasp.position.set(0, 0);
        this.track.anchor.set(0, 0.5);
        this.track.position.set(0, 0);
        this.addChild(this.track, this.grasp);

        if (this.isVertical) {
            this.track.rotation = Math.PI / 2;
            this.grasp.rotation = Math.PI / 2;

        }

        this.grasp.on('pointerdown', e => {
            if (this.disabled) return;
            this.grasp.downPoint = {
                x: e.data.global.x,
                y: e.data.global.y
            };
            this.grasp.dragging = true;
            this.grasp.cursor = 'move';
        }).on('pointerup', () => {
            this.grasp.dragging = false;
            this.grasp.data = null;
            this.grasp.cursor = 'pointer';
        }).on('pointerupoutside', () => {
            this.grasp.dragging = false;
            this.grasp.data = null;
            this.grasp.cursor = 'pointer';
        }).on('pointermove', (e) => {
            if (!this.grasp.dragging) return;

            let cursorVelocity = 0;
            if (this.isVertical) {
                cursorVelocity = e.data.global.y - this.grasp.downPoint.y;
                if (this.grasp.y + cursorVelocity >= this._minX &&
                    this.grasp.y + cursorVelocity <= this._maxX
                ) {
                    this.grasp.y += cursorVelocity;
                    this.grasp.downPoint = {
                        x: e.data.global.x,
                        y: e.data.global.y
                    };
                    this.value = this.grasp.y * this.multiplier / (this.track.width - this.grasp.width);
                    if (this.pointerMoveCallback)
                        this.pointerMoveCallback();
                }
            } else {
                cursorVelocity = e.data.global.x - this.grasp.downPoint.x;
                if (this.grasp.x + cursorVelocity >= this._minX &&
                    this.grasp.x + cursorVelocity <= this._maxX
                ) {
                    this.grasp.x += cursorVelocity;
                    this.grasp.downPoint = {
                        x: e.data.global.x,
                        y: e.data.global.y
                    };
                    this.value = this.grasp.x * this.multiplier / (this.track.width - this.grasp.width);
                    if (this.pointerMoveCallback)
                        this.pointerMoveCallback();
                }
            }
        });
    }

    horizontal() {

    }

    vertical() {

    }
}