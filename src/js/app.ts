// Main application entry point
import { $ } from './utils/dom.ts';
import { EVENTS, addEventListener } from './events.ts';
import * as ContentModel from './ContentModel.ts';
import { NoView } from './NoView.ts';
import { About } from './About.ts';
import { Portfolio } from './Portfolio.ts';
import { Links } from './Links.ts';
import { Articles } from './Articles.ts';
import { ViewManager, type Pages } from './ViewManager.ts';

console.log("Sillypog:*");

/**
 * Document ready function
 */
$(function() {

    const pages: Pages = {
        none: new NoView(),
        '': new About(document.querySelector('#about')!),
        portfolio: new Portfolio(document.querySelector('#portfolio')!, ContentModel),
        links: new Links(document.querySelector('#links')!, document.querySelector('#contact')!),
        articles: new Articles(document.querySelector('#articles')!)
    };

    const viewManager = new ViewManager(pages);

    // Load contents
    addEventListener(EVENTS.CONTENTS_LOADED, () => {
        if (pages.portfolio.contentsLoaded) {
            pages.portfolio.contentsLoaded();
        }
    });
    ContentModel.load();
});
