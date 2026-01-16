/**
 * Remove inline styles from elements
 */

// Extend Window interface to include $ utility
declare global {
    interface Window {
        $?: any;
    }
}

/**
 * Remove an inline style property from an element
 * @param element DOM element to modify
 * @param styleName The name of the style to be removed, eg 'opacity'
 */
export function removeInlineStyle(element: Element, styleName: string): void {
    const $element = window.$ ? window.$(element) : null;

    if (!$element) {
        return;
    }

    const style = $element.attr('style');
    if (!style) {
        return; // Abort if there are no styles to search
    }

    const styles = style.split(';');

    // Loop over all styles until we find a match to the styleName parameter
    for (let i = styles.length - 1; i > -1; i--) {
        // Remove leading whitespace
        styles[i] = styles[i].replace(/^\s\s*/, '');
        if (styles[i].indexOf(styleName + ':') === 0) {
            styles.splice(i, 1); // Remove the match style
            break; // Don't need to keep looking
        }
    }

    $element.attr('style', styles.join(';')); // Write out the modified styles
}
