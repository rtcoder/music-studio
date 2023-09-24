import dom from './dom.js';
import store from './store.js';
import timeline from './timeline.js';

const keys = [';', 'a', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'o', 'p', 's', 't', 'u', 'w', 'y'];
export const audioList = {};

function playAudio(key) {
    const audio = audioList[key].audio;

    if (store.get('isPlaying')) {
        timeline.addSoundToPath(key);
    }

    audio.currentTime = 0;
    audio.play();
    const keyElement = dom.query(`.key[data-key="${key}"]`);
    keyElement.addClass('active');
    setTimeout(() => keyElement.removeClass('active'), 100);
}

function initAudio() {
    keys.forEach(key => {
        const audio = new Audio(`tunes/${key}.wav`);
        audioList[key] = {
            audio,
            duration: 0,
        };

        audio.addEventListener('loadedmetadata', () => {
            audioList[key].duration = audio.duration * 1000;
        });
    });
}

function initListeners() {
    dom.query('body').on('keydown', e => {
        if (!keys.includes(e.key)) {
            return;
        }
        playAudio(e.key);
    });

    let mousedown = false;
    let lastKey = null;
    dom.query('.piano').on({
        'click': e => {
            if (!e.target.matches('.key')) {
                return;
            }
            lastKey = e.target.dataset.key;
            playAudio(lastKey);
        },
        'mousemove': e => {
            if (lastKey === e.target.dataset.key || !mousedown || !e.target.matches('.key')) {
                return;
            }
            lastKey = e.target.dataset.key;
            playAudio(lastKey);
        },
        'mouseup': _ => {
            mousedown = false;
            lastKey = null;
        },
        'mouseleave': _ => {
            mousedown = false;
            lastKey = null;
        },
        'mousedown': _ => mousedown = true,
    });
}

function init() {
    initAudio();
    initListeners();
}

export default {
    init,
};
