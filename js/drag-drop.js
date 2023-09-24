import dom from './dom.js';
import {htmlToNodeElements} from './utils.js';

function dragover(ev) {
    ev.preventDefault();
    ev.target.classList.add('dragover');
    console.log(ev);
    const rect = ev.target.getBoundingClientRect();
    const scrollLeft = ev.target.scrollLeft;

    const x = ev.clientX - rect.left + scrollLeft;

    ev.target.style.setProperty('--data-preview-left-pos', `${x}px`);

}

function dragLeave(ev) {
    ev.target.classList.remove('dragover');
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.getAttribute('data-drag-data'));
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    // ev.target.appendChild(document.getElementById(data));
    console.log(data);
    // ev.target.classList.remove('dragover')
    ev.target.append(...htmlToNodeElements(
        `<div class="m-item">${data}</div>`,
    ));
}

function initListeners() {

    dom.query('body').on('drop', e => {
        if (!e.target.matches('.path-list .path')) {
            return;
        }
        drop(e);
    });
    dom.query('body').on('dragover', e => {
        if (!e.target.matches('.path-list .path')) {
            return;
        }
        dragover(e);
    });
    dom.query('body').on('dragleave', e => {
        if (!e.target.matches('.path-list .path')) {
            return;
        }
        dragLeave(e);
    });
    dom.query('body').on('dragstart', e => {
        if (!e.target.matches('[draggable]')) {
            return;
        }
        drag(e);
    });

}


export default {
    initListeners,
};
