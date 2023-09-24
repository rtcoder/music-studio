import dom from './dom.js';

const keys = [';', 'a', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'o', 'p', 's', 't', 'u', 'w', 'y'];
const audioList = {
    ';': new Audio('tunes/;.wav'),
    'a': new Audio('tunes/a.wav'),
    'd': new Audio('tunes/d.wav'),
    'e': new Audio('tunes/e.wav'),
    'f': new Audio('tunes/f.wav'),
    'g': new Audio('tunes/g.wav'),
    'h': new Audio('tunes/h.wav'),
    'j': new Audio('tunes/j.wav'),
    'k': new Audio('tunes/k.wav'),
    'l': new Audio('tunes/l.wav'),
    'o': new Audio('tunes/o.wav'),
    'p': new Audio('tunes/p.wav'),
    's': new Audio('tunes/s.wav'),
    't': new Audio('tunes/t.wav'),
    'u': new Audio('tunes/u.wav'),
    'w': new Audio('tunes/w.wav'),
    'y': new Audio('tunes/y.wav'),
};

function playAudio(key) {
    const audio = audioList[key];
    audio.currentTime = 0;
    audio.play();
    const keyElement = dom.query(`.key[data-key="${key}"]`);
    keyElement.addClass('active');
    setTimeout(() => keyElement.removeClass('active'), 100);
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

export default {
    initListeners,
};
