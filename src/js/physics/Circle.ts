import { Physics } from './Physics.js';

// jQuery element type for the $ property
interface JQueryElement {
    css(props: { left: number; top: number }): JQueryElement;
    width(): number;
}

// Circle display class with physics
export class Circle {
    physics: Physics;
    $: JQueryElement;

    constructor(x: number, y: number, $element: JQueryElement) {
        console.log('Circle: constructor', x, y);
        this.physics = new Physics(x, y);
        this.$ = $element.css({
            left: x,
            top: y
        });
    }

    radius(): number {
        return this.$.width() / 2;
    }

    update(): void {
        this.physics.update();
        this.$.css({
            left: this.physics.location.x,
            top: this.physics.location.y
        });
    }
}
