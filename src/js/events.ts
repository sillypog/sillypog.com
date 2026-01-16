// Event constants
export const EVENTS = {
    OUTRO_COMPLETE: 'sillypog:outroComplete',
    CONTENTS_LOADED: 'sillypog:contentsLoaded'
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

// Helper functions for event handling
export function dispatchEvent(eventName: EventName, detail: unknown = null): void {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
}

export function addEventListener(eventName: EventName, handler: EventListener): void {
    window.addEventListener(eventName, handler);
}

export function removeEventListener(eventName: EventName, handler: EventListener): void {
    window.removeEventListener(eventName, handler);
}
