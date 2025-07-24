import hljs from 'highlight.js/lib/core';
import dos from 'highlight.js/lib/languages/dos';

hljs.registerLanguage('dos', dos);
hljs.highlightAll();

document.querySelectorAll('pre > code').forEach(codeBlock => {
  const pre = codeBlock.parentNode;
  pre.style.position = 'relative';

  const button = document.createElement('button');
  button.className = 'copy-button';
  button.title = 'Copy code';
  button.setAttribute('aria-label', 'Copy code');

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-copy');
  icon.appendChild(use);
  button.appendChild(icon);

  button.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-check');
      setTimeout(() => {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-copy');
      }, 1500);
    });
  });

  pre.appendChild(button);
});
