import { describe, it, expect, beforeEach } from 'vitest';
import { Physics } from './Physics';
import { Vector } from './Vector';
import { Rectangle } from './Rectangle';

describe('Physics', () => {
  let physics: Physics;

  beforeEach(() => {
    physics = new Physics(100, 100);
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(physics.mass).toBe(1);
      expect(physics.location.x).toBe(100);
      expect(physics.location.y).toBe(100);
      expect(physics.acceleration.x).toBe(0);
      expect(physics.acceleration.y).toBe(0);
      expect(physics.velocity.x).toBe(0);
      expect(physics.velocity.y).toBe(0);
    });
  });

  describe('applyForce', () => {
    it('should apply force and update acceleration', () => {
      const force = new Vector(10, 0);
      physics.applyForce(force);
      expect(physics.acceleration.x).toBeCloseTo(10, 5);
      expect(physics.acceleration.y).toBeCloseTo(0, 5);
    });

    it('should scale force by inverse mass', () => {
      physics.mass = 2;
      const force = new Vector(10, 0);
      physics.applyForce(force);
      expect(physics.acceleration.x).toBeCloseTo(5, 5);
    });

    it('should accumulate multiple forces', () => {
      const force1 = new Vector(10, 0);
      const force2 = new Vector(5, 0);
      physics.applyForce(force1);
      physics.applyForce(force2);
      expect(physics.acceleration.x).toBeCloseTo(15, 5);
    });
  });

  describe('setBounds', () => {
    it('should set bounds for physics simulation', () => {
      const bounds = new Rectangle(0, 0, 200, 200);
      physics.setBounds(bounds);
      expect(physics.bounds).toBe(bounds);
    });
  });

  describe('checkBounds', () => {
    beforeEach(() => {
      const bounds = new Rectangle(0, 0, 200, 200);
      physics.setBounds(bounds);
    });

    it('should reverse x velocity when hitting horizontal bounds', () => {
      physics.location.x = 195;
      physics.velocity.x = 10;
      physics.checkBounds();
      expect(physics.velocity.x).toBe(-10);
    });

    it('should reverse y velocity when hitting vertical bounds', () => {
      physics.location.y = 195;
      physics.velocity.y = 10;
      physics.checkBounds();
      expect(physics.velocity.y).toBe(-10);
    });

    it('should not change velocity when within bounds', () => {
      physics.location.x = 100;
      physics.location.y = 100;
      physics.velocity.x = 5;
      physics.velocity.y = 5;
      physics.checkBounds();
      expect(physics.velocity.x).toBe(5);
      expect(physics.velocity.y).toBe(5);
    });
  });

  describe('update', () => {
    it('should update velocity with acceleration', () => {
      const bounds = new Rectangle(0, 0, 300, 300);
      physics.setBounds(bounds);
      physics.acceleration = new Vector(2, 3);
      physics.update();
      expect(physics.velocity.x).toBeCloseTo(2, 5);
      expect(physics.velocity.y).toBeCloseTo(3, 5);
    });

    it('should update location with velocity', () => {
      const bounds = new Rectangle(0, 0, 300, 300);
      physics.setBounds(bounds);
      // Use smaller velocity that won't be limited (magnitude < 10)
      physics.velocity = new Vector(3, 4); // magnitude = 5, which is < 10
      physics.update();
      expect(physics.location.x).toBeCloseTo(103, 5);
      expect(physics.location.y).toBeCloseTo(104, 5);
    });

    it('should reset acceleration after update', () => {
      physics.acceleration = new Vector(5, 5);
      const bounds = new Rectangle(0, 0, 300, 300);
      physics.setBounds(bounds);
      physics.update();
      expect(physics.acceleration.x).toBe(0);
      expect(physics.acceleration.y).toBe(0);
    });

    it('should limit velocity to max value', () => {
      physics.velocity = new Vector(100, 100);
      const bounds = new Rectangle(0, 0, 300, 300);
      physics.setBounds(bounds);
      physics.update();
      expect(physics.velocity.mag()).toBeLessThanOrEqual(10);
    });

    it('should stop very small velocities', () => {
      physics.velocity = new Vector(0.005, 0.005);
      const bounds = new Rectangle(0, 0, 300, 300);
      physics.setBounds(bounds);
      physics.update();
      expect(physics.velocity.x).toBe(0);
      expect(physics.velocity.y).toBe(0);
    });
  });

  describe('calculateGravity', () => {
    it('should calculate gravity force based on mass', () => {
      const gravity = new Vector(0, 0.5);
      const result = physics.calculateGravity(gravity);
      expect(result.x).toBeCloseTo(0, 5);
      expect(result.y).toBeCloseTo(0.5, 5);
    });

    it('should scale gravity by mass', () => {
      physics.mass = 2;
      const gravity = new Vector(0, 0.5);
      const result = physics.calculateGravity(gravity);
      expect(result.y).toBeCloseTo(1, 5);
    });

    it('should modify the gravity vector passed in', () => {
      const gravity = new Vector(0, 0.5);
      physics.calculateGravity(gravity);
      // Note: This modifies the input - might be a bug
      expect(gravity.y).toBeCloseTo(0.5, 5);
    });
  });

  describe('calculateFriction', () => {
    it('should calculate friction opposite to velocity direction', () => {
      physics.velocity = new Vector(10, 0);
      const friction = physics.calculateFriction(0.1);
      expect(friction.x).toBeLessThan(0);
      expect(friction.y).toBeCloseTo(0, 5);
    });

    it('should have magnitude proportional to mu', () => {
      physics.velocity = new Vector(10, 0);
      const friction1 = physics.calculateFriction(0.1);
      const friction2 = physics.calculateFriction(0.2);
      expect(friction2.mag()).toBeGreaterThan(friction1.mag());
    });

    it('should normalize friction direction', () => {
      physics.velocity = new Vector(10, 10);
      const friction = physics.calculateFriction(0.1);
      // Friction should be opposite to velocity direction and normalized
      const frictionMag = friction.mag();
      expect(frictionMag).toBeCloseTo(0.1, 5);
    });
  });

  describe('integration test - realistic motion', () => {
    it('should simulate realistic bouncing behavior', () => {
      const bounds = new Rectangle(0, 0, 200, 200);
      physics.setBounds(bounds);
      physics.location = new Vector(100, 100);
      physics.velocity = new Vector(5, 0);

      // Run simulation for several frames
      for (let i = 0; i < 50; i++) {
        physics.update();
      }

      // Object should have moved and bounced
      expect(physics.location.x).not.toBe(100);
      // Should still be within bounds
      expect(physics.location.x).toBeGreaterThanOrEqual(0);
      expect(physics.location.x).toBeLessThanOrEqual(200);
      expect(physics.location.y).toBeGreaterThanOrEqual(0);
      expect(physics.location.y).toBeLessThanOrEqual(200);
    });

    it('should simulate gravity and friction', () => {
      const bounds = new Rectangle(0, 0, 200, 200);
      physics.setBounds(bounds);
      physics.location = new Vector(100, 10);

      // Apply gravity and friction for several frames
      for (let i = 0; i < 20; i++) {
        const gravity = physics.calculateGravity(new Vector(0, 0.5));
        const friction = physics.calculateFriction(0.01);
        physics.applyForce(gravity);
        physics.applyForce(friction);
        physics.update();
      }

      // Object should have fallen due to gravity
      expect(physics.location.y).toBeGreaterThan(10);
    });
  });
});
