/**
* View manager
*
* Watches for changes in the window hash and execute appropriately.
* Want to be able to pass in specific functions for specific changes, eg main->portfolio.
*/

import { EVENTS, addEventListener, EventName } from './events.ts';

// Interface for View objects that can be managed
export interface View {
	intro(detail?: unknown): void;
	outro(): void;
	show?(): void;
	changeSubpage?(subpage: string): void;
	addEventListener(eventName: EventName, handler: EventListener): void;
}

// Interface for the pages object structure
export interface Pages {
	[key: string]: View;
}

// Interface for parsed URL path
interface ParsedPath {
	page: string;
	subpage: string;
}

export class ViewManager {
	private pages: Pages;
	private currentPage: string;
	private currentSubpage: string;

	/**
	* Constructor
	* Each section of the application has a class that manages it.
	* These are added here with a name corresponding to the page name in the url.
	* Every page implements the same interface so the manager can call the correct method as needed.
	*/
	constructor(pageInfo: Pages) {
		'use strict';

		this.pages = pageInfo;
		this.currentPage = 'none';
		this.currentSubpage = '';

		// Listen for events from pages
		for (const pageKey in this.pages) {
			this.pages[pageKey].addEventListener(EVENTS.OUTRO_COMPLETE, this.showCurrentPage.bind(this));
		}

		window.addEventListener('hashchange', this.onHashChange.bind(this));
		this.init();
	}

	/**
	* Private methods
	*/
	private init(): void {
		const path = this.parseURL();
		this.currentPage = path.page;
		this.pages[this.currentPage].show?.();
		if (path.subpage && this.pages[this.currentPage].changeSubpage) {
			this.pages[this.currentPage].changeSubpage(path.subpage);
			this.currentSubpage = path.subpage;
		}
	}

	private onHashChange(e: HashChangeEvent): void {
		console.log('ViewManager.onHashChange', e);

		const path = this.parseURL();

		if (path.page !== this.currentPage) {
			this.changePage(path.page, path.subpage);
		}

		if (path.subpage !== this.currentSubpage && this.pages[this.currentPage].changeSubpage) {
			// Let page classes manage their own subpage changes
			this.pages[this.currentPage].changeSubpage(path.subpage);
			this.currentSubpage = path.subpage;
		}
	}

	private changePage(page: string, subpage: string): void {
		console.log('ViewManager.changePage to:', page, subpage);

		const cPage = this.currentPage;
		this.currentPage = page;	// Need to set the new currentPage before calling outro so it's ready for outroComplete if there's no animation

		this.pages[cPage].outro();
	}

	/**
	* Called in response to OUTRO_COMPLETE from exiting page
	*/
	private showCurrentPage(event: Event): void {
		console.log('showCurrentPage:', this.currentPage);
		const customEvent = event as CustomEvent;
		this.pages[this.currentPage].intro(customEvent.detail);
	}

	private parseURL(): ParsedPath {
		const hash = $.param.fragment().substr(1) || '';
		const hashParts = hash.split('/');
		const page = hashParts[0] || '';
		const subpage = hashParts[1] || '';
		return { page, subpage };
	}
}
