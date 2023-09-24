import dom from './dom.js';
import store from './store.js';
import {getRandomString} from './utils.js';

const pathContainer = dom.query('.path-container');
const pathWrapper = pathContainer.query('.path-wrapper');
const pathList = pathContainer.query('.path-list');
const pathHeader = pathContainer.query('.path-header');
const timeline = pathWrapper.query('.timeline-container');
const timelineNative = timeline.nativeElement(true);

function generateTimelineLabels() {
    const labelInterval = 1; // Co ile sekund ma być wyświetlana etykieta
    const pixelsPerSecond = 50;

    timelineNative.innerHTML = ''; // Wyczyść zawartość, aby uniknąć podwójnych etykiet

    const containerWidth = timelineNative.offsetWidth; // Szerokość rodzica
    const scrollLeft = timelineNative.scrollLeft; // Pozycja przewijania
    const totalSeconds = Math.floor(containerWidth / pixelsPerSecond); // Oblicz ilość sekund
    const startTime = Math.floor(scrollLeft / pixelsPerSecond); // Czas rozpoczęcia
    const endTime = startTime + totalSeconds; // Czas zakończenia

    for (let second = startTime; second <= endTime; second += labelInterval) {
        const label = document.createElement('div');
        label.classList.add('timeline-label');
        label.textContent = second + 's';
        timelineNative.appendChild(label);
    }
}

function listenToTimelineScroll() {

    const pathContainerEl = pathContainer.nativeElement(true);
    let previousScrollLeft = pathContainerEl.scrollLeft;
    let previousScrollTop = pathContainerEl.scrollTop;

    pathContainer.on('scroll', e => {
        const {target} = e;
        const {scrollLeft, scrollTop, scrollWidth, scrollHeight, offsetHeight, offsetWidth} = target;
        const currentScrollLeft = scrollLeft;
        const currentScrollTop = scrollTop;
        const spaceLeftX = scrollWidth - (scrollLeft + offsetWidth);
        const spaceLeftY = scrollHeight - (scrollTop + offsetHeight);

        if (currentScrollLeft > previousScrollLeft) {
            if (spaceLeftX < 300) {
                pathWrapper.style({
                    width: `${scrollWidth + 300}px`,
                });
                generateTimelineLabels();
            }
        } else if (currentScrollLeft < previousScrollLeft) {
            if (spaceLeftX > 300) {
                pathWrapper.style({
                    width: `${scrollWidth - 300}px`,
                });
                generateTimelineLabels();
            }
        }

        if (currentScrollTop > previousScrollTop) {
            if (spaceLeftY < 200) {
                addPaths(4);
            }
        } else if (currentScrollTop < previousScrollTop) {
            if (spaceLeftY > 200) {
                removeLastEmptyPaths(4);
            }
        }

        previousScrollLeft = currentScrollLeft;
        previousScrollTop = currentScrollTop;
    });
}

function listenTimelineClick() {
    pathWrapper.on('click', e => {
        if (e.target.matches('.path')) {
            selectPath(e.target.getAttribute('data-id'));
        }
    });
}

function addPaths(count = 1) {

    const paths = store.get('paths');
    const newPaths = Array(count).fill(null).map(_ => ({
        id: getRandomString(),
        data: [],
    }));

    paths.push(...newPaths);

    const content = newPaths.map(({id}) =>
        `<div class="path" data-id="${id}"></div>`,
    ).join('');
    pathList.append(content);
    pathHeader.append(content);
}

function removeLastEmptyPaths(count = 1) {
    /**
     *
     * @type {*[]}
     */
    const paths = store.get('paths');
    const pathListNative = pathList.nativeElement(true);
    const pathHeaderNative = pathHeader.nativeElement(true);
    for (let i = 0; i < count; i++) {
        const lastPath = paths[paths.length - 1];
        if (lastPath.data.length) {
            return;
        }
        paths.pop();
        if (pathListNative.children.length > 0) {
            const lastChild = pathListNative.lastElementChild;
            pathListNative.removeChild(lastChild);
        }
        if (pathHeaderNative.children.length > 0) {
            const lastChild = pathHeaderNative.lastElementChild;
            pathHeaderNative.removeChild(lastChild);
        }
    }
}

function runListeners() {
    listenToTimelineScroll();
    listenTimelineClick();
}

function selectPath(id) {
    pathList.query('.path').removeClass('selected');
    pathHeader.query('.path').removeClass('selected');

    pathList.query(`.path[data-id="${id}"]`).addClass('selected');
    pathHeader.query(`.path[data-id="${id}"]`).addClass('selected');

    store.set('selectedPath', id);
}


function fillTimeline() {
    const paths = store.get('paths');
    const content = paths.map(({id}) =>
        `<div class="path" data-id="${id}"></div>`,
    ).join('');
    pathList.append(content);
    pathHeader.append(content);
}

function initTimeline() {
    runListeners();
    generateTimelineLabels();
    fillTimeline();
    addPaths(20);
}

export default {
    initTimeline,
    selectPath,
};
