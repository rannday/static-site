import { createElement, defaultAttributes } from 'lucide';

export function renderIcon(iconDef, targetId) {
  const svg = createSvg(iconDef);
  if (targetId) {
    document.getElementById(targetId)?.appendChild(svg);
  }
  return svg;
}

export function createSvg(iconDef) {
  const svg = createElement('svg', { ...defaultAttributes, ...iconDef[0][1] });
  for (const [tag, attrs] of iconDef.slice(1)) {
    svg.appendChild(createElement(tag, attrs));
  }
  return svg;
}
