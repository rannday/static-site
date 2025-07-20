import { createElement } from 'lucide';
import { default as ExternalLinkIcon } from 'lucide/dist/esm/icons/external-link.js';

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  const icon = createElement(ExternalLinkIcon);
  icon.setAttribute('aria-hidden', 'true');
  icon.style.marginLeft = '0.25em';
  link.appendChild(icon);
});
