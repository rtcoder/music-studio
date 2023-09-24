import dom from './dom.js';
import dragDrop from './drag-drop.js';
import instrument from './instrument.js';
import store from './store.js';
import timeline from './timeline.js';

store.init({
    paths: [],
    selectedPath: null,
    progressPosition: 0,
    msProgress: 0,
    isPlaying: false,
    startPlayTime: null,
    loopTime: 2,
    loopEnabled: false,
});

timeline.initTimeline();

timeline.selectPath(store.get('paths.0.id'));
dragDrop.initListeners();
instrument.init();

dom.query('.top .controls').on('click', e => {
    if (e.target.matches('.play')) {
        timeline.playTimeline();
    }
    if (e.target.matches('.pause')) {
        timeline.pauseTimeline();
    }
    if (e.target.matches('.stop')) {
        timeline.stopTimeline();
    }
});
