import dom from './dom.js';
import {audioList} from './instrument.js';
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
        label.textContent = (second + 1) + 's';
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

function getPathItem(item, pathId) {
    return `<div class="path-item" draggable="true"
                style="left: ${item.leftPos}px; width: ${item.width}px;"
                data-drag-data="{id:'${item.id}', pathId:'${pathId}'}"></div>`;
}

function fillTimeline() {
    pathList.empty();
    pathHeader.empty();
    const paths = store.get('paths');
    const content = paths.map(({id, data}) => {
        const pathData = data.map(item => getPathItem(item, id)).join('');
        return `<div class="path" data-id="${id}">${pathData}</div>`;
    }).join('');
    pathList.append(content);
    pathHeader.append(content);

    selectPath(store.get('selectedPath'))
}

function initTimeline() {
    runListeners();
    generateTimelineLabels();
    fillTimeline();
    addPaths(20);
}

function playTimeline() {
    if (store.get('isPlaying')) {
        return;
    }
    store.set('isPlaying', true);
    runTimelineProgress(false);
}

function pauseTimeline() {
    store.set('isPlaying', false);
}

function stopTimeline() {
    store.set('isPlaying', false);
    setProgressMs(0);
}

function runTimelineProgress(incrementMs = true) {
    const msProgress = store.get('msProgress');
    if (incrementMs) {
        const loopEnabled = store.get('loopEnabled');
        const loopTime = store.get('loopTime');
        if (loopEnabled && loopTime !== null && loopTime * 1000 <= msProgress) {
            setProgressMs(0);
        } else {
            setProgressMs(msProgress + 20);
        }
    }
    const paths = store.get('paths');
    paths.forEach(path => {
        path.data.filter(({start, end})=>{
            return start<=msProgress&&end>=msProgress
        }).filter(({audio})=>{
            return audio.paused
        }).forEach(({audio})=>audio.play());
    });

    if (store.get('isPlaying')) {
        setTimeout(runTimelineProgress, 20);
    }
}

function setProgressPosition(position) {
    pathList.style({
        '--progress-pos': `${position}px`,
    });
}

function setProgressMs(ms) {
    store.set('msProgress', ms);
    setProgressPosition(
        calculateProgressPosition(ms),
    );
}

function calculateProgressPosition(ms) {
    const secondWidth = 50;
    return ms / (1000 / secondWidth);
}

function addSoundToPath(soundId) {
    const selectedPathId = store.get('selectedPath');
    const paths = store.get('paths');
    const msProgress = store.get('msProgress');
    const audioDefinition = audioList[soundId];
    const end = audioDefinition.duration + msProgress;
    const leftPos = calculateProgressPosition(msProgress);
    const width = calculateProgressPosition(end) - leftPos;
    const sound = {
        id: getRandomString(),
        audio: new Audio(audioDefinition.audio.src),
        start: msProgress,
        end,
        leftPos,
        width,
    };

    store.set('paths', paths.map(path => {
        if (path.id === selectedPathId) {
            path.data.push(sound);
        }

        return path;
    }));

    fillTimeline();
}

export default {
    initTimeline,
    selectPath,
    playTimeline,
    pauseTimeline,
    stopTimeline,
    addSoundToPath,
};
