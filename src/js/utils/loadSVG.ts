/**
 * Load SVG files from [svg-src] elements
 * @param fallbackFormat Alternative format to use if SVG not supported, eg 'png'. Default is 'png'.
 * @param imagePath Path to images if other than 'svg/', 'png/', etc.
 */

// Extend Window interface to include Modernizr
declare global {
    interface Window {
        Modernizr?: {
            svg: boolean;
        };
        $?: any;
    }
}

/**
 * Load an SVG for a single element
 * @param element DOM element with svg-src attribute
 * @param fallbackFormat Format to use if SVG not supported (default: 'png')
 * @param imagePath Path to images directory (default: 'svg/' or fallback format)
 */
export function loadSVG(
    element: Element,
    fallbackFormat: string = 'png',
    imagePath?: string
): void {
    // Determine the available formats, prefer SVG
    const imageFormat = window.Modernizr?.svg ? 'svg' : fallbackFormat;

    // If no imagePath is supplied, assume it is in folder named after the imageFormat
    const path = imagePath !== undefined ? imagePath : imageFormat + '/';

    // Replace the temporary svg-src attribute with the appropriate src link
    const $element = window.$ ? window.$(element) : null;

    if ($element) {
        const imgName = $element.attr('svg-src');
        const fullPath = path + imgName + '.' + imageFormat;
        $element.attr('src', fullPath).removeAttr('svg-src');
    }
}

/**
 * Load all SVGs on the page (elements with [svg-src] attribute)
 * @param fallbackFormat Format to use if SVG not supported (default: 'png')
 * @param imagePath Path to images directory (default: 'svg/' or fallback format)
 */
export function loadAllSVGs(fallbackFormat: string = 'png', imagePath?: string): void {
    // Find all elements with svg-src attribute
    const elements = document.querySelectorAll('[svg-src]');

    elements.forEach(element => {
        loadSVG(element, fallbackFormat, imagePath);
    });
}
