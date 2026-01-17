/* globals Quint, TweenLite */

import { EVENTS, dispatchEvent, EventName } from './events.ts';
import { Circulator } from './Circulator.js';
import { $$, offset, addClass, removeClass } from './utils/dom.ts';
import { loadAllSVGs, removeInlineStyle } from './utils/index.ts';
import { View } from './View.ts';

interface Offset {
	top: number;
	left: number;
}

export interface OutroResult {
	bigCirclePosition: Offset;
	smallCirclePositions: Offset[];
}

let instance: About;
let stage: HTMLElement;
let shown: boolean;

/**
 * About class - manages the about section with circular text wrapping
 */
export class About implements View {
	/**
	 * Constructor
	 * @param stageElement - DOM element for the about stage
	 */
	constructor(stageElement: HTMLElement) {
		instance = this;
		stage = stageElement;
	}

	show(): void {
		removeClass(stage, 'hidden');
		if (!shown) {
			// Set the source for any .dynamicImg classes
			loadAllSVGs();	// Uses custom plugin

			// Circulate
			const circulator = new Circulator();
			const paragraphs = $$('#aboutText > p', stage);
			const bigCircle = stage.querySelector('.bigCircle') as HTMLElement;

			paragraphs.forEach(function(paragraph) {
				circulator.circulate(paragraph, bigCircle, true);
			});
		}
		shown = true;
	}

	intro(): void {
		const paragraphs = $$('#aboutText > p', stage);
		paragraphs.forEach(paragraph => {
			removeInlineStyle(paragraph, 'opacity');
		});

		const headerElements = $$('#about header > *');
		headerElements.forEach(element => {
			removeInlineStyle(element, 'opacity');
		});

		this.show();
	}

	outro(): void {
		// Fade the text out and just leave the bubbles
		const paragraphs = $$('#aboutText>p', stage);
		paragraphs.forEach(function(paragraph, index) {
			TweenLite.to(paragraph, 0.5, {css:{alpha:0}, ease:Quint.easeIn, delay:0.25 * index});
		});

		const headerElements = document.querySelectorAll('#about header > *');
		TweenLite.to(headerElements, 1, {css:{alpha:0}, ease:Quint.easeIn, onComplete:outroComplete});
	}

	addEventListener(eventName: EventName, handler: EventListener): void {
		window.addEventListener(eventName, handler);
	}
}

/**
 * Private functions
 */
function outroComplete(): void {
	// Store the circle positions before hiding everything.
	const bigCircle = document.querySelector('#about .bigCircle') as HTMLElement;
	const ac1 = document.querySelector('#ac1') as HTMLElement;
	const ac2 = document.querySelector('#ac2') as HTMLElement;
	const ac3 = document.querySelector('#ac3') as HTMLElement;

	const params: OutroResult = {
		bigCirclePosition: offset(bigCircle),
		smallCirclePositions: [offset(ac1), offset(ac2), offset(ac3)]
	};

	addClass(stage, 'hidden');
	// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
	dispatchEvent(EVENTS.OUTRO_COMPLETE, params);
}
