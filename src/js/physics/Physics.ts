import { Vector } from './Vector.js';
import { Rectangle } from './Rectangle.js';

// Physics simulation class
export class Physics {
    mass: number;
    acceleration: Vector;
    velocity: Vector;
    location: Vector;
    bounds?: Rectangle;

    constructor(x: number, y: number) {
        this.mass = 1;
        this.acceleration = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.location = new Vector(x, y);
    }

    applyForce(force: Vector): void {
        const f = Vector.applyCalculation(force, 1 / this.mass, 'scale');
        this.acceleration.add(f);
    }

    setBounds(bounds: Rectangle): void {
        this.bounds = bounds;
    }

    checkBounds(): void {
        const predictedLocation = Vector.applyCalculation(this.location, this.velocity, 'add');
        if (!this.bounds!.containsX(predictedLocation)) {
            this.velocity.x *= -1;
        }
        if (!this.bounds!.containsY(predictedLocation)) {
            this.velocity.y *= -1;
        }
    }

    update(): void {
        this.velocity.add(this.acceleration);
        this.velocity.limit(10);
        if (this.velocity.mag() < 0.01) {
            this.velocity.scale(0);
        }
        this.checkBounds();
        this.location.add(this.velocity);
        this.acceleration.scale(0);
    }

    calculateGravity(gravity: Vector): Vector {
        gravity.scale(this.mass);
        return gravity;
    }

    calculateFriction(mu: number): Vector {
        const friction = this.velocity.clone();
        friction.normalise();
        friction.scale(-1);
        const mag = mu * 1;
        friction.scale(mag);
        return friction;
    }
}
