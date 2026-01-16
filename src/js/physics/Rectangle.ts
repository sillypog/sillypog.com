// Rectangle class for bounds checking
export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    containsX(p: { x: number }): boolean {
        if (p.x < this.x || p.x > this.width) {
            return false;
        }
        return true;
    }

    containsY(p: { y: number }): boolean {
        if (p.y < this.y || p.y > this.height) {
            return false;
        }
        return true;
    }
}
