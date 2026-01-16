// Vector class for 2D physics calculations
export class Vector {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static createRandom(): Vector {
        const v = new Vector(0.5 - Math.random(), 0.5 - Math.random());
        v.normalise();
        return v;
    }

    static applyCalculation(a: Vector, b: number | Vector, calc: 'add' | 'sub' | 'scale'): Vector {
        const v = a.clone();
        v[calc](b as any);
        return v;
    }

    add(v: Vector): void {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v: Vector): void {
        this.x -= v.x;
        this.y -= v.y;
    }

    scale(n: number): void {
        this.x *= n;
        this.y *= n;
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y + v.y;
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalise(): void {
        const m = this.mag();
        if (m !== 0) {
            this.scale(1 / m);
        }
    }

    limit(max: number): void {
        if (this.mag() > Math.abs(max)) {
            this.normalise();
            this.scale(max);
        }
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    rotate(radians: number): void {
        this.x += Math.cos(radians);
        this.y += Math.sin(radians);
    }

    perpendicular(): void {
        const y = this.y;
        this.y = this.x;
        this.x = -y;
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }
}
