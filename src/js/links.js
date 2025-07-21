import { renderIcon } from './lib/icon.js';
import externalLink from 'lucide/dist/esm/icons/external-link.js';

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  const svg = renderIcon(externalLink); // returns the SVG element
  svg.setAttribute('aria-hidden', 'true');
  svg.style.marginLeft = '0.25em';
  link.appendChild(svg);
});
