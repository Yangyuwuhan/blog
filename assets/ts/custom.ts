import '../js/canvas-nest.js';

document.addEventListener('DOMContentLoaded', () =>
{
    const highlights = document.querySelectorAll('.highlight');

    highlights.forEach(highlight =>
    {
        // 1. Language Label
        const codeElement = highlight.querySelector('code[data-lang]');
        if (codeElement) {
            let lang = codeElement.getAttribute('data-lang');
            if (lang && lang.toLowerCase() !== 'fallback') {
                const langLabel = document.createElement('div');
                langLabel.className = 'code-lang-label';
                langLabel.innerText = lang.toUpperCase();
                highlight.appendChild(langLabel);
            }
        }

        // 2. Expand/Collapse logic (10 lines limit)
        // Adjust the maxHeight value depending on the exact line-height in Stack theme
        const maxHeight = 300;

        if (highlight.clientHeight > maxHeight) {
            highlight.classList.add('collapsed');

            const btnContainer = document.createElement('div');
            btnContainer.className = 'code-expand-btn-container';

            const btn = document.createElement('button');
            btn.className = 'code-expand-btn';
            btn.innerHTML = '<span>展开</span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

            btnContainer.appendChild(btn);
            highlight.appendChild(btnContainer);

            btn.addEventListener('click', () =>
            {
                if (highlight.classList.contains('collapsed')) {
                    highlight.classList.remove('collapsed');
                    btn.innerHTML = '<span>收起</span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
                } else {
                    highlight.classList.add('collapsed');
                    btn.innerHTML = '<span>展开</span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                    highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
    });
});
