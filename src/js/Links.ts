import { EVENTS, dispatchEvent } from './events.ts';
import { $$, on, attr, text, addClass, removeClass } from './utils/dom.ts';
import { linkTemplate, type LinkTemplateData } from './templates.ts';

//----------
// Private properties
//----------
let instance: Links | undefined; // Allow private properties to call public methods

let stage: HTMLElement;
let contact: HTMLElement;

let baseText: string;

let shown: boolean | undefined;

//----------
// Private methods
//----------
function firstShow(): void {
	// Wrap templates around the links in the list
	applyTemplates();

	// Change the text of the contact element when we mouse over
	const links = $$('a', stage) as HTMLAnchorElement[];
	links.forEach(link => {
		on(link, 'mouseenter', showHighlightText);
		on(link, 'mouseleave', showBaseText);
	});
}

function applyTemplates(): void {
	const links = $$('#linksList a', stage) as HTMLAnchorElement[];
	links.forEach(a => {
		const properties: LinkTemplateData = {
			icon: attr(a, 'id') || '',
			url: attr(a, 'href') || ''
		};
		a.insertAdjacentHTML('beforeend', linkTemplate(properties));
	});
}

function showHighlightText(e: MouseEvent): void {
	//console.log('showHighlightText',e,this);
	let linkText = attr(e.currentTarget as HTMLElement, 'href') || '';
	let linkParts = linkText.split(':');
	linkText = linkParts.length > 1 ? linkParts[1] : linkText;
	linkParts = linkText.split('//');
	linkText = linkParts.length > 1 ? linkParts[1] : linkText;
	text(contact, linkText);
}

function showBaseText(e: MouseEvent): void {
	text(contact, baseText);
}

function outroComplete(): void {
	addClass(stage, 'hidden');
	// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
	dispatchEvent(EVENTS.OUTRO_COMPLETE);
}

//----------
// Links class
//----------
export class Links {
	constructor(stageElement: HTMLElement, contactElement: HTMLElement) {
		console.log('Links: Constructor');

		instance = this;

		stage = stageElement;
		contact = contactElement;

		baseText = text(contactElement);
	}

	//----------
	// Public methods
	//----------
	show(): void {
		removeClass(stage, 'hidden');

		if (!shown) {
			firstShow();
		}
		shown = true;
	}

	intro(params?: unknown): void {
		this.show(); // No animation yet
	}

	outro(): void {
		outroComplete();
	}
}
