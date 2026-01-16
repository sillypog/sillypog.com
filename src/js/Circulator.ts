// Circulator - wraps text around circular elements
import { $$, css, width, height } from './utils/dom.js';

interface Position {
    top: number;
    left: number;
}

// Extend HTMLElement to include the lettering method (from external library)
interface HTMLElementWithLettering extends HTMLElement {
    lettering(mode: string): void;
}

type FindFunction = (
    paragraph: HTMLElementWithLettering,
    circleCenter: Position,
    radius: number,
    word?: HTMLElement
) => void;

export class Circulator {
    private f: FindFunction | undefined;

    constructor() {
        console.log('Circulator.constructor');
    }

    circulate(paragraph: HTMLElementWithLettering, circle: HTMLElement, rightJustify: boolean): void {
        // Get the circles position
        const circleCenter = this.getCircleCenter(circle);

        // If we want to preserve a certain amount of spacing around the circle we can do this
        const marginRight = css(circle, 'margin-right');
        const circleMargin = parseFloat(marginRight) || 0; // Strip off the units and convert to number
        const radius = (width(circle) / 2) + circleMargin;

        this.f = rightJustify ? this.findByLine : this.findByBlock;
        this.f(paragraph, circleCenter, radius);
    }

    getCircleCenter(circle: HTMLElement): Position {
        const position = this.getPosition(circle);
        position.top += width(circle) / 2;
        position.left += width(circle) / 2;
        return position;
    }

    getPosition(element: HTMLElement): Position {
        // Get position relative to offset parent (like jQuery's .position())
        return {
            top: element.offsetTop,
            left: element.offsetLeft
        };
    }

    /**
     * For this version, try replacing the lines as we go.
     * Then we can follow the process in the debugger.
     */
    findByLine(paragraph: HTMLElementWithLettering, circleCenter: Position, radius: number): void {
        // Break it into words
        paragraph.lettering('words');

        const lines: string[] = [];
        const words = $$('[class^="word"]', paragraph) as HTMLElement[];
        const numWords = words.length;
        let wordIndex = 0;
        let word = words[wordIndex];
        let wordPosition: Position;
        let linePosition: Position;

        // While there are still words, keep going and put them into lines
        while (wordIndex < numWords) {
            // Calculate the appropriate margin for the line starting with that word
            linePosition = wordPosition = this.getPosition(word);
            const margin = this.getLineMargin(linePosition, height(word), circleCenter, radius, word);
            let line = '';
            const wordsOnLine: HTMLElement[] = [];

            // Apply negative margin to current word
            css(word, 'margin-left', margin + 'px');

            // See which words are on the top line and put them in a new span with the correct margin
            while ((wordIndex < numWords) && (wordPosition.top == linePosition.top)) {
                line += word.textContent + ' '; // All lines will end in a space.
                wordsOnLine.push(word);
                // Set up for next word
                wordIndex++;
                word = words[wordIndex];
                if (word) {
                    wordPosition = this.getPosition(word);
                }
            }
            const span = '<span class="line' + lines.length + '" style="margin-left:' + margin + 'px;">' + line + '<br/></span>';
            lines.push(span);

            // Remove all of the words on the line and replace with the line span
            for (let i = wordsOnLine.length - 1; i > -1; i--) {
                wordsOnLine[i].remove();
            }
            // Also remove any lines we already added
            const lineElements = $$('[class^="line"]', paragraph) as HTMLElement[];
            lineElements.forEach(el => el.remove());
            // Create spans from all the lines we have and prepend them
            paragraph.insertAdjacentHTML('afterbegin', lines.join(''));
        }
    }

    findByBlock(paragraph: HTMLElementWithLettering, circleCenter: Position, radius: number): void {
        paragraph.lettering('smartlines');

        const lineElements = $$('[class^="line"]', paragraph) as HTMLElement[];
        lineElements.forEach(line => {
            const margin = this.getLineMargin(this.getPosition(line), height(line), circleCenter, radius);
            css(line, 'margin-left', margin + 'px');
        });
    }

    /**
     * We want to know what the horizontal distance should be in order to make the hypoteneuse equal the radius.
     * We can then apply negative margin to line left to bring it to that point.
     */
    getLineMargin(line: Position, lineHeight: number, circle: Position, radius: number, word?: HTMLElement): number {
        const dy = (line.top + lineHeight * 0.5) - circle.top;
        const dXgoal = Math.sqrt((radius * radius) - (dy * dy));
        const dXcurrent = line.left - circle.left;
        const margin = ((dXcurrent - dXgoal) * -1);
        return margin;
    }
}
