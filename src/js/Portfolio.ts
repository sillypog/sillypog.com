'use strict';

import { EVENTS, dispatchEvent, addEventListener, EventName } from './events.ts';
import { Vector, Rectangle, Circle } from './physics/index.ts';
import * as ContentModel from './ContentModel.ts';
import { Article } from './ContentModel.ts';
import { View } from './View.ts';
import {
	$,
	$$,
	offset,
	setOffset,
	width,
	height,
	text,
	addClass,
	removeClass,
	on,
	loadAllSVGs
} from './utils/index.ts';
import { portfolioIntroPlaceholder } from './templates.ts';

// TweenLite global type declaration
declare const TweenLite: any;

//----------
// Type definitions
//----------

// Interface for intro parameters passed from About page
export interface IntroParams {
	bigCirclePosition: {
		top: number;
		left: number;
	};
	smallCirclePositions: Array<{
		top: number;
		left: number;
	}>;
}

// Stage size information
interface StageSizeInfo {
	width: number;
	height: number;
}

// Extended Article interface with portfolio-specific fields
interface PortfolioArticle extends Article {
	icon: string;
	url: string;
	description: string;
}

//----------
// Private properties
//----------
let instance: Portfolio | null = null;	// Allow private properties to call public methods
let stage: HTMLElement | null = null;	// DOM element

let contentModel: typeof ContentModel | null = null;
let showOnContents: boolean = false;

let circles: Circle[] = [];
let circleSizeInfo: StageSizeInfo | null = null;

let physicsTimer: number | null = null;

//----------
// Constructor
//----------
export class Portfolio implements View {
	constructor(stageElement: HTMLElement, _contentModel: typeof ContentModel) {
		instance = this;
		stage = stageElement;
		contentModel = _contentModel;
	}

	//----------
	// Public methods
	//----------
	/**
	* Params contains the bigCirclePosition we need to line up with
	*/
	intro(params?: IntroParams): void {
		console.log('Portfolio.intro');

		// Params are only there if we came from the about page at this point
		if (!params) {
			this.show();
			return;
		}

		if (!stage) return;

		// Apply an instance of the placeholder template
		stage.insertAdjacentHTML('beforeend', portfolioIntroPlaceholder());

		// Load SVGs in the stage
		const svgElements = $$('[svg-src]', stage);
		svgElements.forEach(elem => loadAllSVGs());

		removeClass(stage, 'hidden');

		// Match circle positions to what we've been passed
		const bigCircle = $('.bigCircle', stage) as HTMLElement | null;
		if (bigCircle) {
			setOffset(bigCircle, params.bigCirclePosition);
		}

		const smallCircles = $$('[id^="pc"]', stage) as HTMLElement[];
		smallCircles.forEach((elem, index) => {
			setOffset(elem, params.smallCirclePositions[index]);
		});

		// Bring them all into the center
		const pc3 = $('#pc3', stage) as HTMLElement | null;
		if (!pc3) return;

		const finalWidth = width(pc3);
		const finalLeft = (width(stage) / 2) - (finalWidth / 2);
		const areaElement = $('.area', stage) as HTMLElement | null;
		if (!areaElement) return;

		const finalTop = (height(areaElement) / 2) - (finalWidth / 2);

		// TweenLite works with DOM elements directly
		if (bigCircle) {
			TweenLite.to(bigCircle, 0.5, {css:{width:finalWidth, height:finalWidth, borderRadius:finalWidth, left:finalLeft, top:finalTop, backgroundColor:"rgba(153,51,102,1)"}});
		}

		const pc1 = $('#pc1', stage);
		if (pc1) {
			TweenLite.to(pc1, 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.1});
		}

		const pc2 = $('#pc2', stage);
		if (pc2) {
			TweenLite.to(pc2, 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.2});
		}

		TweenLite.to(pc3, 0.5, {css:{left:finalLeft, top:finalTop}, delay:0.3, onComplete:function(){instance?.show();}});
	}

	outro(): void {
		outroComplete();
	}

	show(): void {
		console.log('Portfolio.show');

		if (!contentModel || !stage) return;

		// If the contentModel data is ready, we can show.
		// Otherwise, wait until it is
		if (!contentModel.ready()) {
			showOnContents = true;
			return;
		}

		const contents = contentModel.next(6) as PortfolioArticle[];

		// Clear the stage
		const movableElements = $$('.movable', stage) as HTMLElement[];
		movableElements.forEach(elem => elem.remove());
		removeClass(stage, 'hidden');

		// Get stage dimensions
		const areaElement = $('.area', stage) as HTMLElement | null;
		if (!areaElement) return;

		const stageSizeInfo: StageSizeInfo = {
			width: width(stage),
			height: height(areaElement)
		};

		// Create circle representations and pop them out from the center
		circles = [];
		for (let i = 0, l = contents.length; i < l; i++) {
			const circle = createCircle(contents[i], i, stageSizeInfo);
			if (circle) {
				circles[i] = circle;
			}
		}

		// Process the icons
		loadAllSVGs();

		// Start the physics updating
		physicsTimer = window.setInterval(updatePhysics, 1000 / 60);
	}

	contentsLoaded(e: Event): void {
		if (showOnContents) {
			showOnContents = false;
			instance?.show();
		}
	}

	addEventListener(eventName: EventName, handler: EventListener): void {
		window.addEventListener(eventName, handler);
	}
}

//----------
// Private methods
//----------

function createCircle(data: PortfolioArticle, index: number, stageSizeInfo: StageSizeInfo): Circle | null {
	if (!stage) return null;

	// Create the innerElement so we can accurately measure the radius before we put it together with the link and anchor elements
	const segmentRadians = (Math.PI * 2) / 6;
	const direction = new Vector();
	const area = $('.area', stage) as HTMLElement | null;
	const contentsElement = $('#contents', stage) as HTMLElement | null;

	if (!area || !contentsElement) return null;

	// Create inner element for measuring
	const innerElement = document.createElement('div');
	innerElement.className = 'portfolioCircle';
	const img = document.createElement('img');
	img.setAttribute('svg-src', data.icon);
	innerElement.appendChild(img);
	contentsElement.appendChild(innerElement);

	const radius = width(innerElement) / 2;
	const boundRectangle = new Rectangle(radius, radius, width(area) - radius, height(area) - radius);

	// Create outer element
	const outerElement = document.createElement('li');
	outerElement.className = 'movable contentItem';
	const link = document.createElement('a');
	link.href = data.url;
	outerElement.appendChild(link);
	contentsElement.appendChild(outerElement);

	// Merge the 2 pieces together
	link.appendChild(innerElement);

	// Add mouse event handlers
	on(outerElement, 'mouseenter', function() {
		if (!stage) return;
		const descElement = $('#description', stage) as HTMLElement | null;
		if (descElement) {
			text(descElement, data.description);
			TweenLite.to(descElement, 0.25, {css:{alpha:1}});
		}
	});

	on(outerElement, 'mouseleave', function() {
		if (!stage) return;
		const descElement = $('#description', stage) as HTMLElement | null;
		if (descElement) {
			TweenLite.to(descElement, 0.25, {css:{alpha:0}});
		}
	});

	// Type assertion for Circle constructor which expects a jQuery-like element
	// The Circle class accepts any object with css() and width() methods
	const circle = new Circle(width(area) * 0.5, height(area) * 0.5, outerElement as any);
	circle.physics.setBounds(boundRectangle);
	circle.physics.mass = 10;

	direction.rotate(segmentRadians * index);
	direction.scale(40);
	circle.physics.applyForce(direction);

	return circle;
}

function outroComplete(): void {
	if (!stage) return;

	// Remove any added elements
	addClass(stage, 'hidden');
	const movableElements = $$('.movable', stage) as HTMLElement[];
	movableElements.forEach(elem => elem.remove());

	// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
	dispatchEvent(EVENTS.OUTRO_COMPLETE);
}

function updatePhysics(): void {
	let stopPhysics = true;
	for (let i = 0, l = circles.length; i < l; i++) {
		const circle = circles[i];
		const friction = circle.physics.calculateFriction(0.5);
		circle.physics.applyForce(friction);
		circle.update();
		if (circle.physics.velocity.mag() > 0) {
			stopPhysics = false;
		}
	}
	if (stopPhysics && physicsTimer !== null) {
		clearInterval(physicsTimer);
	}
	console.log('update');
}
