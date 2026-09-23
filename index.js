const ROOT_ID = 'st-input-symbol-buttons';

function insertAtCursor(text) {
    const textarea = document.querySelector('#send_textarea');
    if (!textarea) return;

    textarea.focus();

    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? start;

    textarea.setRangeText(text, start, end, 'end');

    // Let SillyTavern and any listening extensions know the input changed.
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function createButton(iconClass, text, title) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'stisb--button';
    button.title = title;
    button.setAttribute('aria-label', title);

    const icon = document.createElement('i');
    icon.className = iconClass;
    button.appendChild(icon);

    // Prevent the textarea from losing its selection before insertion.
    button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
    });

    button.addEventListener('click', () => insertAtCursor(text));

    return button;
}

function mountButtons() {
    if (document.getElementById(ROOT_ID)) return;

    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'stisb--buttons';

    root.append(
        createButton('fa-solid fa-quote-left', '"', 'Insert "'),
        createButton('fa-solid fa-star-of-life', '*', 'Insert *'),
    );

    document.body.appendChild(root);
}

function init() {
    mountButtons();

    // Re-add the buttons if another UI refresh removes them.
    const observer = new MutationObserver(() => {
        if (!document.getElementById(ROOT_ID)) {
            mountButtons();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
