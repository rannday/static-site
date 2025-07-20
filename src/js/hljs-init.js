import hljs from 'highlight.js/lib/core';
import dos from 'highlight.js/lib/languages/dos';

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
  button.style.background = 'none';
  button.style.border = 'none';

  const icon = document.createElement('img');
  icon.src = '/icons/content_copy.svg';
  icon.alt = 'Copy';
  icon.style.width = '1rem';
  icon.style.height = '1rem';

  button.appendChild(icon);

  button.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      icon.src = '/icons/done_outline.svg';
      icon.alt = 'Copied!';
      setTimeout(() => {
        icon.src = '/icons/content_copy.svg';
        icon.alt = 'Copy';
      }, 1500);
    });
  });

  pre.appendChild(button);
});

