import { EVENTS, dispatchEvent, EventName } from './events';

// NoView - placeholder view for initial state
export class NoView {
    constructor() {}

    /**
     * This will be called when the first screen of the application is needed.
     */
    outro(): void {
        dispatchEvent(EVENTS.OUTRO_COMPLETE);
    }
}
