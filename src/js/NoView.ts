import { EVENTS, dispatchEvent, EventName } from './events';
import { View } from './View.ts';

// NoView - placeholder view for initial state
export class NoView implements View {
    constructor() {}

    /**
     * This will be called when the first screen of the application is needed.
     */
    outro(): void {
        dispatchEvent(EVENTS.OUTRO_COMPLETE);
    }

    intro(): void {
        dispatchEvent(EVENTS.OUTRO_COMPLETE);
    }

    addEventListener(eventName: EventName, handler: EventListener): void {
        window.addEventListener(eventName, handler);
    }
}
