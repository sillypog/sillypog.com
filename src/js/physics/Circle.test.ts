import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Circle } from './Circle';

describe('Circle', () => {
  // Mock jQuery element
  function createMockElement(width: number = 50) {
    const cssProps: { left?: number; top?: number } = {};

    return {
      css(props: { left: number; top: number }) {
        Object.assign(cssProps, props);
        return this;
      },
      width() {
        return width;
      },
      getCssProps() {
        return cssProps;
      }
    };
  }

  describe('constructor', () => {
    it('should initialize with position and element', () => {
      const mockElement = createMockElement();
      const circle = new Circle(100, 150, mockElement as any);

      expect(circle.physics.location.x).toBe(100);
      expect(circle.physics.location.y).toBe(150);
      expect(circle.$).toBeDefined();
    });

    it('should set initial CSS position on element', () => {
      const mockElement = createMockElement();
      const circle = new Circle(100, 150, mockElement as any);

      const cssProps = (mockElement as any).getCssProps();
      expect(cssProps.left).toBe(100);
      expect(cssProps.top).toBe(150);
    });
  });

  describe('radius', () => {
    it('should return half of element width', () => {
      const mockElement = createMockElement(100);
      const circle = new Circle(0, 0, mockElement as any);

      expect(circle.radius()).toBe(50);
    });

    it('should calculate radius for different widths', () => {
      const mockElement = createMockElement(80);
      const circle = new Circle(0, 0, mockElement as any);

      expect(circle.radius()).toBe(40);
    });
  });

  describe('update', () => {
    it('should update physics and CSS position', () => {
      const mockElement = createMockElement();
      const circle = new Circle(100, 100, mockElement as any);

      // Apply a force to move the circle
      circle.physics.velocity.x = 5;
      circle.physics.velocity.y = 10;
      // Create proper mock bounds with containsX and containsY methods
      const mockBounds = {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        containsX: (p: { x: number }) => p.x >= 0 && p.x <= 300,
        containsY: (p: { y: number }) => p.y >= 0 && p.y <= 300
      };
      circle.physics.setBounds(mockBounds as any);

      circle.update();

      // Check that physics updated
      expect(circle.physics.location.x).toBeGreaterThan(100);
      expect(circle.physics.location.y).toBeGreaterThan(100);

      // Check that CSS was updated
      const cssProps = (mockElement as any).getCssProps();
      expect(cssProps.left).toBeGreaterThan(100);
      expect(cssProps.top).toBeGreaterThan(100);
    });

    it('should synchronize physics location with CSS', () => {
      const mockElement = createMockElement();
      const circle = new Circle(50, 50, mockElement as any);

      circle.physics.velocity.x = 3;
      circle.physics.velocity.y = 4;
      const mockBounds = {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        containsX: (p: { x: number }) => p.x >= 0 && p.x <= 200,
        containsY: (p: { y: number }) => p.y >= 0 && p.y <= 200
      };
      circle.physics.setBounds(mockBounds as any);

      circle.update();

      const cssProps = (mockElement as any).getCssProps();
      expect(cssProps.left).toBeCloseTo(circle.physics.location.x, 5);
      expect(cssProps.top).toBeCloseTo(circle.physics.location.y, 5);
    });
  });

  describe('integration - circle movement', () => {
    it('should move circle smoothly over multiple updates', () => {
      const mockElement = createMockElement();
      const circle = new Circle(100, 100, mockElement as any);

      circle.physics.velocity.x = 2;
      circle.physics.velocity.y = 2;
      const mockBounds = {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        containsX: (p: { x: number }) => p.x >= 0 && p.x <= 300,
        containsY: (p: { y: number }) => p.y >= 0 && p.y <= 300
      };
      circle.physics.setBounds(mockBounds as any);

      // Simulate several frames
      for (let i = 0; i < 10; i++) {
        circle.update();
      }

      // Circle should have moved
      expect(circle.physics.location.x).toBeGreaterThan(100);
      expect(circle.physics.location.y).toBeGreaterThan(100);

      // CSS should match
      const cssProps = (mockElement as any).getCssProps();
      expect(cssProps.left).toBe(circle.physics.location.x);
      expect(cssProps.top).toBe(circle.physics.location.y);
    });
  });
});
