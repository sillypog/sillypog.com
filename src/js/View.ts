import { EventName } from './events.ts';

export interface View {
    intro(detail?: unknown): void;
    outro(): void;
    show?(): void;
    changeSubpage?(subpage: string): void;
    addEventListener(eventName: EventName, handler: EventListener): void;
}
