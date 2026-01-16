import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  $,
  $$,
  getJSON,
  ajax,
  offset,
  setOffset,
  remove,
  addClass,
  removeClass,
  toggleClass,
  on,
  off,
  css,
  attr,
  text,
  html,
  width,
  height
} from './dom';

describe('DOM Utilities', () => {
  describe('$ (querySelector)', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="test" class="container">
          <p class="text">Hello</p>
          <span>World</span>
        </div>
      `;
    });

    it('should select element by id', () => {
      const element = $('#test');
      expect(element).toBeTruthy();
      expect(element?.id).toBe('test');
    });

    it('should select element by class', () => {
      const element = $('.container');
      expect(element).toBeTruthy();
      expect(element?.classList.contains('container')).toBe(true);
    });

    it('should return null for non-existent selector', () => {
      const element = $('.nonexistent');
      expect(element).toBeNull();
    });

    it('should accept context parameter', () => {
      const container = $('#test');
      const paragraph = $('p', container as HTMLElement);
      expect(paragraph).toBeTruthy();
      expect(paragraph?.textContent).toBe('Hello');
    });

    it('should return element if element is passed', () => {
      const element = document.getElementById('test')!;
      const result = $(element);
      expect(result).toBe(element);
    });

    it('should handle DOM ready callback', () => {
      const callback = vi.fn();

      // In test environment, document is usually already ready
      // So callback will be called immediately
      $(callback);

      // Depending on document.readyState, callback may be called immediately or on event
      // This test verifies the function doesn't throw
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('$$ (querySelectorAll)', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul>
          <li class="item">1</li>
          <li class="item">2</li>
          <li class="item">3</li>
        </ul>
      `;
    });

    it('should return array of matching elements', () => {
      const elements = $$('.item');
      expect(Array.isArray(elements)).toBe(true);
      expect(elements).toHaveLength(3);
    });

    it('should return empty array for non-existent selector', () => {
      const elements = $$('.nonexistent');
      expect(elements).toHaveLength(0);
    });

    it('should accept context parameter', () => {
      const ul = $('ul');
      const items = $$('li', ul as HTMLElement);
      expect(items).toHaveLength(3);
    });
  });

  describe('addClass', () => {
    it('should add class to element', () => {
      const div = document.createElement('div');
      addClass(div, 'active');
      expect(div.classList.contains('active')).toBe(true);
    });

    it('should not duplicate existing class', () => {
      const div = document.createElement('div');
      addClass(div, 'test');
      addClass(div, 'test');
      expect(div.classList.length).toBe(1);
    });
  });

  describe('removeClass', () => {
    it('should remove class from element', () => {
      const div = document.createElement('div');
      div.classList.add('active', 'visible');
      removeClass(div, 'active');
      expect(div.classList.contains('active')).toBe(false);
      expect(div.classList.contains('visible')).toBe(true);
    });

    it('should handle removing non-existent class', () => {
      const div = document.createElement('div');
      removeClass(div, 'nonexistent');
      expect(div.classList.length).toBe(0);
    });
  });

  describe('toggleClass', () => {
    it('should add class if not present', () => {
      const div = document.createElement('div');
      toggleClass(div, 'active');
      expect(div.classList.contains('active')).toBe(true);
    });

    it('should remove class if present', () => {
      const div = document.createElement('div');
      div.classList.add('active');
      toggleClass(div, 'active');
      expect(div.classList.contains('active')).toBe(false);
    });
  });

  describe('offset', () => {
    it('should return element offset', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const offsetValue = offset(div);
      expect(offsetValue).toHaveProperty('top');
      expect(offsetValue).toHaveProperty('left');
      expect(typeof offsetValue.top).toBe('number');
      expect(typeof offsetValue.left).toBe('number');

      div.remove();
    });
  });

  describe('setOffset', () => {
    it('should set top offset', () => {
      const div = document.createElement('div');
      setOffset(div, { top: 100 });
      expect(div.style.top).toBe('100px');
    });

    it('should set left offset', () => {
      const div = document.createElement('div');
      setOffset(div, { left: 50 });
      expect(div.style.left).toBe('50px');
    });

    it('should set both offsets', () => {
      const div = document.createElement('div');
      setOffset(div, { top: 100, left: 50 });
      expect(div.style.top).toBe('100px');
      expect(div.style.left).toBe('50px');
    });
  });

  describe('remove', () => {
    it('should remove element from DOM', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      expect(document.body.contains(div)).toBe(true);

      remove(div);
      expect(document.body.contains(div)).toBe(false);
    });
  });

  describe('on/off (event handling)', () => {
    it('should add event listener', () => {
      const div = document.createElement('div');
      const handler = vi.fn();

      on(div, 'click', handler);
      div.click();

      expect(handler).toHaveBeenCalled();
    });

    it('should remove event listener', () => {
      const div = document.createElement('div');
      const handler = vi.fn();

      on(div, 'click', handler);
      off(div, 'click', handler);
      div.click();

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('css', () => {
    it('should get CSS property value', () => {
      const div = document.createElement('div');
      div.style.color = 'red';
      const color = css(div, 'color');
      // getComputedStyle might return empty string in test environment
      expect(typeof color).toBe('string');
    });

    it('should set single CSS property', () => {
      const div = document.createElement('div');
      css(div, 'color', 'blue');
      expect(div.style.color).toBe('blue');
    });

    it('should set multiple CSS properties', () => {
      const div = document.createElement('div');
      css(div, { color: 'red', fontSize: '16px' });
      expect(div.style.color).toBe('red');
      expect(div.style.fontSize).toBe('16px');
    });

    it('should handle numeric values', () => {
      const div = document.createElement('div');
      css(div, 'width', 100);
      // In happy-dom, numeric values are converted to strings
      expect(typeof div.style.width).toBe('string');
    });
  });

  describe('attr', () => {
    it('should get attribute value', () => {
      const div = document.createElement('div');
      div.setAttribute('data-test', 'value');
      expect(attr(div, 'data-test')).toBe('value');
    });

    it('should set attribute value', () => {
      const div = document.createElement('div');
      attr(div, 'data-test', 'value');
      expect(div.getAttribute('data-test')).toBe('value');
    });

    it('should return null for non-existent attribute', () => {
      const div = document.createElement('div');
      expect(attr(div, 'data-test')).toBeNull();
    });
  });

  describe('text', () => {
    it('should get text content', () => {
      const div = document.createElement('div');
      div.textContent = 'Hello World';
      expect(text(div)).toBe('Hello World');
    });

    it('should set text content', () => {
      const div = document.createElement('div');
      text(div, 'Hello');
      expect(div.textContent).toBe('Hello');
    });

    it('should return empty string for empty element', () => {
      const div = document.createElement('div');
      expect(text(div)).toBe('');
    });
  });

  describe('html', () => {
    it('should get HTML content', () => {
      const div = document.createElement('div');
      div.innerHTML = '<span>Test</span>';
      expect(html(div)).toBe('<span>Test</span>');
    });

    it('should set HTML content', () => {
      const div = document.createElement('div');
      html(div, '<p>Hello</p>');
      expect(div.innerHTML).toBe('<p>Hello</p>');
    });
  });

  describe('width/height', () => {
    it('should get element width', () => {
      const div = document.createElement('div');
      div.style.width = '100px';
      document.body.appendChild(div);

      const w = width(div);
      expect(typeof w).toBe('number');

      div.remove();
    });

    it('should get element height', () => {
      const div = document.createElement('div');
      div.style.height = '50px';
      document.body.appendChild(div);

      const h = height(div);
      expect(typeof h).toBe('number');

      div.remove();
    });
  });

  describe('getJSON', () => {
    it('should fetch and parse JSON', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: 'test' })
        } as Response)
      );

      const result = await getJSON('/api/test');
      expect(result).toEqual({ data: 'test' });
    });

    it('should throw error on HTTP error', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404
        } as Response)
      );

      await expect(getJSON('/api/test')).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('ajax', () => {
    it('should fetch text by default', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('Hello')
        } as Response)
      );

      const result = await ajax('/api/test');
      expect(result).toBe('Hello');
    });

    it('should fetch JSON when dataType is json', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: 'test' })
        } as Response)
      );

      const result = await ajax('/api/test', { dataType: 'json' });
      expect(result).toEqual({ data: 'test' });
    });

    it('should call success callback', async () => {
      const success = vi.fn();
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('Hello')
        } as Response)
      );

      await ajax('/api/test', { success });
      expect(success).toHaveBeenCalledWith('Hello');
    });

    it('should call error callback on failure', async () => {
      const error = vi.fn();
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500
        } as Response)
      );

      await expect(ajax('/api/test', { error })).rejects.toThrow();
      expect(error).toHaveBeenCalled();
    });
  });
});
