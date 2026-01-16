// DOM utility functions to replace jQuery

// Overloaded $ function types
export function $(callback: () => void): void;
export function $(selector: string, context?: Document | HTMLElement): Element | null;
export function $(element: Element): Element;
export function $(
    selector: string | (() => void) | Element,
    context: Document | HTMLElement = document
): Element | null | void {
    if (typeof selector === 'function') {
        // Handle $(function() {...}) - DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', selector);
        } else {
            selector();
        }
        return;
    }

    if (typeof selector === 'string') {
        return context.querySelector(selector);
    }

    return selector; // Already an element
}

export function $$(selector: string, context: Document | HTMLElement = document): Element[] {
    return Array.from(context.querySelectorAll(selector));
}

export function getJSON<T = any>(url: string): Promise<T> {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}

interface AjaxOptions extends Omit<RequestInit, 'method'> {
    dataType?: 'text' | 'json';
    success?: (data: any) => void;
    error?: (err: Error) => void;
}

export function ajax(url: string, options: AjaxOptions = {}): Promise<any> {
    const { dataType = 'text', success, error, ...fetchOptions } = options;

    return fetch(url, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (dataType === 'json') {
                return response.json();
            }
            return response.text();
        })
        .then(data => {
            if (success) success(data);
            return data;
        })
        .catch(err => {
            if (error) error(err);
            throw err;
        });
}

interface Offset {
    top: number;
    left: number;
}

export function offset(element: HTMLElement): Offset {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
}

interface OffsetCoords {
    top?: number;
    left?: number;
}

export function setOffset(element: HTMLElement, coords: OffsetCoords): void {
    if (coords.top !== undefined) {
        element.style.top = coords.top + 'px';
    }
    if (coords.left !== undefined) {
        element.style.left = coords.left + 'px';
    }
}

export function remove(element: Element): void {
    element.remove();
}

export function addClass(element: Element, className: string): void {
    element.classList.add(className);
}

export function removeClass(element: Element, className: string): void {
    element.classList.remove(className);
}

export function toggleClass(element: Element, className: string): boolean {
    return element.classList.toggle(className);
}

export function on<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
): void;
export function on(element: HTMLElement, event: string, handler: EventListener): void;
export function on(element: HTMLElement, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
}

export function off<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
): void;
export function off(element: HTMLElement, event: string, handler: EventListener): void;
export function off(element: HTMLElement, event: string, handler: EventListener): void {
    element.removeEventListener(event, handler);
}

type CSSProperties = Partial<CSSStyleDeclaration>;
type CSSPropertyValue = string | number | null;

// Overloaded css function
export function css(element: HTMLElement, property: string): string;
export function css(element: HTMLElement, property: string, value: CSSPropertyValue): void;
export function css(element: HTMLElement, properties: CSSProperties): void;
export function css(
    element: HTMLElement,
    property: string | CSSProperties,
    value?: CSSPropertyValue
): string | void {
    if (typeof property === 'string' && value !== undefined) {
        (element.style as any)[property] = value;
    } else if (typeof property === 'object') {
        Object.assign(element.style, property);
    } else if (typeof property === 'string') {
        return getComputedStyle(element)[property as any];
    }
}

// Overloaded attr function
export function attr(element: Element, name: string): string | null;
export function attr(element: Element, name: string, value: string): void;
export function attr(element: Element, name: string, value?: string): string | null | void {
    if (value !== undefined) {
        element.setAttribute(name, value);
    } else {
        return element.getAttribute(name);
    }
}

// Overloaded text function
export function text(element: Element): string;
export function text(element: Element, value: string): void;
export function text(element: Element, value?: string): string | void {
    if (value !== undefined) {
        element.textContent = value;
    } else {
        return element.textContent || '';
    }
}

// Overloaded html function
export function html(element: Element): string;
export function html(element: Element, value: string): void;
export function html(element: Element, value?: string): string | void {
    if (value !== undefined) {
        element.innerHTML = value;
    } else {
        return element.innerHTML;
    }
}

export function width(element: HTMLElement): number {
    return element.offsetWidth;
}

export function height(element: HTMLElement): number {
    return element.offsetHeight;
}
