import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import Button from './button';
import Checkbox from './checkbox';
import Slider from './slider';
import Panel from './panel';
import Scroll from './scroll';

const app = new PIXI.Application({
    width: 900,
    height: 700,
    backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

app.loader.add('tileset', '/assets/sprites/ui.json').load(setup);

function setup(loader, resources) {
    // game setup  

    let tileset = resources.tileset.textures;

    let btnFrames = {
        button: tileset['blue_button02.png'],
        buttonDisabled: tileset['grey_button02.png'],
        pointerdown: tileset['blue_button05.png'],
        pointerup: tileset['blue_button04.png'],
        pointerover: tileset['blue_button04.png'],
        pointerout: tileset['blue_button02.png']
    }

    let checkboxFrames = {
        box: tileset['grey_box.png'],
        boxDisabled: tileset['grey_box.png'],
        checkmark: tileset['green_checkmark.png'],
        checkmarkDisabled: tileset['grey_checkmarkGrey.png']
    }

    let sliderFrames = {
        rail: tileset['grey_sliderHorizontal.png'],
        grip: tileset['blue_circle.png']
    }

    let btn = new Button({
        text: new PIXI.Text('CLICK ME'),
        frames: btnFrames,
        pointerTapCallback: (e) => {
            console.log('click');
        }
    }).setPosition(10, 10);

    let checkbox = new Checkbox({
        checked: true,
        frames: checkboxFrames
    }).setPosition(10, 100);

    let slider = new Slider({
        value: 50,
        width: 100,
        min: 0,
        max: 100,
        frames: sliderFrames,
        pointerUpCallback: () => {
            console.log(slider.value)
        }
    }).setPosition(10, 200);

    let panel = new Panel({
        width: 200,
        height: 200,
        frames: {
            body: tileset['yellow_panel.png']
        }
    }).setPosition(300, 50);
    
    let grasp = new PIXI.Graphics();
    grasp.beginFill(0xffffff);
    grasp.drawRect(0, 0, 10, 5);
    grasp.endFill();

    let track = new PIXI.Graphics();
    track.lineStyle(1, 0xfff555);
    track.moveTo(0, 0);
    track.lineTo(0, 10);
    track.closePath();

    let scroll = new Scroll({
        width: 200,
        height: 200,
        areaWidth: 1000,
        areaHeight: 2000,
        frames: {
            body: tileset['yellow_panel.png'],
            grasp: app.renderer.generateTexture(grasp),
            track: app.renderer.generateTexture(track)
        }
    }).setPosition(300, 300);

    app.stage.addChild(btn, checkbox, slider, panel, scroll);
}

function update(delta) {
    // game loop
}

app.ticker.add((delta) => {
    update(delta);
});