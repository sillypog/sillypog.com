import { EVENTS, dispatchEvent, EventName } from './events';
import { getJSON } from './utils/dom.js';

// Interface for article content structure
export interface Article {
    [key: string]: unknown;
}

// Interface for the contents JSON structure
interface ContentsData {
    articles: Article[];
}

// ContentModel - manages portfolio content loading
let contents: Article[];
let index = 0;
let _ready = false;

export function ready(): boolean {
    return _ready;
}

export function load(): void {
    console.log('ContentModel.load');
    getJSON('json/contents.json').then((data: ContentsData) => {
        contents = data.articles;
        onContentsLoaded();
    });
}

export function next(n: number): Article[] {
    const items = contents.slice(index, n);
    //index+=n;
    return items;
}

//----------
// Private
//----------

function onContentsLoaded(): void {
    // Dispatch event
    console.log('Contents loaded', contents);

    _ready = true;
    dispatchEvent(EVENTS.CONTENTS_LOADED);
}
