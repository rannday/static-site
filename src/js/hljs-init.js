import hljs from 'highlight.js/lib/core';
import dos from 'highlight.js/lib/languages/dos';
import { createElement } from 'lucide';
import Copy from 'lucide/dist/esm/icons/copy.js';
import Check from 'lucide/dist/esm/icons/check.js';

hljs.registerLanguage('dos', dos);
hljs.highlightAll();

document.querySelectorAll('pre > code').forEach(codeBlock => {
  const pre = codeBlock.parentNode;
  pre.style.position = 'relative';

  const button = document.createElement('button');
  button.className = 'copy-button';
  button.style.position = 'absolute';
  button.style.top = '0.5em';
  button.style.right = '0.5em';
  button.style.padding = '0.25em';
  button.style.cursor = 'pointer';
  button.style.color = 'white';
  button.style.background = 'none';
  button.style.border = 'none';

  let icon = createElement(Copy);
  icon.setAttribute('width', '16');
  icon.setAttribute('height', '16');

  button.appendChild(icon);

  button.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      const newIcon = createElement(Check);
      newIcon.setAttribute('width', '16');
      newIcon.setAttribute('height', '16');
      button.replaceChild(newIcon, icon);
      icon = newIcon;

      setTimeout(() => {
        const resetIcon = createElement(Copy);
        resetIcon.setAttribute('width', '16');
        resetIcon.setAttribute('height', '16');
        button.replaceChild(resetIcon, icon);
        icon = resetIcon;
      }, 1500);
    });
  });

  pre.appendChild(button);
});
