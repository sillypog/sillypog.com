// Import SCSS
import '../scss/sillypogcom.scss';

// Import jQuery and make it global (required for plugins and existing code)
import jQuery from 'jquery';

// Extend Window interface for global jQuery and TweenLite
declare global {
  interface Window {
    jQuery: typeof jQuery;
    $: typeof jQuery;
    TweenLite: {
      to: (target: gsap.TweenTarget, duration: number, vars: any) => gsap.core.Tween;
    };
  }
}

window.jQuery = window.$ = jQuery;

// Import jQuery plugins that work with static imports
import 'jquery-bbq';

// Dynamically import letteringjs after jQuery is global (it checks for jQuery at load time)
await import('letteringjs');

// Import GSAP (replaces old GreenSock)
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { EasePack } from 'gsap/EasePack';

// Register GSAP plugins
gsap.registerPlugin(CSSPlugin, EasePack);

// Make TweenLite available globally (for backward compatibility)
// GSAP 3 uses gsap.to() but old code uses TweenLite.to()
window.TweenLite = {
  to: (target: gsap.TweenTarget, duration: number, vars: any): gsap.core.Tween => {
    // Convert old TweenLite syntax to GSAP 3 syntax
    const newVars: any = { ...vars, duration };
    if (vars.css) {
      Object.assign(newVars, vars.css);
      delete newVars.css;
    }
    if (vars.css && vars.css.alpha !== undefined) {
      newVars.opacity = vars.css.alpha;
    }
    return gsap.to(target, newVars);
  }
};

// Import custom utilities
import './utils/index.ts';

// Import main application entry point
import './app.ts';
