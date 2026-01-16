// Template functions using template literals
// Replaces jquery-tmpl templates from index.html

export interface LinkTemplateData {
    icon: string;
    url: string;
}

/**
 * Link template - creates a portfolio circle with an icon
 * @param data - Template data containing icon identifier and URL
 * @returns HTML string
 */
export function linkTemplate(data: LinkTemplateData): string {
    return `<div class="portfolioCircle">
      <div class="linksTopSpacer"></div>
      <div class="link-${data.icon}"></div>
    </div>`;
}

/**
 * Portfolio intro placeholder - creates initial portfolio elements
 * @returns HTML string
 */
export function portfolioIntroPlaceholder(): string {
    return `<div class="bigCircle movable"></div>
    <img id="pc1" class="movable" svg-src="twitterT" />
    <img id="pc2" class="movable" svg-src="acrobatA" />
    <img id="pc3" class="movable" svg-src="exitAbout"/>`;
}
