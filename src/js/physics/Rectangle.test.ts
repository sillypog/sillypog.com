import { describe, it, expect } from 'vitest';
import { Rectangle } from './Rectangle';

describe('Rectangle', () => {
  describe('constructor', () => {
    it('should create a rectangle with specified dimensions', () => {
      const rect = new Rectangle(10, 20, 100, 200);
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(20);
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(200);
    });
  });

  describe('containsX', () => {
    it('should return true if point x is within bounds', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsX({ x: 50 })).toBe(true);
    });

    it('should return true for point at left boundary', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsX({ x: 0 })).toBe(true);
    });

    it('should return true for point at right boundary', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsX({ x: 100 })).toBe(true);
    });

    it('should return false if point x is less than left boundary', () => {
      const rect = new Rectangle(10, 0, 100, 100);
      expect(rect.containsX({ x: 5 })).toBe(false);
    });

    it('should return false if point x is greater than right boundary', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsX({ x: 101 })).toBe(false);
    });

    it('should work with negative coordinates', () => {
      const rect = new Rectangle(-50, 0, 50, 100);
      expect(rect.containsX({ x: 0 })).toBe(true);
      expect(rect.containsX({ x: -25 })).toBe(true);
      expect(rect.containsX({ x: -100 })).toBe(false);
    });
  });

  describe('containsY', () => {
    it('should return true if point y is within bounds', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsY({ y: 50 })).toBe(true);
    });

    it('should return true for point at top boundary', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsY({ y: 0 })).toBe(true);
    });

    it('should return true for point at bottom boundary', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsY({ y: 100 })).toBe(true);
    });

    it('should return false if point y is less than top boundary', () => {
      const rect = new Rectangle(0, 10, 100, 100);
      expect(rect.containsY({ y: 5 })).toBe(false);
    });

    it('should return false if point y is greater than bottom boundary', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      expect(rect.containsY({ y: 101 })).toBe(false);
    });

    it('should work with negative coordinates', () => {
      const rect = new Rectangle(0, -50, 100, 50);
      expect(rect.containsY({ y: 0 })).toBe(true);
      expect(rect.containsY({ y: -25 })).toBe(true);
      expect(rect.containsY({ y: -100 })).toBe(false);
    });
  });

  describe('combined containment checks', () => {
    it('should work together to check full containment', () => {
      const rect = new Rectangle(0, 0, 100, 100);
      const pointInside = { x: 50, y: 50 };
      const pointOutside = { x: 150, y: 50 };

      expect(rect.containsX(pointInside) && rect.containsY(pointInside)).toBe(true);
      expect(rect.containsX(pointOutside) && rect.containsY(pointOutside)).toBe(false);
    });
  });
});
