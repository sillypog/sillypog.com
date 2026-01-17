import { EVENTS, dispatchEvent, EventName } from './events.ts';
import { Circulator } from './Circulator.ts';
import { ajax, $$, $, offset, height, removeClass, addClass } from './utils/dom.ts';
import { loadAllSVGs } from './utils/loadSVG.ts';
import { View } from './View.ts';

export class Articles implements View {
	stage: HTMLElement;

	constructor(stage: HTMLElement) {
		this.stage = stage;
	}

	show(): void {
		console.log('Articles.show');
		removeClass(this.stage, 'hidden');
	}

	intro(): void {
		this.show();
	}

	outro(): void {
		this.outroComplete();
	}

	changeSubpage(subpage: string): void {
		console.log('Articles.showSubpage', subpage);

		// Clear current subpage
		this.stage.innerHTML = '';
		// Load next
		if (subpage) {
			ajax('articles/' + subpage + '/index.html', {
				dataType: 'html',
				success: (data) => {
					this.stage.innerHTML = data;
					loadAllSVGs(this.stage);

					// Wrap the text around the circle
					const circulator = new Circulator();
					const paragraphs = $$('p', this.stage);
					const circle = $('.articleCircle', this.stage);

					for (const p of paragraphs) {
						const ppos = offset(p as HTMLElement);
						const cpos = offset(circle as HTMLElement);
						const cheight = height(circle as HTMLElement);

						if (ppos.top > cpos.top + cheight) {
							break;
						}

						circulator.circulate(p, circle, true);
					}
				}
			});
		}
	}

	outroComplete(): void {
		addClass(this.stage, 'hidden');
		// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
		dispatchEvent(EVENTS.OUTRO_COMPLETE);
	}

	addEventListener(eventName: EventName, handler: EventListener): void {
		window.addEventListener(eventName, handler);
	}
}
