import { renderIcon } from './lib/icon.js';
import { externalLink } from 'lucide'; 

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  const svg = renderIcon(externalLink());
  svg.setAttribute('aria-hidden', 'true');
  svg.style.marginLeft = '0.25em';
  link.appendChild(svg);
});
